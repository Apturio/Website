import { TrustedBy } from '@/components/TrustedBy'
import type { LogosBlock } from '@/payload-types'

export function LogosBlockComponent({ block }: { block: LogosBlock; lang: string }) {
  return <TrustedBy block={block} />
}
