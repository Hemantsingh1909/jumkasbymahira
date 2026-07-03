import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/src/lib/supabase';

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

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    const orders = (data || []).map(o => ({
      ...o,
      status: mapOrderStatusToFrontend(o.status),
      invoiceNo: formatInvoiceNo(o.id, o.created_at),
      // Ensure frontend customer state gets parsed correctly
      customer: typeof o.customer === 'string' ? JSON.parse(o.customer) : o.customer,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, subtotal, shipping, total } = body;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer,
        items,
        subtotal,
        shipping,
        total,
        payment_method: customer.paymentMethod || 'cod',
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      status: mapOrderStatusToFrontend(data.status),
      invoiceNo: formatInvoiceNo(data.id, data.created_at)
    });
  } catch (error) {
    console.error('Error creating order in Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
