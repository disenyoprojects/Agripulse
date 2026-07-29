import PriceAdvisor from '@/components/price-advisor/PriceAdvisor'

// The Price Advisor embedded in the LGU dashboard shell (admin sidebar stays
// visible). `embedded` hides the public Back button and farmer bottom tabs so
// the admin never leaves the dashboard. Auth is enforced by the dashboard layout.
export default function DashboardPriceAdvisorPage() {
  return <PriceAdvisor embedded />
}
