# System Environment & Dependencies

## System Information
- **OS**: Linux
- **Node.js**: v24.12.0
- **npm**: 11.6.2

## Project Scripts
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:seed": "node --require ts-node/register prisma/seed.ts",
    "seed": "npm run db:seed",
    "dev": "next dev"
  }
}
```

## Dependency Tree (Depth 0)
```
algeria-ecotourism@0.1.0
├── @hookform/resolvers@^5.2.2
├── @next-auth/prisma-adapter@^1.2.5
├── @next-cloudinary@^6.17.5
├── @prisma/client@^5.22.0
├── @prisma/adapter-pg-astro@^5.22.0
├── @radix-ui/react-accordion@^1.2.1
├── @radix-ui/react-alert-dialog@^1.1.2
├── @radix-ui/react-avatar@^1.1.1
├── @radix-ui/react-checkbox@^1.1.2
├── @radix-ui/react-dialog@^1.1.2
├── @radix-ui/react-dropdown-menu@^2.1.2
├── @radix-ui/react-label@^2.1.0
├── @radix-ui/react-navigation-menu@^1.2.1
├── @radix-ui/react-radio-group@^1.2.1
├── @radix-ui/react-select@^2.2.2
├── @radix-ui/react-separator@^1.1.0
├── @radix-ui/react-slot@^1.1.0
├── @radix-ui/react-switch@^1.1.1
├── @radix-ui/react-tabs@^1.1.1
├── @radix-ui/react-toast@^1.2.2
├── @tailwindcss/postcss@^4
├── @types/bcrypt@^6.0.0
├── @types/leaflet@^1.9.21
├── @types/node@^20
├── @types/pg@^8.16.0
├── @types/react@^19.2.6
├── @types/react-dom@^19
├── eslint@^9
├── eslint-config-next@^16.1.1
├── next@^16.1.1
├── next-auth@^4.24.13
├── next-cloudinary@^6.17.5
├── pg@^8.16.3
├── prisma@^6.0.0
├── react@19.2.0
├── react-dom@19.2.0
├── react-hook-form@^7.70.0
├── react-leaflet@^5.0.0
├── sonner@^2.0.7
└── zod@^4.3.5
```

## Environment Variables Status
- **.env file**: Checking...
- **.env.example**: Checking...
