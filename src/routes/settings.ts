import { Router } from 'express'

const router = Router()

router.get('/', (req, res, next) => {
  res.json({ lol: 'получение сохраненных настроек' })
})

router.post('/', (req, res, next) => {
  res.json({ lol: 'cохранение настроек' })
})

export default router
