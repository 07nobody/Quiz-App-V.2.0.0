import React, { useEffect } from 'react';

/**
 * Component to preload external resources to prevent blocking
 */
const ResourcePreloader = () => {
  useEffect(() => {
    // Function to load a stylesheet directly
    const loadStylesheet = (href) => {
      // Check if stylesheet is already loaded
      if (document.querySelector(`link[href="${href}"]`)) return;
      
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = href;
      document.head.appendChild(styleLink);
    };
    
    // Function to load a script directly
    const loadScript = (src) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) return;
      
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };
    
    // Load Google Fonts with extended weights for better UI consistency
    loadStylesheet('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    // Load Remix icons
    loadStylesheet('https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css');
    
    // Load Lottie player
    loadScript('https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js');
    
    return () => {
      // Cleanup is not necessary for loaded resources
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ResourcePreloader;