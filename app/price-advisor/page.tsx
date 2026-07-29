import PriceAdvisor from '@/components/price-advisor/PriceAdvisor'

// Public, farmer-facing Price Advisor. The same tool is also embedded in the LGU
// dashboard at /dashboard/price-advisor (see PriceAdvisor's `embedded` prop).
export default function PriceAdvisorPage() {
  return <PriceAdvisor />
}
