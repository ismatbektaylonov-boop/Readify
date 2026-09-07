import { ProductModel } from "../schema/Order.model";
import MemberModel from "../schema/Member.model";
import ErrorLog, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInquiry } from "../libs/types/product";
import { ProductStatus } from "../libs/enums/product.enum";
import { Member } from "../libs/types/member";

class MemberService {
  private readonly productModel;
  private readonly memberModel;

  constructor() {
    this.productModel = ProductModel;
    this.memberModel = MemberModel;
  }

  /** Kitoblar katalogini ko'rish / qidirish (faqat foydalanuvchi uchun mavjud kitoblar) */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const { page, limit, search, collection, order } = inquiry;

    const match: Record<string, any> = { productStatus: ProductStatus.PROCESS };
    if (search) {
      match.$or = [
        { productName: { $regex: search, $options: "i" } },
        { productAuthor: { $regex: search, $options: "i" } },
      ];
    }
    if (collection) match.productCollection = collection;

    const sortKey = order ?? "createdAt";

    const result = await this.productModel
      .find(match)
      .sort({ [sortKey]: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return result;
  }

  /** Bitta kitobni ko'rish (view sonini oshirish bilan) */
  public async getProduct(productId: string): Promise<Product> {
    const product = await this.productModel
      .findOneAndUpdate(
        { _id: productId, productStatus: ProductStatus.PROCESS },
        { $inc: { productViews: 1 } },
        { new: true }
      )
      .exec();

    if (!product) throw new ErrorLog(HttpCode.NOT_FOUND, Message.PRODUCT_NOT_FOUND);
    return product;
  }

  /** Foydalanuvchi profilini olish */
  public async getMember(memberId: string): Promise<Member> {
    const member = await this.memberModel.findById(memberId).exec();
    if (!member) throw new ErrorLog(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return member;
  }

  /** Barcha a'zolarni ko'rish (Admin panel uchun ham ishlatiladi) */
  public async getAllMembers(): Promise<Member[]> {
    return this.memberModel.find().sort({ createdAt: -1 }).exec();
  }
}

export default MemberService;
