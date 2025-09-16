School Payments & Dashboard — Backend (NestJS + MongoDB Atlas)

A lightweight, production-ready backend microservice for school payment collection and transaction dashboards.
Features include: creating payment collect requests via a payment gateway, handling webhooks, JWT-based authentication, transaction aggregation, and Postman-friendly API endpoints.

🔍 Tech stack

* **NestJS** (Node.js framework)
* **Mongoose** (MongoDB Atlas)
* **JWT** for authentication
* **Axios** for external HTTP calls

---

## 🚀 Quick start (local)

1. Clone repository

```bash
git clone https://github.com/UbaidAnsari7804/school-payments-backend
cd school-payments-backend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` in project root (copy `.env.example`) and fill values. **Do not commit `.env`**.

Example `.env` (fill with your values):

```env
PORT=3000
NODE_ENV=development
MONGO_URI="mongodb+srv://<db_user>:<password>@cluster0.mongodb.net/school_payments?retryWrites=true&w=majority"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRY="3600s"
PAYMENT_API_KEY="your_payment_api_key"
PG_KEY="edvtest01"
PAYMENT_API_BASE="https://dev-vanilla.edviron.com/erp"
CALLBACK_URL="https://your-frontend.com/payment-callback"
SCHOOL_ID="65b0e6293e9f76a9694d84b4"
```

4. Run the app in development

```bash
npm run start:dev
```

Open `http://localhost:3000` (use Postman or curl to test endpoints).

5. (Optional) Populate sample data

```bash
npm run seed
```

---

## 🗂 Project layout

```
src/
  auth/             # authentication (register/login)
  orders/           # order creation
  order-status/     # payment status documents
  payments/         # payment gateway integration
  webhook/          # webhook receiver & logs
  transactions/     # aggregation endpoints for dashboard
src/scripts/seed.ts # seed sample data
dist/               # compiled files (after build)
```

---

## 🔐 Authentication

* Register: `POST /auth/register`
* Login: `POST /auth/login` → returns `access_token` (JWT)
  Include header on protected routes:

```
Authorization: Bearer <access_token>
```

---

## 📌 Main endpoints

### Auth

* `POST /auth/register` — register a user
* `POST /auth/login` — login -> returns JWT

### Orders & Status

* `POST /orders` — create an order
* `GET /order-status/:custom` — fetch order status by custom order id

### Payments (protected)

* `POST /payments/create-payment` — create collect request (calls external API)
  Body example:

  ```json
  { "amount":"100", "callback_url":"https://your-frontend.com/cb", "student_info": {...} }
  ```

  Response includes `collect_request_id` and `payment_url`.

* `GET /payments/check/:collect` — check collect request status

### Webhook (simulate payment provider)

* `POST /webhook` — receive payment callback and upsert order status

Payload example:

```json
{
  "status": 200,
  "order_info": {
    "order_id": "collect_test_001/txn_987",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ybl",
    "Payment_message": "payment success",
    "payment_time": "2025-04-23T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
```

### Transactions (aggregation)

* `GET /transactions?page=1&limit=20&sort=payment_time&order=desc` — paginated, sortable list (aggregates orders + status)
* `GET /transactions/school/:schoolId` — transactions for a school
* `GET /transactions/status/:custom_order_id` — fetch transaction status

---

## 🧪 Testing with Postman

Create an environment with:

* `baseUrl = http://localhost:3000`
* `token` (empty)

Flow:

1. `POST /auth/register` → register user
2. `POST /auth/login` → get `access_token` and set `token` in Postman env
3. Add header `Authorization: Bearer {{token}}` for protected routes
4. Test `POST /payments/create-payment`, `POST /webhook`, `GET /transactions`, etc.

---

## ⚙️ Build & run for production

1. Build

```bash
npm run build
```

2. Run production (from project root)

```bash
npm run start:prod
# or
node dist/main.js
```

---

## 📦 Docker (optional)

`Dockerfile` example:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]
```

Build & run:

```bash
docker build -t school-payments-api .
docker run -d -p 3000:3000 --env-file .env school-payments-api
```

---

## 🛡 Production checklist & recommendations

* Use a strong, unique `JWT_SECRET` stored in the host environment (not in repo).
* Restrict MongoDB Atlas IP access to your server(s) — avoid `0.0.0.0/0` in production.
* Enable HTTPS (via reverse proxy or hosting provider).
* Run the app under a process manager (`pm2`) or container orchestrator.
* Add structured logging (e.g., `winston`) and monitor logs.
* Limit CORS to your frontend origin (`app.enableCors({ origin: 'https://yourfrontend.com' })`).
* Rotate keys periodically and follow least-privilege for DB users.

---

## 🧰 Troubleshooting (common)

* `Cannot GET /auth/register` — this route is `POST` (use POST in Postman).
* DB connection errors — verify `MONGO_URI`, Atlas user/password, and IP whitelist.
* External payment API errors — check `PAYMENT_API_KEY`, `PG_KEY`, and network access.
* If TypeScript errors appear, run `npm install` and restart the dev server.

---

## ♻️ Git cleanup (if needed)

If you accidentally staged `node_modules` or `.env`:

```bash
git reset
git rm -r --cached node_modules
git rm --cached .env
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
git add .
git commit -m "Remove node_modules and .env from repo"
```

---

## 📄 License

MIT — feel free to reuse and adapt this code for your project.

---
