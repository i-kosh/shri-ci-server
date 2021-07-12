import { config } from 'dotenv'

interface Config {
  AGENT_PORT: number
  AGENT_HOST: string
  SERVER_HOST: string
  SERVER_PORT: number
  agentUnregisterPath: string
  agentRegisterPath: string
  agentResultPath: string
  agentHealthPath: string
  isDocker: boolean
}

if (process.env.DOCKER) {
  console.info('🐳 Running in docker')
} else {
  const { parsed, error } = config()

  if (error || !parsed) {
    console.log('Please create .env file as it shown in .env.example')
    process.exit(0)
  }

  console.info('⚙ Running in standard environment (.env loaded)')
}

const isDocker = !!process.env.DOCKER
const cfg: Config = {
  AGENT_PORT: parseInt(process.env.AGENT_PORT || `0`) || isDocker ? 80 : 3050,
  AGENT_HOST:
    process.env.AGENT_HOST || isDocker
      ? process.env.HOSTNAME || ''
      : '127.0.0.1',
  SERVER_HOST: process.env.SERVER_HOST || '',
  SERVER_PORT: parseInt(process.env.SERVER_PORT || `0`),
  agentUnregisterPath: '/api/agent/unregister',
  agentRegisterPath: '/api/agent/register',
  agentResultPath: '/api/agent/result',
  agentHealthPath: '/api/agent/health',
  isDocker,
}

const validate = (config: Config) => {
  const { AGENT_PORT, SERVER_HOST, SERVER_PORT, AGENT_HOST } = config

  try {
    if (!AGENT_PORT || AGENT_PORT < 1)
      throw new Error(`AGENT_PORT is ${AGENT_PORT}, please define it in .env`)
    if (!AGENT_HOST)
      throw new Error(`AGENT_HOST is ${AGENT_HOST}, please define it in .env`)
    if (!SERVER_HOST)
      throw new Error(`SERVER_HOST is ${SERVER_HOST}, please define it in .env`)
    if (!SERVER_PORT || SERVER_PORT < 1)
      throw new Error(`SERVER_PORT is ${SERVER_PORT}, please define it in .env`)
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
}

validate(cfg)

console.log('Agent config:\n', cfg)

export default cfg
