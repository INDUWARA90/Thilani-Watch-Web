const Order = require('../models/Order')
const Watch = require('../models/Watch')
const User = require('../models/User') // Assuming User model exists
const asyncHandler = require('../utils/asyncHandler')

/**
 * Get high-level summary for admin dashboard cards.
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [revenueData, orderCounts, productCount, customerCount] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Watch.countDocuments({ deletedAt: null }),
    User.countDocuments({ role: 'customer' }),
  ])

  res.json({
    success: true,
    data: {
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      orderStatusBreakdown: orderCounts,
      totalProducts: productCount,
      totalCustomers: customerCount,
    },
  })
})

/**
 * Get sales summary aggregated by day for a chart.
 */
const getSalesSummary = asyncHandler(async (req, res) => {
  const days = Number.parseInt(req.query.days, 10) || 30
  const dateThreshold = new Date()
  dateThreshold.setDate(dateThreshold.getDate() - days)

  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: dateThreshold }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  res.json({ success: true, data: sales })
})

module.exports = { getDashboardSummary, getSalesSummary }