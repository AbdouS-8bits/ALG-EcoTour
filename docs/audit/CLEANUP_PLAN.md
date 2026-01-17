# Cleanup Plan

## Files to Delete (Safe)

### Build Artifacts & Cache
- **next.config.js** - Duplicate config file (next.config.ts is the active one)
- **tsconfig.tsbuildinfo** - TypeScript build cache
- **node_modules/lodash/flake.lock** - Nested lockfile (keep package-lock.json)
- **node_modules/uri-js/yarn.lock** - Nested lockfile (keep package-lock.json)

### Unused/Duplicate Files
- **app/admin/login/api/auth/login.ts** - Duplicate auth file (auth handled by NextAuth)
- **app/admin/SighUp** - Misspelled directory (should be SignUp)

## Files to Quarantine (Move to docs/audit/_quarantine/)

### Potentially Unused Components
- **app/test/page.tsx** - Test page (verify if needed for testing)
- **app/admin/SighUp/** - Entire misspelled directory
- **app/admin/login/api/auth/login.ts** - Duplicate auth implementation

### Documentation & Analysis Files
- **PROJECT_ANALYSIS.md** - Analysis document (keep in quarantine)
- **OPERATING_INSTRUCTIONS.md** - Instructions document (keep in quarantine)
- **EVIDENCE_S5.md** - Evidence document (keep in quarantine)
- **QUICK_START_FRONTEND.md** - Quick start guide (keep in quarantine)

### Configuration Files
- **next.config.js** - Duplicate config (keep next.config.ts)

## Files to Keep (Critical)

### Core Application
- **app/** - All Next.js app router files
- **components/** - React components
- **lib/** - Utility libraries
- **prisma/** - Database schema and migrations
- **public/** - Static assets
- **ALG-ecoTour-app/** - Flutter mobile app

### Configuration
- **package.json** - Dependencies and scripts
- **package-lock.json** - Dependency lockfile
- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **eslint.config.mjs** - ESLint configuration
- **postcss.config.mjs** - PostCSS configuration

### Documentation
- **README.md** - Main documentation
- **SECURITY_NOTES.md** - Security documentation
- **auth.ts** - Authentication configuration

## Deletion Rules Applied

### Safe to Delete
- OS junk files (.DS_Store, Thumbs.db) - None found
- Build artifacts (.next, dist, build) - None found
- Duplicate config files - next.config.js
- Nested lockfiles - yarn.lock in node_modules
- Cache files - tsconfig.tsbuildinfo

### Quarantine Instead of Delete
- Files with uncertain usage - test pages, duplicate auth files
- Documentation files - Keep for reference
- Misspelled directories - Fix spelling instead of delete

## Risk Assessment
- **Low Risk**: Build artifacts, cache files, duplicate configs
- **Medium Risk**: Test pages, duplicate auth implementations
- **High Risk**: None identified

## Execution Order
1. Delete safe files (build artifacts, duplicates)
2. Quarantine uncertain files
3. Verify build still works
4. Document all changes
