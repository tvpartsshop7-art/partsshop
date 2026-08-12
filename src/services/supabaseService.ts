import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabaseClient';
import { User, Product, Order, StoreSettings } from '../types';

const REST_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates'
};

// ==================== USERS API ====================

export async function saveUserToSupabase(user: User): Promise<boolean> {
  try {
    const payload = {
      id: user.id,
      name: user.name,
      technician_name: user.technicianName || user.name,
      email: user.email,
      phone: user.phone || null,
      whatsapp_number: user.whatsappNumber || user.phone || null,
      aadhar_number: user.aadharNumber || null,
      avatar: user.avatar || null,
      role: user.role || 'buyer',
      status: user.status || 'active',
      total_purchases: user.totalPurchases || 0,
      total_spent_inr: user.totalSpentINR || 0,
      total_downloads: user.totalDownloads || 0,
      created_at: user.createdAt || new Date().toISOString(),
      last_login: user.lastLogin || new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: REST_HEADERS,
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase saveUser exception:', err);
    return false;
  }
}

export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((row: any) => ({
      id: row.id || `usr_${Date.now()}`,
      name: row.name || row.technician_name || 'Technician',
      technicianName: row.technician_name || row.name,
      email: row.email,
      phone: row.phone || row.whatsapp_number || '+91 98765 00000',
      whatsappNumber: row.whatsapp_number || row.phone,
      aadharNumber: row.aadhar_number,
      avatar: row.avatar,
      role: row.role || 'buyer',
      status: row.status || 'active',
      totalPurchases: row.total_purchases || 0,
      totalSpentINR: row.total_spent_inr || 0,
      totalDownloads: row.total_downloads || 0,
      createdAt: row.created_at || new Date().toISOString(),
      lastLogin: row.last_login
    }));
  } catch (err) {
    console.warn('Supabase fetchUsers exception:', err);
    return null;
  }
}

// ==================== PRODUCTS & SCHEMATICS API ====================

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      category: product.category,
      price: product.priceINR,
      price_inr: product.priceINR,
      price_usd: product.priceUSD,
      original_price_inr: product.originalPriceINR,
      original_price_usd: product.originalPriceUSD,
      discount_percent: product.discountPercent,
      rating: product.rating,
      review_count: product.reviewCount,
      sales_count: product.salesCount,
      image_cover: product.imageCover,
      preview_image_url: product.imageCover,
      file_size: product.pdfFileSize,
      pdf_file_size: product.pdfFileSize,
      page_count: product.pdfPageCount,
      pdf_page_count: product.pdfPageCount,
      pdf_url: product.localPdfDataUrl || null,
      pdf_file_name: product.pdfFileName || `${product.title}.pdf`,
      local_pdf_data_url: product.localPdfDataUrl || null,
      author_name: product.authorName,
      is_featured: product.isFeatured || false,
      is_active: product.isActive !== false,
      expires_in: product.expiresIn || 'Instant Download',
      expiry_days: 30,
      key_takeaways: product.keyTakeaways || [],
      table_of_contents: product.tableOfContents || [],
      sample_pages: product.sampleTextPages || [],
      schematics_data: product.sampleTextPages?.[0] || 'Technical Circuit Diagram'
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: REST_HEADERS,
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase saveProduct exception:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase deleteProduct exception:', err);
    return false;
  }
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      console.warn('Supabase fetchProducts failed with status:', res.status);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((row: any) => {
      const priceVal = Number(row.price || row.price_inr || 299);
      const origPriceVal = Number(row.original_price_inr || Math.round(priceVal * 2.2));
      const coverImage =
        row.preview_image_url ||
        row.image_cover ||
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop';
      const fileSize = row.file_size || row.pdf_file_size || '0.5 MB';
      const pageCount = Number(row.page_count || row.pdf_page_count || 12);
      const brand = row.brand || '';
      const modelNo = row.model_number || '';
      const subtitle =
        row.subtitle ||
        (brand ? `${brand} ${modelNo} Technical Circuit Schematics` : 'Technical Schematics Manual');

      return {
        id: row.id,
        title: row.title,
        subtitle: subtitle,
        description:
          row.description ||
          'Verified High-Resolution Technical Circuit Diagram & Service Manual with component test points.',
        category: row.category || 'Schematics & Hardware',
        priceINR: priceVal,
        priceUSD: Number(row.price_usd || Math.round(priceVal / 85)) || 4,
        originalPriceINR: origPriceVal,
        originalPriceUSD: Number(row.original_price_usd || Math.round(origPriceVal / 85)) || 10,
        discountPercent:
          row.discount_percent ||
          Math.max(10, Math.round(((origPriceVal - priceVal) / (origPriceVal || 1)) * 100)),
        rating: Number(row.rating) || 4.9,
        reviewCount: Number(row.review_count) || 28,
        salesCount: Number(row.sales_count) || 15,
        imageCover: coverImage,
        pdfFileSize: fileSize,
        pdfPageCount: pageCount,
        pdfFileName: row.pdf_file_name || `${row.title}.pdf`,
        localPdfDataUrl: row.pdf_url || row.local_pdf_data_url,
        authorName:
          row.author_name || (brand ? `${brand} Engineering Team` : 'Certified Master Technician'),
        isFeatured: !!row.is_featured,
        isActive: row.is_active !== false,
        expiresIn: row.expiry_days
          ? `${row.expiry_days} Days Access`
          : row.expires_in || 'Instant Download',
        keyTakeaways: row.key_takeaways || [
          'Pin voltages and point-to-point circuit board schematics',
          'Power supply board troubleshooting guide',
          'Motherboard fault finding & component diagnosis'
        ],
        tableOfContents: row.table_of_contents || [
          { pageNumber: 1, title: 'Power Block Diagram' },
          { pageNumber: 4, title: 'Voltage Test Points' },
          { pageNumber: 8, title: 'Component Schematics & Pinout' }
        ],
        sampleTextPages: row.sample_text_pages || [
          row.schematics_data ||
            'High-resolution vector schematic sheet. Full PDF will be unlocked after purchase.'
        ],
        publishedYear: '2026',
        reviews: []
      };
    });
  } catch (err) {
    console.warn('Supabase fetchProducts exception:', err);
    return null;
  }
}

// ==================== ORDERS API ====================

export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      total_amount_inr: order.totalAmountINR,
      total_amount_usd: order.totalAmountUSD,
      currency: order.currency,
      payment_method: order.paymentMethod,
      payment_reference: order.paymentReference,
      download_token: order.downloadToken,
      items: order.items,
      date: order.date,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: REST_HEADERS,
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase saveOrder exception:', err);
    return false;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((row: any) => ({
      id: row.id,
      customerName: row.customer_name || 'Verified Customer',
      customerEmail: row.customer_email,
      totalAmountINR: Number(row.total_amount_inr) || 0,
      totalAmountUSD: Number(row.total_amount_usd) || 0,
      currency: row.currency || 'INR',
      paymentMethod: row.payment_method || 'upi',
      paymentReference: row.payment_reference || 'REF123',
      downloadToken: row.download_token || 'TOKEN123',
      items: row.items || [],
      date: row.date || new Date().toLocaleDateString()
    }));
  } catch (err) {
    console.warn('Supabase fetchOrders exception:', err);
    return null;
  }
}

// ==================== STORE SETTINGS API ====================

export async function saveSettingsToSupabase(settings: StoreSettings): Promise<boolean> {
  try {
    const payload = {
      id: 'default_store_settings',
      store_name: settings.storeName,
      store_tagline: settings.storeTagline,
      announcement_active: settings.announcementActive,
      announcement_text: settings.announcementText,
      coupons: settings.coupons,
      support_email: settings.supportEmail,
      upi_id: settings.upiId,
      allow_guest_checkout: settings.allowGuestCheckout,
      updated_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
      method: 'POST',
      headers: REST_HEADERS,
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase saveSettings exception:', err);
    return false;
  }
}

export async function fetchSettingsFromSupabase(): Promise<StoreSettings | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.default_store_settings&select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const row = data[0];
    return {
      storeName: row.store_name || 'PartsShop',
      storeTagline: row.store_tagline || 'Technical TV Schematics & PDF Marketplace',
      announcementActive: row.announcement_active !== false,
      announcementText: row.announcement_text || '',
      coupons: row.coupons || [],
      supportEmail: row.support_email || 'support@partsshop.com',
      upiId: row.upi_id || 'partsshop@upi',
      allowGuestCheckout: !!row.allow_guest_checkout
    };
  } catch (err) {
    console.warn('Supabase fetchSettings exception:', err);
    return null;
  }
}
