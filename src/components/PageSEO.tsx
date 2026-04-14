import { Helmet } from "react-helmet-async";

const SITE_NAME = "Vardhman Shiksha Mandir";
const DEFAULT_OG_IMAGE = "https://eostacftlilurncaboyu.supabase.co/storage/v1/object/public/hero-images/hero/hero-main.jpeg";
const BASE_URL = "https://vardhmanshikshamandir.in";

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}

const PageSEO = ({ title, description, path = "/", ogImage = DEFAULT_OG_IMAGE }: PageSEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default PageSEO;
