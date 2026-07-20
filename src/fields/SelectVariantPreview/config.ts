import type { Field, SelectField } from 'payload'

/**
 * Field factory for select fields that show a live preview image under the
 * dropdown, one image per option value.
 *
 * Keeps the persisted field `type: 'select'` (no schema change) and
 * additively wires the custom preview UI via `admin.components.Description`
 * — unlike `iconPickerField` (which replaces the whole `Field` slot), this
 * factory only owns `Description`, leaving Payload's native `<select>` intact.
 *
 * `previewMap` (value → public image path) is passed through as
 * `clientProps`, along with the caller's original `admin.description` (if
 * any) so existing help text keeps rendering below the preview image.
 */
export function selectVariantField(
  overrides: Partial<Omit<SelectField, 'type'>>,
  previewMap: Record<string, string>,
): Field {
  const { admin: overrideAdmin, ...restOverrides } = overrides

  return {
    ...restOverrides,
    type: 'select',
    admin: {
      ...overrideAdmin,
      components: {
        ...overrideAdmin?.components,
        Description: {
          path: '@/fields/SelectVariantPreview/SelectVariantPreview#SelectVariantPreview',
          clientProps: {
            previewMap,
            description: overrideAdmin?.description,
          },
        },
      },
    },
  } as Field
}
