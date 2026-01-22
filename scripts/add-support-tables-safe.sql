-- SAFE MIGRATION - ADDS SUPPORT TABLES WITHOUT AFFECTING EXISTING DATA
-- This script only CREATES new tables, it does NOT modify or delete anything

-- Create support_sessions table
CREATE TABLE IF NOT EXISTS "support_sessions" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "agentId" INTEGER,
    "agentName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_sessions_pkey" PRIMARY KEY ("id")
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS "support_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "support_sessions_status_idx" ON "support_sessions"("status");
CREATE INDEX IF NOT EXISTS "support_sessions_agentId_idx" ON "support_sessions"("agentId");
CREATE INDEX IF NOT EXISTS "support_messages_sessionId_idx" ON "support_messages"("sessionId");

-- Add foreign key constraints (only if users table exists)
DO $$ 
BEGIN
    -- Add foreign key for userId if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'support_sessions_userId_fkey'
    ) THEN
        ALTER TABLE "support_sessions" 
        ADD CONSTRAINT "support_sessions_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for agentId if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'support_sessions_agentId_fkey'
    ) THEN
        ALTER TABLE "support_sessions" 
        ADD CONSTRAINT "support_sessions_agentId_fkey" 
        FOREIGN KEY ("agentId") REFERENCES "users"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for sessionId if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'support_messages_sessionId_fkey'
    ) THEN
        ALTER TABLE "support_messages" 
        ADD CONSTRAINT "support_messages_sessionId_fkey" 
        FOREIGN KEY ("sessionId") REFERENCES "support_sessions"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Verify tables were created
SELECT 
    'support_sessions' as table_name, 
    COUNT(*) as row_count 
FROM support_sessions
UNION ALL
SELECT 
    'support_messages' as table_name, 
    COUNT(*) as row_count 
FROM support_messages;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Support tables created successfully! ✅';
    RAISE NOTICE 'All your existing data is safe and intact! ✅';
END $$;
