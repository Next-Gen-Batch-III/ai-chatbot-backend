# DEVELOPMENT GUIDE
## 1. Technologies used
* expressJs
* Clerk (Authentication and Authorization)

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
