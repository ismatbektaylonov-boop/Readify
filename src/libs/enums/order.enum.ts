export enum OrderStatus {
  PENDING = "PENDING", // foydalanuvchi so'rov yuborgan, admin tasdig'ini kutmoqda
  APPROVE = "APPROVE", // admin tasdiqlagan, kitob foydalanuvchida
  REJECT = "REJECT", // admin rad etgan
  RETURNED = "RETURNED", // kitob qaytarilgan
}
