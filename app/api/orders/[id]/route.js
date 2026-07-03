import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

function mapOrderStatusToFrontend(status) {
  if (status === 'new') return 'New';
  if (status === 'processing') return 'Processing';
  if (status === 'shipped') return 'Shipped';
  if (status === 'delivered') return 'Delivered';
  return status || 'New';
}

function mapOrderStatusToDb(status) {
  if (status === 'New') return 'new';
  if (status === 'Processing') return 'processing';
  if (status === 'Shipped') return 'shipped';
  if (status === 'Delivered') return 'delivered';
  return status || 'new';
}

function formatInvoiceNo(orderId, dateString) {
  const year = new Date(dateString || new Date()).getFullYear();
  const formattedId = String(orderId).padStart(4, '0');
  return `INV-${year}-${formattedId}`;
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { status } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: mapOrderStatusToDb(status) })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      status: mapOrderStatusToFrontend(data.status),
      invoiceNo: formatInvoiceNo(data.id, data.created_at)
    });
  } catch (error) {
    console.error('Error updating order status in Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  }
}
