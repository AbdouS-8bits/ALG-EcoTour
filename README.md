
# ALG-EcoTour

**Easy Dev Setup (for `dev` branch)**

Follow these quick steps to get the project running locally (minimal, copy-paste):

- Clone and switch to the `dev` branch:

```powershell
git clone <repo-url>
cd ALG-EcoTour
git switch dev
```

- Install dependencies:

```powershell
npm install
```

- Create a local env file (`.env.local`) in the repo root containing:

```env
# Example dev values — replace with your own database credentials
DATABASE_URL="postgresql://postgres:1234@localhost:5432/ecotour_db"
NEXTAUTH_SECRET="<generate-a-secure-secret>"
NEXTAUTH_URL="http://localhost:3000"
```

- Generate Prisma client and run migrations (creates DB schema):

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

- (Optional) Seed the DB with the default admin user (plain-text password for dev convenience):

```powershell
node --input-type=module --eval "import('./scripts/seed.mjs')"
```

- Start the dev server:

```powershell
npm run dev
```

- Open the app: http://localhost:3000 and then go to the admin login: http://localhost:3000/admin/login

Notes:
- Use Prisma Studio to inspect or edit data: `npx prisma studio --url "<your database url>"`.
- This project pins Prisma v6 for compatibility with the committed schema. If you see schema errors, ensure you have `prisma@6.x` and `@prisma/client@6.x` installed.
- For production, always hash passwords (bcrypt) and never commit `.env.local`.
