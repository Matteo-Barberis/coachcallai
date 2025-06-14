
import React from 'react';
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
