-- ==============================================================================
-- TV PARTS SHOP / PDFSTORE - COMPLETE SUPABASE SQL SCRIPT
-- Open Supabase Dashboard: https://supabase.com/dashboard/project/amoayribokcajpmqmgea/sql
-- Paste and Click "RUN"
-- ==============================================================================

-- 1. USERS & TECHNICIANS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    technician_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    whatsapp_number TEXT,
    aadhar_number TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'buyer',
    status TEXT DEFAULT 'active',
    total_purchases INTEGER DEFAULT 0,
    total_spent_inr NUMERIC DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create public policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write on users" ON public.users;
CREATE POLICY "Allow public read and write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);


-- 2. PRODUCTS & SCHEMATICS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    brand TEXT,
    category TEXT DEFAULT 'Schematics & Hardware',
    model_number TEXT,
    price NUMERIC DEFAULT 299,
    price_inr NUMERIC DEFAULT 299,
    price_usd NUMERIC DEFAULT 4,
    original_price_inr NUMERIC DEFAULT 999,
    original_price_usd NUMERIC DEFAULT 12,
    discount_percent INTEGER,
    rating NUMERIC DEFAULT 4.9,
    review_count INTEGER DEFAULT 25,
    sales_count INTEGER DEFAULT 0,
    image_cover TEXT,
    preview_image_url TEXT,
    file_size TEXT DEFAULT '10 MB',
    pdf_file_size TEXT DEFAULT '10 MB',
    page_count INTEGER DEFAULT 1,
    pdf_page_count INTEGER DEFAULT 1,
    pdf_url TEXT,
    pdf_file_name TEXT,
    local_pdf_data_url TEXT,
    schematics_data TEXT,
    author_name TEXT DEFAULT 'Certified Master Technician',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_sample_available BOOLEAN DEFAULT true,
    expiry_days INTEGER DEFAULT 30,
    expires_in TEXT DEFAULT 'Instant Download',
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    table_of_contents JSONB DEFAULT '[]'::jsonb,
    sample_pages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist on products table (if table was created previously)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_number TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 299;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_inr NUMERIC DEFAULT 299;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_usd NUMERIC DEFAULT 4;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price_inr NUMERIC DEFAULT 999;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price_usd NUMERIC DEFAULT 12;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.9;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 25;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_cover TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS file_size TEXT DEFAULT '10 MB';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pdf_file_size TEXT DEFAULT '10 MB';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pdf_page_count INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pdf_file_name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS local_pdf_data_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS schematics_data TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_sample_available BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS expiry_days INTEGER DEFAULT 30;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS expires_in TEXT DEFAULT 'Instant Download';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS key_takeaways JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS table_of_contents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sample_pages JSONB DEFAULT '[]'::jsonb;

-- Enable RLS and create public policy
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write on products" ON public.products;
CREATE POLICY "Allow public read and write on products" ON public.products FOR ALL USING (true) WITH CHECK (true);


-- 3. ORDERS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount_inr NUMERIC NOT NULL DEFAULT 0,
    total_amount_usd NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'upi',
    payment_reference TEXT,
    download_token TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create public policy
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write on orders" ON public.orders;
CREATE POLICY "Allow public read and write on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);


-- 4. STORE SETTINGS & ANNOUNCEMENT TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    store_name TEXT DEFAULT 'PartsShop',
    store_tagline TEXT DEFAULT 'Technical TV Schematics & PDF Marketplace',
    announcement_active BOOLEAN DEFAULT true,
    announcement_text TEXT DEFAULT '🔥 Super Sale: Flat 20% OFF on all Smart TV schematics & circuit manuals! Use code INSTANT20 at checkout.',
    coupons JSONB DEFAULT '[
        {"id": "c1", "code": "INSTANT20", "discountPercent": 20, "minAmountINR": 299, "isActive": true, "expiryDate": "2026-12-31"},
        {"id": "c2", "code": "PDF10", "discountPercent": 10, "minAmountINR": 199, "isActive": true, "expiryDate": "2026-12-31"}
    ]'::jsonb,
    support_email TEXT DEFAULT 'support@partsshop.com',
    upi_id TEXT DEFAULT 'partsshop@upi',
    allow_guest_checkout BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create public policy
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write on settings" ON public.settings;
CREATE POLICY "Allow public read and write on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Settings Row
INSERT INTO public.settings (
    id,
    store_name,
    store_tagline,
    announcement_active,
    announcement_text,
    coupons,
    support_email,
    upi_id,
    allow_guest_checkout
)
VALUES (
    'default_store_settings',
    'PartsShop',
    'Technical TV Schematics & PDF Marketplace',
    true,
    '🔥 Super Sale: Flat 20% OFF on all Smart TV schematics & circuit manuals! Use code INSTANT20 at checkout.',
    '[
        {"id": "c1", "code": "INSTANT20", "discountPercent": 20, "minAmountINR": 299, "isActive": true, "expiryDate": "2026-12-31"},
        {"id": "c2", "code": "PDF10", "discountPercent": 10, "minAmountINR": 199, "isActive": true, "expiryDate": "2026-12-31"}
    ]'::jsonb,
    'support@partsshop.com',
    'partsshop@upi',
    false
)
ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    store_tagline = EXCLUDED.store_tagline;
