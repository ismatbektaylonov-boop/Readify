import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import path from 'path'

import ErrorLog, { HttpCode, Message } from './libs/Errors'
import router from './router'
import adminRouter from './router.admin'

dotenv.config()

const PORT = process.env.PORT || 3000
const MONGO_URL =
	process.env.MONGO_URL || 'mongodb://localhost:27017/my_library_db'
const SESSION_SECRET = process.env.SESSION_SECRET || 'library-secret'

const app = express()

/* ---------- VIEW ENGINE ---------- */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/* ---------- MIDDLEWARES ---------- */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: MONGO_URL }),
		cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 kun
	}),
)

/* ---------- ROLE MIDDLEWARE (Admin panel himoyasi) ---------- */
const adminGuard = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.member || req.session.member.memberType !== 'ADMIN') {
		return res
			.status(HttpCode.FORBIDDEN)
			.json({ success: false, message: Message.ONLY_SPECIFIC_ROLE_APPLY })
	}
	next()
}

/* ---------- ROUTES ---------- */
app.use('/', router)
app.use('/admin', adminGuard, adminRouter)

/* ---------- 404 HANDLER ---------- */
app.use((req: Request, res: Response) => {
	res
		.status(HttpCode.NOT_FOUND)
		.json({ success: false, message: Message.NO_DATA_FOUND })
})

/* ---------- GLOBAL ERROR HANDLER ---------- */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error('[ERROR]', err)
	if (err instanceof ErrorLog) {
		return res.status(err.code).json({ success: false, message: err.message })
	}
	res
		.status(HttpCode.INTERNAL_SERVER_ERROR)
		.json({ success: false, message: Message.SOMETHING_WENT_WRONG })
})

/* ---------- DATABASE + SERVER START ---------- */
mongoose
	.connect(MONGO_URL)
	.then(() => {
		console.log("✅ MongoDB ulanishi muvaffaqiyatli o'rnatildi")
		app.listen(PORT, () => {
			console.log(`🚀 Server http://localhost:${PORT} portida ishga tushdi`)
		})
	})
	.catch(err => {
		console.error('❌ MongoDB ulanishida xatolik:', err)
		process.exit(1)
	})

export default app
