import { Router } from 'express'
import settingsRouter from './settings'
import buildsRouter from './builds'

const router = Router()

router.use('/settings', settingsRouter)
router.use('/builds', buildsRouter)

export default router
