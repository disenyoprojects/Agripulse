import FarmerWizard from '@/components/mobile-wizard/FarmerWizard'

// The Farmer Form embedded in the LGU dashboard shell (admin sidebar stays
// visible). `embedded` hides the public exit link and farmer bottom tabs so the
// admin never leaves the dashboard. Auth is enforced by the dashboard layout.
export default function DashboardFarmerFormPage() {
  return <FarmerWizard embedded />
}
