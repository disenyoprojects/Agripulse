import { db } from '@/lib/db'
import HeroSection from '@/components/landing/HeroSection'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import RewardsSection from '@/components/landing/RewardsSection'
import ImpactSection from '@/components/landing/ImpactSection'
import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'

export const dynamic = 'force-dynamic'

async function getLiveCounts() {
  const [farmers, submissions] = await Promise.all([
    db.farmer.count(),
    db.submission.count(),
  ])
  return { farmers, submissions }
}

export default async function LandingPage() {
  const counts = await getLiveCounts()

  return (
    <main>
      <HeroSection counts={counts} />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <RewardsSection />
      <ImpactSection />
      <CtaSection />
      <LandingFooter />
    </main>
  )
}
