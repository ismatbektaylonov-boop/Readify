import { NextFunction, Request, Response } from "express";
import OrderService from "../models/Order.service";
import MemberService from "../models/Member.service";
import ErrorLog, { HttpCode, Message } from "../libs/Errors";
import { ProductStatus } from "../libs/enums/product.enum";
import { OrderStatus } from "../libs/enums/order.enum";
import { getProductImagePath } from "../libs/utils/uploader";
import { MemberType } from "../libs/enums/member.enum";

const orderService = new OrderService();
const memberService = new MemberService();

/** faqat ADMIN kirishi mumkinligini tekshiruvchi yordamchi funksiya */
const assertAdmin = (req: Request) => {
  if (!req.session.member) {
    throw new ErrorLog(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
  }
  if (req.session.member.memberType !== MemberType.ADMIN) {
    throw new ErrorLog(HttpCode.FORBIDDEN, Message.ONLY_SPECIFIC_ROLE_APPLY);
  }
};

class AdminController {
  /* ---------------- MEMBERS (used inside products/orders admin panels) ---------------- */
  public getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const members = await memberService.getAllMembers();
      res.status(HttpCode.OK).json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  };

  /* ---------------- BOOK (PRODUCT) CRUD ---------------- */

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const file = req.file;
      const productImage = file ? getProductImagePath(file.filename) : "/img/default-book.svg";

      const newProduct = await orderService.createProduct({
        productName: req.body.productName,
        productAuthor: req.body.productAuthor,
        productCollection: req.body.productCollection,
        productDesc: req.body.productDesc,
        productPrice: Number(req.body.productPrice),
        productStock: Number(req.body.productStock),
        productImage,
      });

      res.status(HttpCode.CREATED).json({ success: true, data: newProduct });
    } catch (err) {
      next(err);
    }
  };

  public getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const products = await orderService.getAllProductsAdmin();
      res.status(HttpCode.OK).json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const file = req.file;
      const updateData: Record<string, any> = { ...req.body };
      if (file) updateData.productImage = getProductImagePath(file.filename);
      if (updateData.productPrice !== undefined) updateData.productPrice = Number(updateData.productPrice);
      if (updateData.productStock !== undefined) updateData.productStock = Number(updateData.productStock);

      const updated = await orderService.updateProduct(req.params.id, updateData);
      res.status(HttpCode.OK).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public changeProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const status = req.body.productStatus as ProductStatus;
      const updated = await orderService.changeProductStatus(req.params.id, status);
      res.status(HttpCode.OK).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const deleted = await orderService.deleteProduct(req.params.id);
      res.status(HttpCode.OK).json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  };

  /* ---------------- ORDER MANAGEMENT ---------------- */

  public getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const page = Number(req.query.page) || 1;
      const orderStatus = (req.query.orderStatus as OrderStatus) || undefined;

      const orders = await orderService.getAllOrdersAdmin({ page, limit: 30, orderStatus });
      res.status(HttpCode.OK).json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  };

  public approveOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const order = await orderService.approveOrder(req.params.id);
      res.status(HttpCode.OK).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  };

  public rejectOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const order = await orderService.rejectOrder(req.params.id);
      res.status(HttpCode.OK).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  };

  public returnOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertAdmin(req);
      const order = await orderService.returnOrder(req.params.id);
      res.status(HttpCode.OK).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  };
}

export default AdminController;
