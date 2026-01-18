-- Add email verification and password reset tokens to users table

-- Add verification token and reset token columns
ALTER TABLE users 
ADD COLUMN "emailVerified" BOOLEAN DEFAULT FALSE,
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "resetPasswordToken" TEXT,
ADD COLUMN "resetPasswordExpires" TIMESTAMP;

-- Create index for faster token lookups
CREATE INDEX idx_verification_token ON users("verificationToken");
CREATE INDEX idx_reset_token ON users("resetPasswordToken");
