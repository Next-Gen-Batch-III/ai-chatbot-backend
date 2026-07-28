# DEVELOPMENT GUIDE
## 1. Technologies used
* Express.js
* Prisma ORM
* PostgreSQL with pgvector
* Docker / Docker Compose
* Clerk (Authentication and Authorization)
* Google Gemini API

---

## 2. Set up environment variables
* See [.env.example](.env.example) for the full template.
* In the [Clerk Dashboard](https://dashboard.clerk.com/), open your application.
* Go to the API Keys section.
* Copy the Publishable Key into `CLERK_PUBLISHABLE_KEY`.
* Copy the Secret Key into `CLERK_SECRET_KEY`.
* Add any other local values from `.env.example`, such as `PORT` and `CORS_ORIGIN`.

---

## 3. Add Roles to Clerk Session Claims

To include user roles in the Clerk JWT session token, customize the session template in the Clerk Dashboard:

1. Go to the [Clerk Dashboard](https://dashboard.clerk.com/) and open your application.
2. Navigate to **Sessions** → **Customize session token**.
3. Add the following custom claim to include the user's `public_metadata` (where roles are stored):

```json
{
	"metadata": "{{user.public_metadata}}"
}
```

4. Save the changes. The session token will now include the user's public metadata, allowing your backend to read `auth.sessionClaims.metadata.role` (or whichever key you use inside `public_metadata`) for authorization logic.

> **Tip:** Store the role under a `role` key inside `public_metadata` (e.g., `{ "role": "admin" }`) so it is easy to access from `sessionClaims.metadata.role`. See [Create Test User](test/createTestUser.js)

---

## 4. Run the database locally with Docker

* Make sure `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` are set in your `.env` file.
* Start the database container:

```bash
docker compose up -d postgres
```

* The container uses `init.sql` to enable the `vector` extension on first startup.

---

## 5. Set up Prisma

* Make sure `DATABASE_URL` points to the local Docker database.
* Generate the Prisma client after any schema change:

```bash
npx prisma generate
```

* Apply schema changes to the local database:

```bash
npx prisma migrate dev
```

* Open Prisma Studio to inspect and edit the database:

```bash
npm run studio
```
