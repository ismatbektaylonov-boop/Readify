import { NextFunction, Request, Response } from 'express'
import { HttpCode, Message } from '../libs/Errors'
import { ProductCollection } from '../libs/enums/product.enum'
import AuthService from '../models/Auth.service'
import MemberService from '../models/Member.service'

const authService = new AuthService()
const memberService = new MemberService()

class MemberController {
	/* ---------- VIEW RENDER (SSR) ---------- */

	public goHome = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const products = await memberService.getProducts({ page: 1, limit: 5 })
			const stats = await memberService.getHomeStats()
			res.render('home', {
				member: req.session.member ?? null,
				products,
				stats,
				useDisplayFont: true,
			})
		} catch (err) {
			next(err)
		}
	}

	public getLoginPage = (req: Request, res: Response) => {
		if (req.session.member) return res.redirect('/')
		res.render('login', { member: null, error: null })
	}

	public getSignupPage = (req: Request, res: Response) => {
		if (req.session.member) return res.redirect('/')
		res.render('signup', { member: null, error: null })
	}

	public getProductsPage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const page = Number(req.query.page) || 1
			const search = (req.query.search as string) || ''
			const collection =
				(req.query.collection as ProductCollection) || undefined

			const products = await memberService.getProducts({
				page,
				limit: 12,
				search,
				collection,
			})

			res.render('products', {
				member: req.session.member ?? null,
				products,
				search,
				collection: collection ?? '',
			})
		} catch (err) {
			next(err)
		}
	}

	public getOrdersPage = async (req: Request, res: Response) => {
		if (!req.session.member) return res.redirect('/login')
		res.render('orders', { member: req.session.member })
	}

	/* ---------- API (JSON) ---------- */

	public signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Public registration must never be able to assign privileged roles.
			const { memberType, ...signupInput } = req.body
			const newMember = await authService.signup(signupInput)
			res.status(HttpCode.CREATED).json({ success: true, data: newMember })
		} catch (err) {
			next(err)
		}
	}

	public login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const member = await authService.login(req.body)
			req.session.member = member
			res.status(HttpCode.OK).json({ success: true, data: member })
		} catch (err) {
			next(err)
		}
	}

	public logout = (req: Request, res: Response) => {
		req.session.destroy(err => {
			if (err) {
				return res
					.status(HttpCode.INTERNAL_SERVER_ERROR)
					.json({ success: false, message: Message.SOMETHING_WENT_WRONG })
			}
			res.clearCookie('connect.sid')
			res.status(HttpCode.OK).json({ success: true })
		})
	}

	public getProduct = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const product = await memberService.getProduct(req.params.id)
			res.status(HttpCode.OK).json({ success: true, data: product })
		} catch (err) {
			next(err)
		}
	}

	public checkAuth = (req: Request, res: Response) => {
		if (!req.session.member) {
			return res
				.status(HttpCode.UNAUTHORIZED)
				.json({ success: false, message: Message.NOT_AUTHENTICATED })
		}
		res.status(HttpCode.OK).json({ success: true, data: req.session.member })
	}
}

export default MemberController
