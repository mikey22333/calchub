import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | CalcHub - Free Online Calculators`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.setAttribute('name', 'description');
      newMetaDescription.setAttribute('content', description);
      document.head.appendChild(newMetaDescription);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.setAttribute('name', 'keywords');
      newMetaKeywords.setAttribute('content', keywords);
      document.head.appendChild(newMetaKeywords);
    }
    
    return () => {
      // Clean up is not necessary as we want to keep the last set values
    };
  }, [title, description, keywords]);
  
  return null; // This component doesn't render anything
};

export default SEO;
