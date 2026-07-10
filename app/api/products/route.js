import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin, verifyAdminSession } from '@/src/lib/supabase';
import { revalidateTag } from 'next/cache';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

function mapStockStatusToDb(status) {
  if (status === 'In Stock') return 'in_stock';
  if (status === 'Low Stock') return 'low_stock';
  if (status === 'Out of Stock') return 'out_of_stock';
  return status || 'in_stock';
}

export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    
    // Normalize properties to match frontend models (camelCase, arrays, status text)
    const products = (data || []).map(p => ({
      ...p,
      stockStatus: mapStockStatusToFrontend(p.stock_status),
      // Handled as array automatically by supabase-js for text[] columns
      images: p.images || [],
      tags: p.tags || [],
      // Fallback for single image reference
      image: p.images?.[0] || '/images/products/one.jpeg'
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      sku,
      price,
      category,
      images,
      description,
      stockStatus,
      tags,
      material,
      occasion,
      color
    } = body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        sku,
        price,
        category,
        images: Array.isArray(images) ? images : [images],
        description,
        stock_status: mapStockStatusToDb(stockStatus),
        tags: Array.isArray(tags) ? tags : [],
        material,
        occasion,
        color
      })
      .select()
      .single();

    if (error) throw error;

    revalidateTag('products');

    return NextResponse.json({
      ...data,
      stockStatus: mapStockStatusToFrontend(data.stock_status),
      image: data.images?.[0] || '/images/products/one.jpeg'
    });
  } catch (error) {
    console.error('Error adding product to Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to add product' }, { status: 500 });
  }
}
