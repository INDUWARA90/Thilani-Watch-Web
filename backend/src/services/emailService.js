const sendEmail = async ({ to, subject, text }) => {
  if (!to) return { skipped: true, reason: 'missing recipient' }

  if (!process.env.RESEND_API_KEY) {
    return { skipped: true, reason: 'RESEND_API_KEY is not configured' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Thilani Watch <orders@thilaniwatch.local>',
      to,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || 'Unable to send email')
  }

  return response.json()
}

const notifyUser = async (message) => {
  try {
    return await sendEmail(message)
  } catch (error) {
    console.error('Email notification failed:', error.message)
    return { skipped: true, reason: error.message }
  }
}

const sendWelcomeEmail = (user) =>
  notifyUser({
    to: user.email,
    subject: 'Welcome to Thilani Watch',
    text: `Hi ${user.name}, your Thilani Watch account is ready.`,
  })

const sendPasswordChangedEmail = (user) =>
  notifyUser({
    to: user.email,
    subject: 'Your Thilani Watch password was changed',
    text: 'Your password was changed successfully. If this was not you, please contact support immediately.',
  })

const sendOrderConfirmationEmail = (user, order) =>
  notifyUser({
    to: user.email,
    subject: `Order confirmation ${order._id}`,
    text: `Hi ${user.name}, we received your order for LKR ${order.total}.`,
  })

const sendShippingUpdateEmail = (user, order) =>
  notifyUser({
    to: user.email,
    subject: `Shipping update for order ${order._id}`,
    text: `Your order is now ${order.orderStatus}. Tracking: ${order.trackingNumber || 'not available yet'}.`,
  })

module.exports = {
  sendOrderConfirmationEmail,
  sendPasswordChangedEmail,
  sendShippingUpdateEmail,
  sendWelcomeEmail,
}
