import { Document, Types } from "mongoose";
import { ProductCollection, ProductStatus } from "../enums/product.enum";

export interface Product extends Document {
  _id: Types.ObjectId;
  productName: string;
  productAuthor: string;
  productCollection: ProductCollection;
  productStatus: ProductStatus;
  productDesc?: string;
  productPrice: number;
  productStock: number;
  productImage: string;
  productViews: number;
  productRent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInput {
  productName: string;
  productAuthor: string;
  productCollection: ProductCollection;
  productDesc?: string;
  productPrice: number;
  productStock: number;
  productImage?: string;
}

export interface ProductInquiry {
  page: number;
  limit: number;
  search?: string;
  collection?: ProductCollection;
  order?: "createdAt" | "productPrice" | "productViews";
}
