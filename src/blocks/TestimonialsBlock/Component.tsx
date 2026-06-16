import { Testimonials } from '@/components/Testimonials'
import type { TestimonialsBlock } from '@/payload-types'

export function TestimonialsBlockComponent({ block }: { block: TestimonialsBlock; lang: string }) {
  return <Testimonials block={block} />
}
