import React, { useEffect } from 'react';

/**
 * Component to preload external resources to prevent blocking
 */
const ResourcePreloader = () => {
  useEffect(() => {
    // Function to preload a stylesheet
    const preloadStylesheet = (href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
      
      // Then load it
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = href;
      document.head.appendChild(styleLink);
    };
    
    // Function to preload a script
    const preloadScript = (src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
      
      // Then load it
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };
    
    // Preload external resources
    preloadStylesheet('https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css');
    preloadStylesheet('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
    preloadScript('https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js');
    
    // Preload font files
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.woff2?t=1590207869815';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
    
    return () => {
      // Cleanup is not necessary for preloaded resources
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ResourcePreloader;