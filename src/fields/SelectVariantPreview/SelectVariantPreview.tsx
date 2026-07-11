'use client'

import { useField, FieldDescription } from '@payloadcms/ui'
import type { FieldDescriptionClientProps } from 'payload'
import './index.scss'

type Props = FieldDescriptionClientProps & {
  previewMap: Record<string, string>
  description?: unknown
}

/**
 * Description-slot client component for `selectVariantField`. Reads the live
 * value of the select via `useField` (Payload resolves the fully-qualified
 * `path` for nested-array fields already, so this works unmodified for
 * `PricingBlock.plans[].planId`) and swaps the preview `<img>` accordingly.
 * Falls back to the first `previewMap` entry (by key order) when the value
 * is empty/unset.
 */
export function SelectVariantPreview(props: Props) {
  const { value } = useField<string>({ path: props.path })

  const fallback = Object.keys(props.previewMap)[0]
  const src = (value && props.previewMap[value]) || props.previewMap[fallback]

  return (
    <div className="select-variant-preview">
      {src && <img src={src} alt="" className="select-variant-preview__img" />}
      <FieldDescription path={props.path} description={props.description} />
    </div>
  )
}
