import type { ReactNode } from 'react'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import './blog.css'

/** Editorial shell for all blog views. Reuses the ported Navbar + Footer. */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="apt-blog">
      <Navbar />
      {/* spacer for the fixed 64px navbar */}
      <div style={{ height: 64 }} aria-hidden />
      {children}
      <Footer />
    </div>
  )
}
