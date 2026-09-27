/**
 * Utility functions for sending transactional emails via Resend
 */

export async function sendOrderEmails({ order, items, customer, subtotal, shipping, total, invoiceNo, paymentMethod, paymentId }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not configured. Skipping order notification emails.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@jhumkasbymalti.in';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sshreecollection593@gmail.com';

  const customerName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Valued Customer';
  const customerEmail = customer?.email;
  const customerPhone = customer?.phone || 'Not provided';
  const addressParts = [
    customer?.address,
    customer?.city,
    customer?.state ? `${customer.state} - ${customer?.pincode || ''}` : customer?.pincode,
  ].filter(Boolean);
  const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';

  const isPaidOnline = paymentMethod === 'razorpay' || !!paymentId;
  const paymentMethodLabel = isPaidOnline ? 'Paid Online (Razorpay)' : 'Cash on Delivery (COD)';

  // Build items HTML table rows with exact product name, size, unit price, and total
  const itemsRowsHtml = (items || []).map((item, index) => {
    const exactProductName = item.name || item.title || item.product_name || `Item #${index + 1}`;
    const unitPrice = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const itemTotal = (unitPrice * quantity).toFixed(2);

    const sizeBadge = item.selectedSize
      ? `<div style="margin-top: 4px;"><span style="display: inline-block; font-size: 11px; background-color: #fdf2f4; color: #831843; padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid #fce7eb;">Size / Variant: ${item.selectedSize}</span></div>`
      : '';
    const skuBadge = item.sku
      ? `<div style="margin-top: 2px; font-size: 11px; color: #6b7280; font-family: monospace;">SKU: ${item.sku}</div>`
      : '';
    const imgHtml = (item.image || (Array.isArray(item.images) ? item.images[0] : null) || item.image_url)
      ? `<img src="${item.image || (Array.isArray(item.images) ? item.images[0] : null) || item.image_url}" alt="${exactProductName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; float: left; margin-right: 12px;" />`
      : '';

    return `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0e6e8; color: #1f2937; font-size: 14px; vertical-align: top;">
          ${imgHtml}
          <div style="font-weight: 700; color: #111827; font-size: 14px; line-height: 1.4;">${exactProductName}</div>
          ${sizeBadge}
          ${skuBadge}
          <div style="font-size: 12px; color: #6b7280; margin-top: 3px;">Unit Price: ₹${unitPrice.toFixed(2)}</div>
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0e6e8; color: #374151; font-size: 14px; text-align: center; vertical-align: middle; font-weight: 600;">
          ${quantity}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0e6e8; color: #111827; font-size: 14px; text-align: right; font-weight: 700; vertical-align: middle;">
          ₹${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  // 1. Customer Email HTML Template
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Jhumkas by Malti</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf5f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
      <div style="max-width: 620px; margin: 25px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(131, 24, 67, 0.08); border: 1px solid #fce7eb;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #831843 0%, #6d1b36 100%); padding: 32px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase;">Jhumkas by Malti</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; letter-spacing: 0.5px;">Handcrafted Elegance & Timeless Jewels</p>
        </div>

        <div style="padding: 30px 24px;">
          <!-- Greeting -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #ecfdf5; color: #047857; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid #a7f3d0;">
              ✓ Order Confirmed
            </div>
            <h2 style="margin: 0; color: #1f2937; font-size: 20px; font-weight: 700;">Thank you for your order, ${customerName}!</h2>
            <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
              We have received your order and are carefully packing your handcrafted pieces.
            </p>
          </div>

          <!-- Order & Payment Info Box -->
          <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 5px 0; color: #831843; font-weight: 600;">Invoice Number:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #1f2937; text-align: right;">${invoiceNo}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #831843; font-weight: 600;">Payment Mode:</td>
                <td style="padding: 5px 0; font-weight: 600; color: #1f2937; text-align: right;">${paymentMethodLabel}</td>
              </tr>
              ${paymentId ? `
              <tr>
                <td style="padding: 5px 0; color: #831843; font-weight: 600;">Payment ID:</td>
                <td style="padding: 5px 0; font-size: 13px; font-family: monospace; color: #4b5563; text-align: right;">${paymentId}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Items Ordered Section -->
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #831843; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; border-bottom: 2px solid #fce7eb; padding-bottom: 6px;">
            Order Items (${(items || []).length})
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #faf5f6;">
                <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #831843; text-transform: uppercase; font-weight: 600;">Item</th>
                <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #831843; text-transform: uppercase; font-weight: 600; width: 50px;">Qty</th>
                <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #831843; text-transform: uppercase; font-weight: 600; width: 90px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <!-- Pricing Breakdown -->
          <div style="background-color: #faf5f6; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Subtotal</td>
                <td style="padding: 4px 0; text-align: right; color: #1f2937; font-weight: 500;">₹${parseFloat(subtotal || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Shipping</td>
                <td style="padding: 4px 0; text-align: right; color: ${Number(shipping) > 0 ? '#1f2937' : '#047857'}; font-weight: 600;">
                  ${Number(shipping) > 0 ? `₹${parseFloat(shipping).toFixed(2)}` : 'FREE'}
                </td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 10px 0 4px 0; font-size: 16px; font-weight: 700; color: #831843;">Total Amount</td>
                <td style="padding: 10px 0 4px 0; font-size: 16px; font-weight: 700; text-align: right; color: #831843;">₹${parseFloat(total || 0).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Delivery Address -->
          <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #831843; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700;">
            Shipping To
          </h3>
          <div style="background-color: #ffffff; border: 1px solid #f0e6e8; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 28px;">
            <strong style="color: #1f2937; font-size: 15px;">${customerName}</strong><br/>
            ${formattedAddress}<br/>
            <strong>Phone:</strong> ${customerPhone}<br/>
            <strong>Email:</strong> ${customerEmail || 'Not provided'}
          </div>

          <!-- Support & Footer -->
          <div style="border-top: 1px solid #fce7eb; padding-top: 20px; text-align: center;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px 0;">
              Need help with your order? Reach us anytime on WhatsApp at <strong>+91 8238672255</strong> or reply directly to this email.
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              &copy; ${new Date().getFullYear()} Jhumkas by Malti. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Owner / Admin Email HTML Template
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert - Jhumkas by Malti</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
      <div style="max-width: 620px; margin: 25px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #831843; padding: 24px 20px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700;">🔔 New Store Order Received!</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Order #${invoiceNo} &bull; Total: ₹${parseFloat(total || 0).toFixed(2)}</p>
        </div>

        <div style="padding: 24px;">
          <!-- Order Summary Card -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Invoice No:</td>
                <td style="padding: 4px 0; font-weight: 700; color: #1f2937; text-align: right;">${invoiceNo}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Payment Mode:</td>
                <td style="padding: 4px 0; font-weight: 700; color: ${isPaidOnline ? '#047857' : '#b45309'}; text-align: right;">${paymentMethodLabel}</td>
              </tr>
              ${paymentId ? `
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Razorpay Payment ID:</td>
                <td style="padding: 4px 0; font-family: monospace; font-size: 13px; color: #1f2937; text-align: right;">${paymentId}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Total Amount:</td>
                <td style="padding: 4px 0; font-weight: 700; color: #831843; font-size: 16px; text-align: right;">₹${parseFloat(total || 0).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Customer Info -->
          <h4 style="margin: 0 0 10px 0; color: #831843; font-size: 15px; text-transform: uppercase;">Customer & Shipping Details</h4>
          <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            <p style="margin: 0 0 4px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="margin: 0 0 4px 0;"><strong>Phone:</strong> <a href="tel:${customerPhone}" style="color: #831843; text-decoration: underline;">${customerPhone}</a></p>
            <p style="margin: 0 0 4px 0;"><strong>Email:</strong> ${customerEmail ? `<a href="mailto:${customerEmail}" style="color: #831843; text-decoration: underline;">${customerEmail}</a>` : 'Not provided'}</p>
            <p style="margin: 0;"><strong>Delivery Address:</strong> ${formattedAddress}</p>
          </div>

          <!-- Ordered Items -->
          <h4 style="margin: 0 0 10px 0; color: #831843; font-size: 15px; text-transform: uppercase;">Items in Order (${(items || []).length})</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #374151; text-transform: uppercase;">Product</th>
                <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #374151; text-transform: uppercase; width: 50px;">Qty</th>
                <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #374151; text-transform: uppercase; width: 90px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              This notification was generated automatically upon successful order placement.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Prepare dispatch promises
  const emailPromises = [];

  // Send to Customer (if valid email provided)
  if (customerEmail && customerEmail.includes('@')) {
    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `Jhumkas by Malti <${fromEmail}>`,
          to: customerEmail,
          subject: `✨ Order Confirmed! #${invoiceNo} - Jhumkas by Malti`,
          html: customerHtml,
        }),
      }).then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error(`Resend error sending to customer (${customerEmail}):`, res.status, body);
          return { recipient: 'customer', success: false, error: body };
        }
        console.log(`Resend: Customer confirmation email sent successfully to ${customerEmail}`, body);
        return { recipient: 'customer', success: true, data: body };
      }).catch((err) => {
        console.error(`Resend fetch exception sending to customer (${customerEmail}):`, err);
        return { recipient: 'customer', success: false, error: err.message };
      })
    );
  } else {
    console.warn('Customer email not provided or invalid format. Skipping customer notification email.');
  }

  // Send to Admin / Owner
  if (adminEmail && adminEmail.includes('@')) {
    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `Jhumkas by Malti <${fromEmail}>`,
          to: adminEmail,
          subject: `🔔 New Order Placed: #${invoiceNo} (₹${parseFloat(total || 0).toFixed(2)})`,
          html: adminHtml,
        }),
      }).then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error(`Resend error sending to admin (${adminEmail}):`, res.status, body);
          return { recipient: 'admin', success: false, error: body };
        }
        console.log(`Resend: Admin order notification email sent successfully to ${adminEmail}`, body);
        return { recipient: 'admin', success: true, data: body };
      }).catch((err) => {
        console.error(`Resend fetch exception sending to admin (${adminEmail}):`, err);
        return { recipient: 'admin', success: false, error: err.message };
      })
    );
  }

  const results = await Promise.allSettled(emailPromises);
  return { success: true, results };
}
