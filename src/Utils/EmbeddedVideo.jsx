import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

// eslint-disable-next-line react/prop-types
const VideoEmbed = ({ embedCode }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset state for new embed
    setIsLoaded(false);
    setError(null);
    containerRef.current.innerHTML = '';

    if (!embedCode) {
      setError('No embed code provided');
      return;
    }

    try {
      // Sanitize the embed code while allowing common embed elements
      const sanitizedCode = DOMPurify.sanitize(embedCode, {
        ADD_TAGS: ['iframe', 'embed', 'object', 'script'],
        ADD_ATTR: ['allowfullscreen', 'frameborder', 'allow'],
        FORBID_TAGS: ['style'],
        FORBID_ATTR: ['onload', 'onerror']
      });

      // Create temporary container
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedCode;

      // Handle all potential embed types
      const embedTypes = ['iframe', 'embed', 'object', 'div', 'video'];
      let embedElement = null;

      for (const tag of embedTypes) {
        embedElement = tempDiv.querySelector(tag);
        if (embedElement) break;
      }

      if (embedElement) {
        const clonedElement = embedElement.cloneNode(true);
        
        // Standardize attributes for responsive behavior
        clonedElement.style.width = '100%';
        clonedElement.style.height = '100%';
        clonedElement.style.border = 'none';
        clonedElement.style.display = 'block';

        // Special handling for iframes
        if (clonedElement.tagName.toLowerCase() === 'iframe') {
          clonedElement.onload = () => setIsLoaded(true);
          clonedElement.onerror = () => {
            setError('Failed to load embedded content');
            setIsLoaded(true); // Show the error
          };
        }

        containerRef.current.appendChild(clonedElement);

        // For non-iframes, set loaded state after a short delay
        if (clonedElement.tagName.toLowerCase() !== 'iframe') {
          setTimeout(() => setIsLoaded(true), 1500);
        }
      } else {
        // For unrecognized embed codes, attempt to render the sanitized HTML
        containerRef.current.innerHTML = sanitizedCode;
        setTimeout(() => setIsLoaded(true), 1500);
      }

      // Handle scripts safely
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src && !script.src.startsWith('https://')) {
          console.warn('Blocked potentially unsafe script:', script.src);
          return;
        }

        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.text = script.innerHTML;
        }
        document.body.appendChild(newScript);
      });

    } catch (err) {
      console.error('Embed rendering error:', err);
      setError('Error loading embedded content');
      setIsLoaded(true); // Show the error state
    }
  }, [embedCode]);

  return (
    <div className="relative w-full lg:w-3/4 aspect-video bg-black mt-6 rounded-lg overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white z-10">
          <p>Loading content...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white z-10 p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <div 
        ref={containerRef}
        className={`w-full h-full ${(isLoaded && !error) ? 'block' : 'invisible'}`}
      />
    </div>
  );
};

export default VideoEmbed;