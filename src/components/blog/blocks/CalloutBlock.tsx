import { Zap, Info, CheckCircle2, AlertTriangle } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { CalloutBlock as CalloutBlockData } from '@/payload-types'

const VARIANT_META: Record<
  CalloutBlockData['variant'],
  { cls: string; icon: typeof Zap; defaultLabel: string }
> = {
  keyTakeaway: { cls: '', icon: Zap, defaultLabel: 'Key takeaway' },
  info: { cls: '', icon: Info, defaultLabel: 'Note' },
  success: { cls: 'success', icon: CheckCircle2, defaultLabel: 'Success' },
  warning: { cls: 'warning', icon: AlertTriangle, defaultLabel: 'Heads up' },
}

/**
 * "Key Takeaway" callout — rendered from the custom Lexical `callout` block.
 * `fields.text` is a nested Lexical state, rendered recursively with RichText.
 */
export function CalloutBlock({ data }: { data: CalloutBlockData }) {
  const meta = VARIANT_META[data.variant] ?? VARIANT_META.keyTakeaway
  const Icon = meta.icon
  return (
    <div className={`callout${meta.cls ? ` ${meta.cls}` : ''}`}>
      <div className="lbl">
        <Icon />
        <span>{data.heading || meta.defaultLabel}</span>
      </div>
      <RichText data={data.text} disableContainer />
    </div>
  )
}
