import { Router } from "express";
import AdminController from "./controllers/admin.controller";
import { uploader } from "./libs/utils/uploader";

const adminRouter = Router();
const adminController = new AdminController();

/* ---------- MEMBERS (a'zolar ro'yxati, admin panel ichida) ---------- */
adminRouter.get("/members", adminController.getAllMembers);

/* ---------- BOOK (PRODUCT) CRUD ---------- */
adminRouter.post("/products", uploader.single("productImage"), adminController.createProduct);
adminRouter.get("/products", adminController.getAllProducts);
adminRouter.patch("/products/:id", uploader.single("productImage"), adminController.updateProduct);
adminRouter.patch("/products/:id/status", adminController.changeProductStatus);
adminRouter.delete("/products/:id", adminController.deleteProduct);

/* ---------- ORDER MANAGEMENT ---------- */
adminRouter.get("/orders", adminController.getAllOrders);
adminRouter.patch("/orders/:id/approve", adminController.approveOrder);
adminRouter.patch("/orders/:id/reject", adminController.rejectOrder);
adminRouter.patch("/orders/:id/return", adminController.returnOrder);

export default adminRouter;
