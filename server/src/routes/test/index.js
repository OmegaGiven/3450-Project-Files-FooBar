import { Router } from 'express'
import {default_inventory} from './inventory_data'

const router = new Router()

router.get('/profile/', (request, response) =>
	response.json({ name: 'Jared Scott', email: 'jared@msn.com', accountBal: 85 })
)

router.get('/inventory/', (request, response) =>
	response.json(default_inventory)
)
router.get('/', (request, response) =>
	response.json({ hello: 'world', number: Math.random() })
)

export default router
