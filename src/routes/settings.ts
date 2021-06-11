import { Router } from 'express'
import getSettings from '../controllers/getSettings'
import saveSettings from '../controllers/saveSettings'

const router = Router()

router.get('/', getSettings)

router.post('/', saveSettings)

export default router
