import { Router } from "express";
import MemberController from "./controllers/member.controller";
import OrderController from "./controllers/order.controller";

const router = Router();
const memberController = new MemberController();
const orderController = new OrderController();

/* ---------- SSR VIEW ROUTES ---------- */
router.get("/", memberController.goHome);
router.get("/login", memberController.getLoginPage);
router.get("/signup", memberController.getSignupPage);
router.get("/products", memberController.getProductsPage);
router.get("/orders", memberController.getOrdersPage);

/* ---------- AUTH API ---------- */
router.post("/api/signup", memberController.signup);
router.post("/api/login", memberController.login);
router.post("/api/logout", memberController.logout);
router.get("/api/check-auth", memberController.checkAuth);

/* ---------- PRODUCT (BOOK) API - PUBLIC ---------- */
router.get("/api/products/:id", memberController.getProduct);

/* ---------- ORDER (RENT REQUEST) API - MEMBER ---------- */
router.post("/api/orders", orderController.createOrder);
router.get("/api/orders/mine", orderController.getMyOrders);

export default router;
