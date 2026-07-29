import FarmerWizard from '@/components/mobile-wizard/FarmerWizard'

// Public, farmer-facing portal. The same wizard is also embedded in the LGU
// dashboard at /dashboard/farmer-form (see FarmerWizard's `embedded` prop).
export default function MobileWizardPage() {
  return <FarmerWizard />
}
