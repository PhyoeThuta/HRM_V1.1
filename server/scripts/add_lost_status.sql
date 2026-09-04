-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Go to your Project (kcswzfrwpvioaaizfpnk)
-- 3. Click on "SQL Editor" on the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste the following line, then click "Run":

ALTER TYPE crm.inquiry_status ADD VALUE IF NOT EXISTS 'lost';
