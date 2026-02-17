-- Add approved column to profiles for member approval flow
-- New users must be approved by an admin before accessing the dashboard
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Approve all existing members (don't lock out current users)
UPDATE profiles SET approved = true WHERE approved IS NULL OR approved = false;

COMMENT ON COLUMN profiles.approved IS 'Whether the member has been approved by an admin. New signups start as false.';
