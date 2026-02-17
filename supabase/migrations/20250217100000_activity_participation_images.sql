-- Add optional image_url to activity_participation for user-attached proof images
ALTER TABLE activity_participation
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN activity_participation.image_url IS 'Optional URL of image attached by user when submitting activity';
