import { Router } from 'express'
import getBuildList from '../controllers/getBuildList'
import getBuild from '../controllers/getBuild'
import getBuildLogs from '../controllers/getBuildLogs'
import queueBuild from '../controllers/queueBuild'

const router = Router()

router.get('/', getBuildList)

router.get('/:buildId', getBuild)

router.post('/:commitHash', queueBuild)

router.get('/:buildId/logs', getBuildLogs)

export default router
