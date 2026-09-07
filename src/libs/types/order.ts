import { Document, Types } from "mongoose";
import { OrderStatus } from "../enums/order.enum";

export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
}

export interface Order extends Document {
  _id: Types.ObjectId;
  orderStatus: OrderStatus;
  orderTotal: number;
  memberId: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  productImage: string;
  itemQuantity: number;
  requestedAt?: Date;
  returnedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}
