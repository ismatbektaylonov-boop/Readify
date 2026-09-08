/**
 * Admin akkaunt yaratish uchun bir martalik seed skript.
 *
 * Ishlatish:
 *   npx ts-node scripts/createAdmin.ts <login> <telefon> <parol> [toliq_ism]
 *
 * Masalan:
 *   npx ts-node scripts/createAdmin.ts admin +998901234567 Admin123!
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import MemberModel from "../src/schema/Member.model";
import { MemberType } from "../src/libs/enums/member.enum";

dotenv.config();

async function run() {
  const [memberNick, memberPhone, memberPassword, memberFullName] = process.argv.slice(2);

  if (!memberNick || !memberPhone || !memberPassword) {
    console.log("❌ Foydalanish: npx ts-node scripts/createAdmin.ts <login> <telefon> <parol> [toliq_ism]");
    process.exit(1);
  }

  const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/my_library_db";
  await mongoose.connect(MONGO_URL);
  console.log("✅ MongoDB ulandi");

  const existing = await MemberModel.findOne({ memberNick }).exec();
  if (existing) {
    // Agar shu login allaqachon mavjud bo'lsa — uni ADMIN ga o'zgartiramiz
    existing.memberType = MemberType.ADMIN;
    await existing.save();
    console.log(`✅ Mavjud "${memberNick}" akkaunti ADMIN ga o'zgartirildi.`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(memberPassword, salt);

    await MemberModel.create({
      memberNick,
      memberPhone,
      memberPassword: hashed,
      memberFullName: memberFullName || "Administrator",
      memberType: MemberType.ADMIN,
    });
    console.log(`✅ Yangi ADMIN akkaunt yaratildi: login="${memberNick}", parol="${memberPassword}"`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Xatolik:", err);
  process.exit(1);
});
