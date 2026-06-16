import Link from 'next/link'
import { Check } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { AppLocale } from '@/lib/site'
import { NewsletterForm } from '@/components/blog/NewsletterForm'

/** Dark CRO offer card (sticky sidebar) — stays dark per design intent. */
export async function CroCard({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: 'blog' })
  return (
    <div className="cro-card">
      <span className="bonus">{t('croBonus')}</span>
      <div className="pname">{t('croName')}</div>
      <div className="psub">{t('croSub')}</div>
      <div className="price">
        $299<small>{t('croPerMonth')}</small>
      </div>
      <ul>
        <li>
          <Check className="ck" />
          <span>{t('croFeatureBot')}</span>
        </li>
        <li>
          <Check className="ck" />
          <span>{t('croFeatureQualify')}</span>
        </li>
        <li>
          <Check className="ck" />
          <span>{t('croFeatureBooking')}</span>
        </li>
        <li className="hot">
          <Check className="ck" />
          <span>{t('croFeatureSetup')}</span>
        </li>
      </ul>
      <Link href={`/${locale}/strategy-call`} className="btn btn-primary btn-block btn-pill">
        {t('croClaim')}
      </Link>
      <p className="fine">{t('croFine')}</p>
    </div>
  )
}

/** Newsletter capture — submits to the seeded "Newsletter" form via REST. */
export async function NewsletterMini({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: 'blog' })
  return (
    <div className="news-mini">
      <h4>{t('newsTitle')}</h4>
      <p>{t('newsBody')}</p>
      <NewsletterForm
        placeholder={t('newsPlaceholder')}
        submitLabel={t('newsSubscribe')}
        successLabel={t('newsSuccess')}
        errorLabel={t('newsError')}
      />
    </div>
  )
}
