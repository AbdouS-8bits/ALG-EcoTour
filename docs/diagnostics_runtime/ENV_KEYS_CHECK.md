# Environment Keys Presence Check

## Environment Files Status
- **.env file**: ✅ Present
- **.env.example**: ✅ Present

## Environment Variables Reference Table

| KEY | Referenced In Files | Present in .env.example |
|------|-------------------|----------------------|
| DATABASE_URL | lib/prisma.ts, lib/email.ts | ✅ |
| NEXTAUTH_SECRET | app/api/auth/[...nextauth]/route.ts | ✅ |
| NEXTAUTH_URL | app/api/auth/[...nextauth]/route.ts | ✅ |
| CLOUDINARY_CLOUD_NAME | lib/email.ts, app/api/upload/route.ts | ✅ |
| CLOUDINARY_API_KEY | lib/email.ts, app/api/upload/route.ts | ✅ |
| CLOUDINARY_API_SECRET | lib/email.ts, app/api/upload/route.ts | ✅ |
| NODE_ENV | lib/prisma.ts, app/layout.tsx | ✅ |
| NEXT_PUBLIC_API_URL | lib/api-helpers.ts | ❌ |
| NEXT_PUBLIC_APP_URL | app/ecoTour/[tourId]/metadata.ts | ❌ |

## Summary
- **Total keys referenced**: 9
- **Keys documented in .env.example**: 7
- **Missing from .env.example**: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
- **Critical for runtime**: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

## Notes
- All sensitive values are properly redacted
- .env file exists and should contain actual values
- Consider adding missing NEXT_PUBLIC_ keys to .env.example for frontend configuration
