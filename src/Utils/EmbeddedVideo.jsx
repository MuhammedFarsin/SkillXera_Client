import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line react/prop-types
const VideoEmbed = ({ embedCode }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (containerRef.current && embedCode) {
      containerRef.current.innerHTML = '';

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = embedCode;

      const embedDiv = tempDiv.querySelector('div');
      const script = tempDiv.querySelector('script');

      if (embedDiv) {
        containerRef.current.appendChild(embedDiv);
      }

      if (script) {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.text = script.innerHTML;
        newScript.onload = () => setIsLoaded(true); // not reliable for inline scripts
        document.body.appendChild(newScript);

        // Use fallback delay instead of onload
        setTimeout(() => setIsLoaded(true), 2000); // 2 seconds delay
      }
    }
  }, [embedCode]);

  return (
    <div className="relative w-80 lg:w-3/4 border-2 rounded border-yellow-400 mt-6">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
          <p>Loading video...</p>
        </div>
      )}
      <div ref={containerRef}></div>
    </div>
  );
};

export default VideoEmbed
