import { Router } from 'express'
import settingsRouter from './settings'
import buildsRouter from './builds'
import agent from './agent'

const router = Router()

router.use('/settings', settingsRouter)
router.use('/builds', buildsRouter)
router.use('/agent', agent)

export default router
