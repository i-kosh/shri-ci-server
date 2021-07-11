import { config } from 'dotenv'

interface Config {
  AGENT_PORT: number
  SERVER_HOST: string
  SERVER_PORT: number
  agentUnregisterPath: string
  agentRegisterPath: string
  agentResultPath: string
  agentHealthPath: string
}

const { parsed, error } = config()

if (error || !parsed) {
  console.log('Please create .env file as it shown in .env.example')
  process.exit(0)
}

const cfg: Config = {
  AGENT_PORT: +parsed.AGENT_PORT,
  SERVER_HOST: parsed.SERVER_HOST,
  SERVER_PORT: +parsed.SERVER_PORT,
  agentUnregisterPath: '/api/agent/unregister',
  agentRegisterPath: '/api/agent/register',
  agentResultPath: '/api/agent/result',
  agentHealthPath: '/api/agent/health',
}

const validate = (config: Config) => {
  const { AGENT_PORT, SERVER_HOST, SERVER_PORT } = config

  if (!AGENT_PORT)
    throw new Error('AGENT_PORT is undefined, please define it in .env')
  if (!SERVER_HOST)
    throw new Error('SERVER_HOST is undefined, please define it in .env')
  if (!SERVER_PORT)
    throw new Error('SERVER_PORT is undefined, please define it in .env')
}

validate(cfg)

console.log('Agent config:\n', cfg)

export default cfg
