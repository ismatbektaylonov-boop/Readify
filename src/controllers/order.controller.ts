import { NextFunction, Request, Response } from "express";
import OrderService from "../models/Order.service";
import ErrorLog, { HttpCode, Message } from "../libs/Errors";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService();

class OrderController {
  /** Kitobni ijaraga so'rov yuborish (Pending) */
  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.member) {
        throw new ErrorLog(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
      }
      const memberId = String(req.session.member._id);
      const { productId, itemQuantity } = req.body;

      const newOrder = await orderService.createOrder(memberId, {
        productId,
        itemQuantity: Number(itemQuantity) || 1,
      });

      res.status(HttpCode.CREATED).json({ success: true, data: newOrder });
    } catch (err) {
      next(err);
    }
  };

  /** Foydalanuvchining o'z buyurtmalari / o'qiyotgan kitoblari tarixi */
  public getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.member) {
        throw new ErrorLog(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
      }
      const memberId = String(req.session.member._id);
      const page = Number(req.query.page) || 1;
      const orderStatus = (req.query.orderStatus as OrderStatus) || undefined;

      const orders = await orderService.getMyOrders(memberId, {
        page,
        limit: 20,
        orderStatus,
      });

      res.status(HttpCode.OK).json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  };
}

export default OrderController;
