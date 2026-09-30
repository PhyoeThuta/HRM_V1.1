ALTER TABLE "Employees" 
  ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50) DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS resign_code VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS resign_date DATE,
  ADD COLUMN IF NOT EXISTS resign_reason TEXT;

CREATE SEQUENCE IF NOT EXISTS resign_code_seq START 1;

CREATE OR REPLACE FUNCTION generate_resign_code()
RETURNS TEXT AS $$
DECLARE
  next_val INT;
BEGIN
  SELECT nextval('resign_code_seq') INTO next_val;
  RETURN 'RES-' || LPAD(next_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;
