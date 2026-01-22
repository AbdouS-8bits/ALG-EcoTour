-- Run this SQL directly in your PostgreSQL database
-- This is 100% SAFE and will NOT affect your existing data

BEGIN;

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

-- Create indexes
CREATE INDEX IF NOT EXISTS "support_sessions_status_idx" ON "support_sessions"("status");
CREATE INDEX IF NOT EXISTS "support_sessions_agentId_idx" ON "support_sessions"("agentId");
CREATE INDEX IF NOT EXISTS "support_messages_sessionId_idx" ON "support_messages"("sessionId");

-- Add foreign keys
ALTER TABLE "support_sessions" DROP CONSTRAINT IF EXISTS "support_sessions_userId_fkey";
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "support_sessions" DROP CONSTRAINT IF EXISTS "support_sessions_agentId_fkey";
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_agentId_fkey" 
    FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "support_messages" DROP CONSTRAINT IF EXISTS "support_messages_sessionId_fkey";
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "support_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

-- Verify
SELECT 'Support tables created successfully!' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('support_sessions', 'support_messages');
