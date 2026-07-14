import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export const DummyContent = ({ actionLabel, copy, eyebrow, title, to }) => (
  <section className="bg-[#F8F9FA] px-4 py-16 sm:px-6 lg:px-10">
    <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
      <div>
        <span className="text-sm font-normal text-[#F49006]">{eyebrow}</span>
        <h2 className="mt-3 max-w-3xl text-[36px] font-bold leading-tight text-[#121212] sm:text-[50px] sm:leading-[48px]">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#212529] sm:text-lg">
          {copy}
        </p>
      </div>

      <div className="rounded-[20px] border border-white bg-white p-6 shadow-[13px_14px_12.6px_0_rgba(0,0,0,0.05)]">
        <div className="mb-6 grid grid-cols-3 gap-3">
          {['Classic', 'Modern', 'Premium'].map((item) => (
            <span className="rounded-[14px] border border-[#DEE2E6] bg-[#F8F9FA] px-3 py-3 text-center text-sm font-normal text-[#121212]" key={item}>
              {item}
            </span>
          ))}
        </div>
        <Link className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#121212] px-8 text-sm font-normal text-white no-underline transition hover:bg-[#272222] active:scale-[0.98]" to={to}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
)
