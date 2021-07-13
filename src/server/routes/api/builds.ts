import { Router } from 'express'
import getBuildList from '../../controllers/getBuildList'
import getBuild from '../../controllers/getBuild'
import getBuildLogs from '../../controllers/getBuildLogs'
import queueBuild from '../../controllers/queueBuild'
import { addCache } from '../../middlewares/cache'

const router = Router()

router.get('/', getBuildList)

router.get('/:buildId', getBuild)

router.post('/:commitHash', queueBuild)

router.get('/:buildId/logs', addCache(getBuildLogs))

export default router
