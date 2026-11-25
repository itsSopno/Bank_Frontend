"use client";

const plans = [
  {
    name: "Personal",
    price: "Free",
    desc: "Perfect for individuals managing everyday finances.",
    features: [
      "1 Savings Account",
      "Fund Transfers",
      "Transaction History",
      "Loan Applications",
      "Mobile & Web Access",
    ],
    cta: "Get Started",
    href: "/register",
    highlight: false,
  },
  {
    name: "Premium",
    price: "৳299/mo",
    desc: "For power users who need more control and features.",
    features: [
      "3 Accounts (Any Type)",
      "Priority Transfers",
      "Advanced Analytics",
      "Instant Loan Approval",
      "Dedicated Support",
      "PDF Reports & Exports",
    ],
    cta: "Start Premium",
    href: "/register",
    highlight: true,
  },
  {
    name: "Business",
    price: "৳999/mo",
    desc: "Full-featured banking for businesses and enterprises.",
    features: [
      "Unlimited Accounts",
      "Bulk Transfers",
      "Staff & Admin Roles",
      "Custom Limits & Controls",
      "API Access",
      "Priority 24/7 Support",
    ],
    cta: "Contact Sales",
    href: "/register",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#0D0D0F] py-24 px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-[#FF5A1F]/6 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-2 text-sm font-medium text-[#FF5A1F] mb-5">
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Choose your plan
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-7 flex flex-col transition-all hover:scale-[1.02] ${
                plan.highlight
                  ? "border-[#FF5A1F]/50 bg-gradient-to-b from-[#FF5A1F]/15 to-[#FF5A1F]/5 shadow-2xl shadow-[#FF5A1F]/15"
                  : "border-white/8 bg-white/3 hover:border-white/15"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#FF5A1F] px-4 py-1 text-xs font-bold text-white shadow-lg shadow-[#FF5A1F]/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="text-sm font-semibold text-white/50 mb-1">{plan.name}</p>
                <p className={`text-4xl font-black mb-2 ${plan.highlight ? "text-[#FF5A1F]" : "text-white"}`}>
                  {plan.price}
                </p>
                <p className="text-sm text-white/35">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                    <span className={`h-1.5 w-1.5 rounded-full ${plan.highlight ? "bg-[#FF5A1F]" : "bg-[#00E676]"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block rounded-2xl py-3 text-center text-sm font-bold transition-all ${
                  plan.highlight
                    ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 hover:bg-[#e04d18]"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

