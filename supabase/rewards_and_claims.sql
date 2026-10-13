-- Run this query in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rewards_and_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES "Employees"(id) ON DELETE CASCADE,
    claim_type VARCHAR(255) NOT NULL,
    custom_type VARCHAR(255),
    requested_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    approved_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    proof_image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_by VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    approved_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
    admin_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE rewards_and_claims ENABLE ROW LEVEL SECURITY;

-- Create basic policies (if needed, otherwise rely on server-side service role)
CREATE POLICY "Allow service role full access to rewards_and_claims"
ON rewards_and_claims
FOR ALL
USING (true)
WITH CHECK (true);
