import { Router } from 'express'
import agentRegister from '../../controllers/agentRegister'
import agentResult from '../../controllers/agentResult'
import agentUnregister from '../../controllers/agentUnregister'
import agentHealthCheck from '../../controllers/agentHealthCheck'

const router = Router()

router.post('/register', agentRegister)
router.post('/result', agentResult)
router.post('/unregister', agentUnregister)
router.post('/health', agentHealthCheck)

export default router
