
import { useState, useEffect } from 'react';

export const useChromeViewport = () => {
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    // Check if it's Chrome on mobile
    const isChrome = /Chrome/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);
    
    if (!isChrome || !window.visualViewport) {
      return;
    }

    const updateOffset = () => {
      const offset = window.innerHeight - window.visualViewport.height;
      setBottomOffset(offset);
    };

    // Set initial offset
    updateOffset();

    // Listen for viewport changes
    window.visualViewport.addEventListener('resize', updateOffset);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', updateOffset);
    };
  }, []);

  return bottomOffset;
};
