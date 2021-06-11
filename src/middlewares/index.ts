import cors from 'cors'
import express, { Router } from 'express'
import morgan from 'morgan'
import cfg from '../config'

const router = Router()

router.use(cors())
router.use(morgan(cfg.NODE_ENV !== 'production' ? 'dev' : 'combined'))
router.use(express.json())

export default router
