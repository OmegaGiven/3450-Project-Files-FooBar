// @flow
import { Router } from 'express'
import { verifyUserHasRole } from '../../middleware/auth'
import type {
	AuthenticatedUserRequest,
	MaybeUserRequest,
	InventoryItemCategory,
} from '../../utils/types'
import { Item } from '../../models/inventoryItem'
import * as validate from '../../utils/validators'
import { ROLES, INVENTORY_ITEM_CATEGORIES_ENUM } from '../../utils/constants'
import { Types as mongooseTypes } from 'mongoose'

const router = new Router()

const ITEM_VALIDATOR = validate.isObjectWith({
	category: validate.isInEnum(INVENTORY_ITEM_CATEGORIES_ENUM),
	name: validate.isNoneEmptyString,
	quantity: validate.isGreaterOrEqualTo(0),
	price: validate.isGreaterOrEqualTo(0),
	onMenu: validate.isBoolean,
})

const ITEM_UPDATE_VALIDATOR = validate.isObjectWith({
	category: validate.or(
		validate.isUndefined,
		validate.isInEnum(INVENTORY_ITEM_CATEGORIES_ENUM)
	),
	name: validate.or(validate.isUndefined, validate.isNoneEmptyString),
	quantity: validate.or(validate.isUndefined, validate.isGreaterOrEqualTo(0)),
	price: validate.or(validate.isUndefined, validate.isGreaterOrEqualTo(0)),
	onMenu: validate.or(validate.isUndefined, validate.isBoolean),
})

const ITEM_FIELDS_UPDATABLE_BY = {
	[ROLES.CHEF]: ['quantity'],
	[ROLES.MANAGER]: ['category', 'name', 'quantity', 'price', 'onMenu'],
	[ROLES.ADMIN]: ['category', 'name', 'quantity', 'price', 'onMenu'],
}

router.get(
	'/',
	verifyUserHasRole(([ROLES.ADMIN, ROLES.MANAGER, ROLES.CHEF]: any)),
	async (req: MaybeUserRequest<>, res: express$Response) => {
		return res.status(200).json({ data: await Item.find({}).lean() })
	}
)

router.post(
	'/',
	verifyUserHasRole(([ROLES.ADMIN, ROLES.MANAGER]: any)),
	async (
		req: AuthenticatedUserRequest<{
			category: InventoryItemCategory,
			name: string,
			quantity: number,
			price: number,
			onMenu: boolean,
		}>,
		res: express$Response
	) => {
		if (!ITEM_VALIDATOR(req.body)) {
			return res.status(400).json({ reason: 'malformed request' }).end()
		}
		const { category, name, quantity, price, onMenu } = req.body
		const item = new Item({
			category,
			name,
			quantity,
			price,
			onMenu,
		})
		await item.save()
		res.status(200).json({ data: item })
	}
)

router.get(
	'/:id',
	verifyUserHasRole(([ROLES.ADMIN, ROLES.MANAGER]: any)),
	async (
		req: AuthenticatedUserRequest<{}, {| id: string |}>,
		res: express$Response
	) => {
		if (!mongooseTypes.ObjectId.isValid(req.params.id)) {
			return res.status(400).end()
		}
		const item = await Item.findOne({ _id: req.params.id }).lean()
		if (!item) {
			return res.status(404).end()
		}
		return res.status(200).json({ data: item }).end()
	}
)

router.post(
	'/:id',
	verifyUserHasRole(([ROLES.ADMIN, ROLES.MANAGER, ROLES.CHEF]: any)),
	async (
		req: AuthenticatedUserRequest<
			{|
				category?: ?InventoryItemCategory,
				name?: ?string,
				quantity?: ?number,
				price?: ?number,
				onMenu?: ?boolean,
			|},
			{| id: string |}
		>,
		res: express$Response
	) => {
		if (
			!mongooseTypes.ObjectId.isValid(req.params.id) ||
			!ITEM_UPDATE_VALIDATOR(req.body)
		) {
			return res.status(400).json({ reason: 'malformed request' }).end()
		}
		const item = await Item.findOne({ _id: req.params.id })
		if (!item) {
			return res.status(404).end()
		}
		req.user.roles.forEach((role) => {
			if (!ITEM_FIELDS_UPDATABLE_BY[role]) {
				return
			}
			ITEM_FIELDS_UPDATABLE_BY[role].forEach((key) => {
				if (req.body.hasOwnProperty(key)) {
					item[key] = req.body[key]
				}
			})
		})
		await item.save()
		return res.status(200).json({ data: item }).end()
	}
)

export default router
