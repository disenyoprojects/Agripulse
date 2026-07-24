import HeroSection from '@/components/landing/HeroSection'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import RewardsSection from '@/components/landing/RewardsSection'
import ImpactSection from '@/components/landing/ImpactSection'
import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
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
