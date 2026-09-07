import { Schema, model } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { Order } from "../libs/types/order";
import { Product } from "../libs/types/product";

/** ------------------------------------------------------------------
 *  PRODUCT (Book) SCHEMA
 *  Talab qilingan papka tuzilmasida alohida Product.model.ts fayli
 *  ko'rsatilmagan, shu sabab Book/Product modeli shu faylda,
 *  Order modeli bilan bevosita bog'liqligi uchun joylashtirildi.
 * ------------------------------------------------------------------ */
const productSchema = new Schema<Product>(
  {
    productName: { type: String, required: true, trim: true },
    productAuthor: { type: String, required: true, trim: true },
    productCollection: {
      type: String,
      enum: ProductCollection,
      default: ProductCollection.OTHER,
    },
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PROCESS,
    },
    productDesc: { type: String, default: "" },
    productPrice: { type: Number, required: true, default: 0 },
    productStock: { type: Number, required: true, default: 1 },
    productImage: { type: String, required: true },
    productViews: { type: Number, default: 0 },
    productRent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

export const ProductModel = model<Product>("Product", productSchema);

/** ------------------------------------------------------------------
 *  ORDER SCHEMA (Ijara so'rovi)
 * ------------------------------------------------------------------ */
const orderSchema = new Schema<Order>(
  {
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
    orderTotal: { type: Number, required: true, default: 0 },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    itemQuantity: { type: Number, required: true, default: 1 },
    requestedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const OrderModel = model<Order>("Order", orderSchema);

export default OrderModel;
