import cors from 'cors'
import express, { Router } from 'express'
import morgan from 'morgan'
import cfg from '../config'

export const beforeRoutes = Router()
beforeRoutes.use(cors())
beforeRoutes.use(morgan(cfg.NODE_ENV !== 'production' ? 'dev' : 'combined'))
beforeRoutes.use(express.json())
