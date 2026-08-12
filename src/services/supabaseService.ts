import { supabase } from '../lib/supabaseClient';
import { User, Product, Order, StoreSettings } from '../types';

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

    const { error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase saveUser error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveUser exception:', err);
    return false;
  }
}

export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchUsers error:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name || row.technician_name || 'Member',
      technicianName: row.technician_name || row.name,
      email: row.email,
      phone: row.phone || row.whatsapp_number,
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

// ==================== PRODUCTS API ====================

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      category: product.category,
      price_inr: product.priceINR,
      price_usd: product.priceUSD,
      original_price_inr: product.originalPriceINR,
      original_price_usd: product.originalPriceUSD,
      discount_percent: product.discountPercent,
      rating: product.rating,
      review_count: product.reviewCount,
      sales_count: product.salesCount,
      image_cover: product.imageCover,
      pdf_file_size: product.pdfFileSize,
      pdf_page_count: product.pdfPageCount,
      pdf_file_name: product.pdfFileName || null,
      local_pdf_data_url: product.localPdfDataUrl || null,
      author_name: product.authorName,
      is_featured: product.isFeatured || false,
      is_active: product.isActive !== false,
      expires_in: product.expiresIn || 'Instant Download',
      key_takeaways: product.keyTakeaways || [],
      table_of_contents: product.tableOfContents || [],
      sample_pages: product.sampleTextPages || [],
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase saveProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveProduct exception:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.warn('Supabase deleteProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteProduct exception:', err);
    return false;
  }
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts error:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      category: row.category,
      priceINR: Number(row.price_inr) || 299,
      priceUSD: Number(row.price_usd) || 4,
      originalPriceINR: Number(row.original_price_inr) || 999,
      originalPriceUSD: Number(row.original_price_usd) || 12,
      discountPercent: row.discount_percent,
      rating: Number(row.rating) || 4.9,
      reviewCount: Number(row.review_count) || 25,
      salesCount: Number(row.sales_count) || 10,
      imageCover: row.image_cover,
      pdfFileSize: row.pdf_file_size || '10 MB',
      pdfPageCount: Number(row.pdf_page_count) || 1,
      pdfFileName: row.pdf_file_name,
      localPdfDataUrl: row.local_pdf_data_url,
      authorName: row.author_name || 'Master Engineer',
      isFeatured: row.is_featured,
      isActive: row.is_active !== false,
      expiresIn: row.expires_in || 'Instant Download',
      keyTakeaways: row.key_takeaways || [],
      tableOfContents: row.table_of_contents || [],
      sampleTextPages: row.sample_text_pages || [
        'Interactive preview not available for this schematic. Full high-resolution vector PDF will be unlocked after purchase.'
      ],
      publishedYear: row.published_year || '2026',
      reviews: []
    }));
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

    const { error } = await supabase
      .from('orders')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase saveOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveOrder exception:', err);
    return false;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      customerName: row.customer_name,
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

    const { error } = await supabase
      .from('settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase saveSettings error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveSettings exception:', err);
    return false;
  }
}

export async function fetchSettingsFromSupabase(): Promise<StoreSettings | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'default_store_settings')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      storeName: data.store_name || 'PartsShop',
      storeTagline: data.store_tagline || 'Technical TV Schematics & PDF Marketplace',
      announcementActive: data.announcement_active !== false,
      announcementText: data.announcement_text || '',
      coupons: data.coupons || [],
      supportEmail: data.support_email || 'support@partsshop.com',
      upiId: data.upi_id || 'partsshop@upi',
      allowGuestCheckout: !!data.allow_guest_checkout
    };
  } catch (err) {
    console.warn('Supabase fetchSettings exception:', err);
    return null;
  }
}
