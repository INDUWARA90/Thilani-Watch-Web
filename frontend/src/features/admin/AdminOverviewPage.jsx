import { Link } from 'react-router'

const overviewCards = [
  {
    title: 'Product Management',
    text: 'Create watches, edit product data, upload images, update stock, publish, and delete.',
    to: '/admin/products',
  },
  {
    title: 'Categories & Brands',
    text: 'Maintain catalog entry points with active state, sort order, image URLs, and slugs.',
    to: '/admin/catalog',
  },
  {
    title: 'Orders',
    text: 'Review customer orders, open order details, and update order or payment status.',
    to: '/admin/orders',
  },
  {
    title: 'Reviews',
    text: 'Moderate visible reviews using the approval toggle endpoint.',
    to: '/admin/reviews',
  },
]

export const AdminOverviewPage = () => (
  <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,41,56,0.06)] sm:p-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-teal-700">Dashboard</p>
        <h2 className="m-0 text-3xl font-bold leading-tight text-slate-950">Admin operations</h2>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {overviewCards.map((card) => (
        <Link className="block rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-950 no-underline hover:border-teal-200 hover:bg-teal-50" key={card.title} to={card.to}>
          <h3 className="mb-3 text-xl font-bold text-slate-950">{card.title}</h3>
          <p className="m-0 text-slate-600">{card.text}</p>
        </Link>
      ))}
    </div>
  </div>
)
