ALTER TABLE crm.inquiries 
ADD COLUMN IF NOT EXISTS onboarding_token UUID UNIQUE;
