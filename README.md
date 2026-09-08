# My Library Project — Kutubxona va Kitob Ijara Tizimi

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
