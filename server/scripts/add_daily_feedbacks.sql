-- Create daily_feedbacks table in the CRM schema
CREATE TABLE IF NOT EXISTS crm.daily_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    menu_id BIGINT,
    dish_name_en TEXT,
    dish_name_mm TEXT,
    meal_type TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE crm.daily_feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" 
ON crm.daily_feedbacks FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert access for public" 
ON crm.daily_feedbacks FOR INSERT 
TO public 
WITH CHECK (true);
