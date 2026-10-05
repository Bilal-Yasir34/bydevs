import './globals.css';
import '@/src/shaders/threeui.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteBackground } from '@/components/SiteBackground';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bydevs.com'),
  themeColor: '#0d2238',
  title: {
    default: 'BY Devs | Web, Cloud & Software Solutions',
    template: '%s | BY Devs',
  },
  description:
    'BY Devs builds custom web applications, cloud-based systems, enterprise software, e-commerce platforms, and practical AI solutions designed around how modern businesses operate.',
  keywords: [
    'BY Devs',
    'custom web applications',
    'cloud business systems',
    'software development company',
    'enterprise software',
    'business automation',
    'AI solutions',
    'web developers',
  ],
  authors: [{ name: 'BY Devs', url: 'https://bydevs.com' }],
  creator: 'BY Devs',
  publisher: 'BY Devs',
  alternates: {
    canonical: 'https://bydevs.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'BY Devs | Web, Cloud & Software Solutions',
    description: 'Custom digital systems built around your business.',
    url: 'https://bydevs.com',
    siteName: 'BY Devs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BY Devs | Web, Cloud & Software Solutions',
    description: 'Custom digital systems built around your business.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://bydevs.com/#organization',
      name: 'BY Devs',
      url: 'https://bydevs.com',
      email: 'hello.bydevs@gmail.com',
      sameAs: [
        'https://www.instagram.com/hello.bydevs/',
        'https://www.facebook.com/profile.php?id=61595093072452',
        'https://github.com/Bilal-Yasir34',
        'https://www.linkedin.com/in/bilal-yasir-3b58b5325/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello.bydevs@gmail.com',
        contactType: 'sales and technical support',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://bydevs.com/#service',
      name: 'BY Devs Software Engineering',
      url: 'https://bydevs.com',
      description:
        'Custom web applications, cloud systems, and intelligent digital solutions engineered around real business workflows.',
      areaServed: 'Worldwide',
      provider: {
        '@id': 'https://bydevs.com/#organization',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
