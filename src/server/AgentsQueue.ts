import { v4 as uuid } from 'uuid'
import { dim, green, yellow, cyan, red } from 'colors'
import { ServerError } from './ServerError'
import cfg from './config'

interface Agent {
  id: string
  host: string
  port: string
  lastHealthTimestamp: number
}

interface UnhealthyAgent extends Agent {
  wasFree?: boolean
  del?: boolean
}

type AgentRequest = (agent: Agent) => void

export class AgentsQueue {
  private registeredAgents: Agent[]
  private freeAgentsPool: Agent[]
  private unhealthyAgentsPool: UnhealthyAgent[]
  private agentsRequestsPool: AgentRequest[]
  private agentHealthReportRate: number
  private agentHealthMaxMiss: number

  constructor() {
    this.freeAgentsPool = []
    this.registeredAgents = []
    this.agentsRequestsPool = []
    this.unhealthyAgentsPool = []
    this.agentHealthMaxMiss = 3
    this.agentHealthReportRate = cfg.AGENTS_REPORT_RATE_MS

    this.startHealthObserver()
  }

  private startHealthObserver() {
    const checkInterval = 1000 * 10 // 10s

    setInterval(() => {
      // Проверяем все зарегестрированные агенты и если агент не
      // отчитывался за текущий период то извлекаем его из всех
      // доступных очередей и помещяем в очередь для "больных"
      this.registeredAgents.forEach((agent) => {
        const fromLastCheck = Date.now() - agent.lastHealthTimestamp

        if (fromLastCheck >= this.agentHealthReportRate) {
          this.registeredAgents = this.registeredAgents.filter(
            (val) => val.id !== agent.id
          )
          const wasInFree =
            this.freeAgentsPool.findIndex((val) => val.id === agent.id) > -1
          this.freeAgentsPool = this.freeAgentsPool.filter(
            (val) => val.id !== agent.id
          )

          this.unhealthyAgentsPool.push({
            ...agent,
            wasFree: wasInFree,
          })

          console.log(
            yellow(`Agent id:${agent.id} not reported in expected time`)
          )
          this.reportStat()
        }
      })

      // Находим агенты которые слишком долго не выходили на связь
      // и помечаем их на удаление
      this.unhealthyAgentsPool.forEach((unhealthyAgent) => {
        const isTooLong =
          Date.now() - unhealthyAgent.lastHealthTimestamp >
          this.agentHealthReportRate * this.agentHealthMaxMiss

        if (isTooLong) {
          console.log(
            red(
              `Agent id:${unhealthyAgent.id}, not responding for ${this.agentHealthMaxMiss} time(s) in row - agent will be removed`
            )
          )
          unhealthyAgent.del = true
        }
      })
      // Окончательно удаляем помеченные агенты
      this.unhealthyAgentsPool = this.unhealthyAgentsPool.filter(
        (agent) => !agent.del
      )
    }, checkInterval)
  }

  private reportStat() {
    console.log(
      cyan(
        `Agents registered: ${this.registeredAgents.length}\n` +
          `Agents free: ${this.freeAgentsPool.length}\n` +
          `Agents unhealthy: ${this.unhealthyAgentsPool.length}\n` +
          `Agents requests in queue: ${this.agentsRequestsPool.length}`
      )
    )
  }

  public freeAgent(id: string): void {
    const agent = this.registeredAgents.find((val) => val.id === id)
    if (!agent) {
      // Агент больше не зарегистрирован - ничего не делаем
      return
    }

    const agentRequest = this.agentsRequestsPool.shift()
    if (agentRequest) {
      agentRequest(agent)
    } else {
      const isAgnetAlreadyFree = this.freeAgentsPool.findIndex(
        (val) => val.id === agent.id
      )
      if (isAgnetAlreadyFree < 0) {
        this.freeAgentsPool.push(agent)
      }
    }

    this.reportStat()
  }

  public async registerAgent(
    host: string,
    port: string
  ): Promise<{
    id: string
    maxHealthCheckMiss: number
    healthReportRate: number
  }> {
    const agentID = uuid()
    const agent: Agent = {
      id: agentID,
      host,
      port,
      lastHealthTimestamp: Date.now(),
    }

    const existed = this.registeredAgents.findIndex(
      (val) => val.host === agent.host && val.port === agent.port
    )
    if (existed !== -1)
      throw new ServerError({
        message: 'That agent already registered',
        status: 400,
      })

    this.registeredAgents.push(agent)
    this.freeAgent(agentID)

    console.log(green(`Agent id:${agentID} - registered`))
    return {
      id: agentID,
      healthReportRate: this.agentHealthReportRate,
      maxHealthCheckMiss: this.agentHealthMaxMiss,
    }
  }

  public unregisterAgent(id: string, reason?: string): void {
    this.registeredAgents = this.registeredAgents.filter(
      (agent) => agent.id !== id
    )
    this.freeAgentsPool = this.freeAgentsPool.filter((agent) => agent.id !== id)

    console.log(yellow(`Agent id:${id} - unregistered\n${dim(reason || '')}`))
    this.reportStat()
  }

  public async reserveFreeAgent(): Promise<Agent> {
    const frstAgent = this.freeAgentsPool.shift()
    if (frstAgent) {
      this.reportStat()
      return frstAgent
    }

    return new Promise((resolve) => {
      this.agentsRequestsPool.push(resolve)
      this.reportStat()
    })
  }

  public reportHealth(agentID: string): void {
    const agent = this.registeredAgents.find((agent) => agent.id === agentID)
    if (agent) {
      // Агент отчитался
      agent.lastHealthTimestamp = Date.now()
    } else {
      // Агента нет среди зарегистрированных - возможно он был помещен в очередь для "больных"
      const unhealthyAgent = this.unhealthyAgentsPool.find(
        (agent) => agent.id === agentID
      )

      if (unhealthyAgent) {
        // Возвращаем агента в строй
        console.log(green(`Agent id:${unhealthyAgent.id} now is healthy`))

        this.registeredAgents.push({
          id: unhealthyAgent.id,
          host: unhealthyAgent.host,
          port: unhealthyAgent.port,
          lastHealthTimestamp: Date.now(),
        })

        if (unhealthyAgent.wasFree) {
          // Заново добавляем агента в очередь свободных, т.к он был оттуда изъят
          this.freeAgent(unhealthyAgent.id)
        }

        this.unhealthyAgentsPool = this.unhealthyAgentsPool.filter(
          (val) => val.id !== unhealthyAgent.id
        )

        this.reportStat()
      } else {
        // Агент отчитался но его нет среди зарегистрированных и "больных"

        console.error(
          `Agent ${agentID}, not found in registered but reported health`
        )
      }
    }
  }
}

export default new AgentsQueue()
