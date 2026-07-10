'use client'

import { useMemo, useState } from 'react'
import { useField, Popup, FieldError, FieldDescription } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { ChevronDown, X } from 'lucide-react'
import { iconList, getIcon } from './icons'
import './index.scss'

/**
 * Payload admin custom field component: replaces the plain text input for
 * icon-name fields with a visual popover picker (search + grid) over the
 * full lucide-react set. Persists the same kebab-case string the field
 * already stores today — this is purely an admin UI layer (type stays 'text').
 */
export function IconPickerField(props: TextFieldClientProps) {
  const { value, setValue, showError, errorMessage, disabled } = useField<string>({
    path: props.path,
  })
  // Required must come from the field config (not useField's return, which
  // has no `required` key, and not inferred from the field name).
  const required = props.field?.required ?? false
  const label =
    typeof props.field?.label === 'string' ? props.field.label : undefined
  // `disabled` (from useField) covers form-level processing/submission state;
  // `props.readOnly` covers field-level admin.readOnly / access-control locking.
  // Both must block interaction — a native Payload field respects both.
  const isReadOnly = disabled || Boolean(props.readOnly)

  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return iconList
    const q = query.toLowerCase()
    return iconList.filter((entry) => entry.name.includes(q))
  }, [query])

  const Selected = value ? getIcon(value) : undefined
  const showClear = Boolean(value) && !required && !isReadOnly

  return (
    <div className="field-type icon-picker">
      {label && <label className="icon-picker__label-top">{label}</label>}
      <Popup
        size="medium"
        horizontalAlign="left"
        disabled={isReadOnly}
        button={
          <button
            type="button"
            className="icon-picker__trigger"
            disabled={isReadOnly}
          >
            {Selected ? (
              <>
                <Selected size={20} />
                <span className="icon-picker__trigger-name">{value}</span>
              </>
            ) : value ? (
              <span className="icon-picker__trigger-name icon-picker__trigger-unresolved">
                {value} (unknown icon)
              </span>
            ) : (
              <span className="icon-picker__trigger-placeholder">Select icon…</span>
            )}
            {showClear && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear icon"
                className="icon-picker__clear"
                onClick={(e) => {
                  e.stopPropagation()
                  setValue('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    setValue('')
                  }
                }}
              >
                <X size={14} />
              </span>
            )}
            <ChevronDown size={16} className="icon-picker__chevron" />
          </button>
        }
        render={({ close }) => (
          <div className="icon-picker__popover">
            <input
              type="text"
              className="icon-picker__search"
              placeholder="Search icons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="icon-picker__grid">
              {filtered.length === 0 ? (
                <p className="icon-picker__empty">No icons found for &quot;{query}&quot;</p>
              ) : (
                filtered.map((entry) => (
                  <button
                    key={entry.name}
                    type="button"
                    className={
                      'icon-picker__cell' + (entry.name === value ? ' is-selected' : '')
                    }
                    onClick={() => {
                      setValue(entry.name)
                      setQuery('')
                      close()
                    }}
                  >
                    <entry.Component size={20} />
                    <span className="icon-picker__cell-label">{entry.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      />
      <FieldError path={props.path} showError={showError} message={errorMessage} />
      <FieldDescription path={props.path} description={props.field?.admin?.description} />
    </div>
  )
}
