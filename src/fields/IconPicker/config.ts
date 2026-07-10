import type { Field, TextField } from 'payload'

/**
 * Field factory for the Icon Picker admin field.
 *
 * Keeps the persisted field `type: 'text'` (no schema change) and additively
 * wires the custom picker UI via `admin.components.Field`. Callers (Phase 18)
 * supply their own `name`, `required`, `localized`, etc. via `overrides` —
 * this factory intentionally does not set a default `name`.
 */
export function iconPickerField(
  overrides: Partial<Omit<TextField, 'type'>> = {},
): Field {
  const baseAdmin = {
    description: 'Lucide icon name (e.g. calendar-check).',
    components: {
      Field: '@/fields/IconPicker/IconPickerField#IconPickerField',
    },
  }

  const { admin: overrideAdmin, ...restOverrides } = overrides

  return {
    ...restOverrides,
    type: 'text',
    admin: {
      ...baseAdmin,
      ...overrideAdmin,
      components: {
        ...overrideAdmin?.components,
        Field: baseAdmin.components.Field, // only force the Field slot
      },
    },
  } as Field
}
