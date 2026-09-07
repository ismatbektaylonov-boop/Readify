# 📚 My Library Project — Kutubxona va Kitob Ijara Tizimi

Node.js + Express + TypeScript + MongoDB (Mongoose) + EJS asosida qurilgan,
MVC + Service Layer arxitekturasiga ega to'liq kutubxona boshqaruv tizimi.

## 🏗 Arxitektura

```
src/
├── app.ts                  → Kirish nuqtasi (Express app, middleware, DB ulanish)
├── router.ts                → Public/Member routerlari (auth, catalog, order)
├── router.admin.ts          → Admin routerlari (book CRUD, order approval)
├── controllers/              → Request/Response boshqaruvi
├── models/                   → Service Layer — biznes-mantiq (Auth, Member, Order)
├── schema/                   → Mongoose modellari (Member, Product, Order)
├── libs/
│   ├── Errors.ts             → Custom xatolik klassi + xabarlar
│   ├── enums/                 → MemberType/Status, ProductStatus, OrderStatus
│   ├── types/                 → TypeScript interfeyslari
│   └── utils/uploader.ts      → Multer rasm yuklovchi
├── public/                   → CSS / JS statik fayllar
└── views/                    → EJS shablonlar
```

## ⚙️ O'rnatish

```bash
npm install
cp .env.example .env   # MONGO_URL, SESSION_SECRET ni sozlang
npm run dev             # development (ts-node + nodemon)
# yoki
npm run build && npm start   # production
```

MongoDB lokal yoki Atlas'da ishga tushirilgan bo'lishi kerak.

## 👤 Rollar

- **USER** — kitoblar katalogini ko'radi, qidiradi, ijaraga so'rov yuboradi
  (`PENDING`), o'z buyurtmalari tarixini ko'radi.
- **ADMIN** — kitob qo'shadi/tahrirlaydi/o'chiradi, holatini o'zgartiradi
  (`PROCESS` / `PAUSE` / `DELETE`), kelib tushgan so'rovlarni
  `APPROVE` / `REJECT` qiladi va `RETURNED` deb belgilaydi.

Admin foydalanuvchi yaratish uchun `/api/signup` so'roviga
`"memberType": "ADMIN"` maydonini qo'shing (yoki DB'da mavjud a'zoni
qo'lda `memberType: "ADMIN"` ga o'zgartiring).

## 🔌 Asosiy API yo'nalishlari

| Method | Route | Tavsif |
|---|---|---|
| POST | `/api/signup` | Ro'yxatdan o'tish |
| POST | `/api/login` | Kirish |
| POST | `/api/logout` | Chiqish |
| GET | `/api/products/:id` | Bitta kitobni ko'rish |
| POST | `/api/orders` | Ijaraga so'rov yuborish (USER) |
| GET | `/api/orders/mine` | O'z buyurtmalarim tarixi (USER) |
| POST | `/admin/products` | Yangi kitob qo'shish (ADMIN, multipart) |
| PATCH | `/admin/products/:id/status` | Kitob holatini o'zgartirish |
| DELETE | `/admin/products/:id` | Kitobni o'chirish |
| GET | `/admin/orders` | Barcha so'rovlar (ADMIN) |
| PATCH | `/admin/orders/:id/approve` | So'rovni tasdiqlash |
| PATCH | `/admin/orders/:id/reject` | So'rovni rad etish |
| PATCH | `/admin/orders/:id/return` | Kitob qaytarilganini belgilash |

## 📝 Eslatma

`public/img/` papkasiga standart kitob muqovasi uchun haqiqiy
`default-book.png` faylini qo'shishni unutmang (hozircha faqat
`.gitkeep` mavjud).
