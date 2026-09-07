import OrderModel, { ProductModel } from "../schema/Order.model";
import ErrorLog, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import { Order, OrderInquiry, OrderItemInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";

class OrderService {
  private readonly productModel;
  private readonly orderModel;

  constructor() {
    this.productModel = ProductModel;
    this.orderModel = OrderModel;
  }

  /* ==================== ADMIN: PRODUCT (BOOK) CRUD ==================== */

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getAllProductsAdmin(): Promise<Product[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  public async updateProduct(productId: string, input: Partial<ProductInput>): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(productId, input, { new: true })
      .exec();
    if (!updated) throw new ErrorLog(HttpCode.NOT_FOUND, Message.PRODUCT_NOT_FOUND);
    return updated;
  }

  public async changeProductStatus(productId: string, status: ProductStatus): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(productId, { productStatus: status }, { new: true })
      .exec();
    if (!updated) throw new ErrorLog(HttpCode.NOT_FOUND, Message.PRODUCT_NOT_FOUND);
    return updated;
  }

  public async deleteProduct(productId: string): Promise<Product> {
    const deleted = await this.productModel
      .findByIdAndUpdate(productId, { productStatus: ProductStatus.DELETE }, { new: true })
      .exec();
    if (!deleted) throw new ErrorLog(HttpCode.NOT_FOUND, Message.PRODUCT_NOT_FOUND);
    return deleted;
  }

  /* ==================== USER: RENT REQUEST (ORDER) ==================== */

  public async createOrder(memberId: string, input: OrderItemInput): Promise<Order> {
    const product = await this.productModel.findById(input.productId).exec();
    if (!product || product.productStatus !== ProductStatus.PROCESS) {
      throw new ErrorLog(HttpCode.NOT_FOUND, Message.PRODUCT_NOT_FOUND);
    }
    if (product.productStock < input.itemQuantity) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.OUT_OF_STOCK);
    }

    const newOrder = await this.orderModel.create({
      memberId,
      productId: product._id,
      productName: product.productName,
      productImage: product.productImage,
      itemQuantity: input.itemQuantity,
      orderTotal: product.productPrice * input.itemQuantity,
      orderStatus: OrderStatus.PENDING,
    });

    return newOrder;
  }

  /** Foydalanuvchining o'z buyurtmalari tarixi */
  public async getMyOrders(memberId: string, inquiry: OrderInquiry): Promise<Order[]> {
    const match: Record<string, any> = { memberId };
    if (inquiry.orderStatus) match.orderStatus = inquiry.orderStatus;

    return this.orderModel
      .find(match)
      .sort({ createdAt: -1 })
      .skip((inquiry.page - 1) * inquiry.limit)
      .limit(inquiry.limit)
      .exec();
  }

  /* ==================== ADMIN: ORDER MANAGEMENT ==================== */

  public async getAllOrdersAdmin(inquiry: OrderInquiry): Promise<Order[]> {
    const match: Record<string, any> = {};
    if (inquiry.orderStatus) match.orderStatus = inquiry.orderStatus;

    return this.orderModel
      .find(match)
      .populate("memberId", "memberNick memberFullName memberPhone")
      .sort({ createdAt: -1 })
      .skip((inquiry.page - 1) * inquiry.limit)
      .limit(inquiry.limit)
      .exec();
  }

  public async approveOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new ErrorLog(HttpCode.NOT_FOUND, Message.ORDER_NOT_FOUND);
    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.NOT_ALLOWED_REQUEST);
    }

    const product = await this.productModel.findById(order.productId).exec();
    if (!product || product.productStock < order.itemQuantity) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.OUT_OF_STOCK);
    }

    product.productStock -= order.itemQuantity;
    product.productRent += order.itemQuantity;
    await product.save();

    order.orderStatus = OrderStatus.APPROVE;
    await order.save();
    return order;
  }

  public async rejectOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new ErrorLog(HttpCode.NOT_FOUND, Message.ORDER_NOT_FOUND);
    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.NOT_ALLOWED_REQUEST);
    }
    order.orderStatus = OrderStatus.REJECT;
    await order.save();
    return order;
  }

  public async returnOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new ErrorLog(HttpCode.NOT_FOUND, Message.ORDER_NOT_FOUND);
    if (order.orderStatus !== OrderStatus.APPROVE) {
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.NOT_ALLOWED_REQUEST);
    }

    const product = await this.productModel.findById(order.productId).exec();
    if (product) {
      product.productStock += order.itemQuantity;
      product.productRent = Math.max(0, product.productRent - order.itemQuantity);
      await product.save();
    }

    order.orderStatus = OrderStatus.RETURNED;
    order.returnedAt = new Date();
    await order.save();
    return order;
  }
}

export default OrderService;
