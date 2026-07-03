import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin, verifyAdminSession } from '@/src/lib/supabase';

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

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const { data, error } = await supabasePublic
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...data,
      stockStatus: mapStockStatusToFrontend(data.stock_status),
      images: data.images || [],
      tags: data.tags || [],
      image: data.images?.[0] || '/images/products/one.jpeg'
    });
  } catch (error) {
    console.error('Error fetching product from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
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
      .update({
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
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      stockStatus: mapStockStatusToFrontend(data.stock_status),
      images: data.images || [],
      tags: data.tags || [],
      image: data.images?.[0] || '/images/products/one.jpeg'
    });
  } catch (error) {
    console.error('Error updating product in Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product from Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
