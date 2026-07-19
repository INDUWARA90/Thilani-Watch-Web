const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatCurrency = (amount) => `LKR ${Number(amount || 0).toFixed(2)}`

const sendResendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to send emails')
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM

  if (!fromEmail) {
    throw new Error('RESEND_FROM_EMAIL or EMAIL_FROM is required to send emails')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Resend API error: ${errorBody}`)
  }

  return response.json()
}

const sendOrderNotification = async (order) => {
  if (!process.env.SHOP_OWNER_EMAIL) {
    throw new Error('SHOP_OWNER_EMAIL is required to send order notifications')
  }

  const items = order.items || []
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.quantity)}</td>
          <td>${escapeHtml(formatCurrency(item.price))}</td>
        </tr>
      `,
    )
    .join('')

  const textItems = items
    .map((item) => `- ${item.name} x ${item.quantity}: ${formatCurrency(item.price)}`)
    .join('\n')

  return sendResendEmail({
    to: process.env.SHOP_OWNER_EMAIL,
    subject: `New order received: ${order._id}`,
    html: `
      <h1>New Order Received</h1>
      <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.customerEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</p>
      <table cellpadding="8" cellspacing="0" border="1">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="left">Quantity</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p><strong>Total:</strong> ${escapeHtml(formatCurrency(order.totalPrice))}</p>
    `,
    text: [
      'New Order Received',
      `Order ID: ${order._id}`,
      `Customer: ${order.customerName}`,
      `Email: ${order.customerEmail}`,
      `Phone: ${order.customerPhone}`,
      'Items:',
      textItems,
      `Total: ${formatCurrency(order.totalPrice)}`,
    ].join('\n'),
  })
}

const sendOtpEmail = async (toEmail, otp) => {
  return sendResendEmail({
    to: toEmail,
    subject: 'Your password reset OTP',
    html: `
      <h1>Password Reset OTP</h1>
      <p>Use this OTP to reset your password:</p>
      <p><strong>${escapeHtml(otp)}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
    `,
    text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
  })
}

module.exports = {
  sendOtpEmail,
  sendOrderNotification,
}
