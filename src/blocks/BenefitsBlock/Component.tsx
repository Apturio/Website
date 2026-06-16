import { Benefits } from '@/components/Benefits'
import type { BenefitsBlock } from '@/payload-types'

export function BenefitsBlockComponent({ block }: { block: BenefitsBlock; lang: string }) {
  return <Benefits block={block} />
}
