-- ==============================================================================
-- TV PARTS SHOP / PDFSTORE - SUPABASE DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/amoayribokcajpmqmgea/sql
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

-- Enable Row Level Security (RLS) and allow public read/write for demo client
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- 2. PRODUCTS & SCHEMATICS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT DEFAULT 'Schematics & Hardware',
    price_inr NUMERIC NOT NULL DEFAULT 299,
    price_usd NUMERIC NOT NULL DEFAULT 4,
    original_price_inr NUMERIC DEFAULT 999,
    original_price_usd NUMERIC DEFAULT 12,
    discount_percent INTEGER,
    rating NUMERIC DEFAULT 4.9,
    review_count INTEGER DEFAULT 25,
    sales_count INTEGER DEFAULT 0,
    image_cover TEXT,
    pdf_file_size TEXT DEFAULT '10 MB',
    pdf_page_count INTEGER DEFAULT 1,
    pdf_file_name TEXT,
    local_pdf_data_url TEXT,
    author_name TEXT DEFAULT 'Certified Master Technician',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    expires_in TEXT DEFAULT 'Instant Download',
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    table_of_contents JSONB DEFAULT '[]'::jsonb,
    sample_pages JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 3. ORDERS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount_inr NUMERIC NOT NULL,
    total_amount_usd NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'upi',
    payment_reference TEXT,
    download_token TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- 4. STORE SETTINGS & ANNOUNCEMENT TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    announcement_active BOOLEAN DEFAULT false,
    announcement_text TEXT,
    coupons JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Seed Default Store Settings
INSERT INTO public.settings (id, announcement_active, announcement_text, coupons)
VALUES (
    'default_store_settings',
    true,
    '🔥 Super Sale: Flat 20% OFF on all Smart TV schematics & circuit manuals! Use code INSTANT20 at checkout.',
    '[
        {"id": "c1", "code": "INSTANT20", "discountPercent": 20, "expiresIn": "2 days left", "isActive": true, "usageCount": 142},
        {"id": "c2", "code": "PDF10", "discountPercent": 10, "expiresIn": "Ongoing", "isActive": true, "usageCount": 89}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
