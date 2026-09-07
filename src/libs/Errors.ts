export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Nimadir xato ketdi. Qaytadan urinib ko'ring.",
  NO_DATA_FOUND = "Ma'lumot topilmadi!",
  CREATE_FAILED = "Yaratishda xatolik yuz berdi!",
  UPDATE_FAILED = "Yangilashda xatolik yuz berdi!",
  DELETE_FAILED = "O'chirishda xatolik yuz berdi!",
  USED_MEMBER_NICK_PHONE = "Ushbu login yoki telefon raqam band qilingan!",
  WRONG_PASSWORD = "Login yoki parol noto'g'ri!",
  NOT_AUTHENTICATED = "Avval tizimga kiring!",
  NOT_ALLOWED_REQUEST = "Ruxsat etilmagan amal!",
  ONLY_SPECIFIC_ROLE_APPLY = "Bu amal faqat tegishli rolga ruxsat etilgan!",
  BLOCKED_USER = "Sizning profilingiz bloklangan!",
  PRODUCT_NOT_FOUND = "Kitob topilmadi!",
  OUT_OF_STOCK = "Kitob hozircha mavjud emas!",
  ORDER_NOT_FOUND = "Buyurtma topilmadi!",
}

class ErrorLog extends Error {
  code: HttpCode;
  message: Message | string;

  constructor(statusCode: HttpCode, statusMessage: Message | string) {
    super(statusMessage);
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default ErrorLog;
