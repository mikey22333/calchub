import React from 'react';

const AdBanner = () => {
  React.useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4156428456711019';
      script.crossOrigin = 'anonymous';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-banner" style={{ width: '100%', textAlign: 'center', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4156428456711019"
        data-ad-slot="YOUR_AD_SLOT" // Replace with your actual ad slot
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );
};

export default AdBanner;
