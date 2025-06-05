
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  routeKey: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  routeKey
}) => {
  console.log('🔍 SEO Component Render - Props:', {
    routeKey,
    title,
    description,
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    twitterTitle: twitterTitle || title,
    twitterDescription: twitterDescription || description
  });

  useEffect(() => {
    console.log('🚀 SEO Component useEffect triggered for route:', routeKey);
    
    // Force React Helmet to update
    setTimeout(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      console.log('🔍 DOM Meta Tags After Update:', {
        metaDescription: metaDescription?.getAttribute('content'),
        ogDescription: ogDescription?.getAttribute('content'),
        twitterDescription: twitterDescription?.getAttribute('content'),
        hasReactHelmetAttr: metaDescription?.hasAttribute('data-react-helmet')
      });
      
      if (!metaDescription) {
        console.error('❌ Meta description tag not found in DOM!');
      } else if (metaDescription.getAttribute('content') !== description) {
        console.error('❌ Meta description content mismatch!', {
          expected: description,
          actual: metaDescription.getAttribute('content')
        });
      } else {
        console.log('✅ Meta description is correctly set in DOM');
      }
    }, 100);
  }, [routeKey, description, title]);

  return (
    <Helmet key={`seo-${routeKey}`}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
    </Helmet>
  );
};

export default SEO;
