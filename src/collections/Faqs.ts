import type { CollectionConfig } from 'payload'

import { iconPickerField } from '@/fields/IconPicker/config'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
    group: 'Content',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Answer body. Feeds the FAQPage JSON-LD (SCHEMA-03) and the homepage FAQ.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (ascending).',
      },
    },
    // TEMPORARY: remove in Plan 03 Task 3
    iconPickerField({
      name: 'testIcon',
      label: 'Test Icon Picker (temporary — Phase 17 verification)',
    }),
  ],
}
