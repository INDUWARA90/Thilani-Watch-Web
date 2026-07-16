const ErrorResponse = require('../utils/ErrorResponse')

const cents = (amount) => Math.round(Number(amount || 0) * 100)

const createMockPaymentIntent = async ({ amount, currency, orderId }) => ({
  provider: 'mock',
  providerPaymentId: `mock_pi_${orderId}_${Date.now()}`,
  clientSecret: `mock_secret_${orderId}_${Date.now()}`,
  amount,
  currency,
})

const createStripePaymentIntent = async ({ amount, currency, orderId, customerEmail }) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ErrorResponse('Stripe secret key is not configured', 500)
  }

  const body = new URLSearchParams({
    amount: String(cents(amount)),
    currency: String(currency || 'LKR').toLowerCase(),
    'metadata[orderId]': String(orderId),
  })

  if (customerEmail) body.set('receipt_email', customerEmail)

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new ErrorResponse(payload.error?.message || 'Unable to initialize card payment', response.status)
  }

  return {
    provider: 'stripe',
    providerPaymentId: payload.id,
    clientSecret: payload.client_secret,
    amount,
    currency,
  }
}

const createPaymentIntent = async (options) => {
  if (options.paymentMethod === 'cod') {
    return { provider: 'cod', amount: options.amount, currency: options.currency }
  }

  if (options.paymentMethod === 'bank_transfer') {
    return { provider: 'bank_transfer', amount: options.amount, currency: options.currency }
  }

  if (options.paymentMethod !== 'card') {
    throw new ErrorResponse('Unsupported payment method', 400)
  }

  if (process.env.PAYMENT_PROVIDER === 'stripe') {
    return createStripePaymentIntent(options)
  }

  return createMockPaymentIntent(options)
}

const createRefund = async ({ order, amount, reason }) => {
  if (order.payment?.provider === 'stripe' && process.env.STRIPE_SECRET_KEY && order.payment.providerPaymentId) {
    const body = new URLSearchParams({
      payment_intent: order.payment.providerPaymentId,
      amount: String(cents(amount)),
      reason: reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
    })

    const response = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new ErrorResponse(payload.error?.message || 'Unable to create refund', response.status)
    }

    return {
      providerRefundId: payload.id,
      status: payload.status === 'succeeded' ? 'succeeded' : 'pending',
    }
  }

  return {
    providerRefundId: `mock_refund_${order._id}_${Date.now()}`,
    status: 'succeeded',
  }
}

module.exports = {
  createPaymentIntent,
  createRefund,
}
