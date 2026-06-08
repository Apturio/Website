import { TheProblem } from '@/components/TheProblem'
import type { ProblemBlock } from '@/payload-types'

export function ProblemBlockComponent({ block }: { block: ProblemBlock; lang: string }) {
  return <TheProblem block={block} />
}
