import { Router } from 'express'

const router = Router()

router.get('/', (req, res, next) => {
  res.json({ lol: 'получение списка сборок' })
})

router.get('/:buildId', (req, res, next) => {
  res.json({ lol: 'получение информации о конкретной сборке' })
})

router.post('/:commitHash', (req, res, next) => {
  res.json({ lol: 'добавление сборки в очередь' })
})

router.get('/:buildId/logs', (req, res, next) => {
  res.json({ lol: 'получение логов билда (сплошной текст)' })
})

export default router
