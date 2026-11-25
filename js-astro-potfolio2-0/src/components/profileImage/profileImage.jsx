import { useEffect, useRef, useState } from 'react';
import { createParticleCanvas } from 'package-particlefx';


function ProfileImage() {
  const containerRef = useRef(null);

  const getResponsiveSize = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return { width: 180, height: 180 };
    } else if (width < 768) {
      return { width: 250, height: 250 };
    } else if (width < 1024) {
      return { width: 300, height: 300 };
    } else {
      return { width: 400, height: 400 };
    }
  };

  const [config, setConfig] = useState({
    imageSrc: '/pfp.jpeg',
    particleGap: 3,
    mouseForce: 100,
    gravity: 0.1,
    noise: 8,
  });

  // Update canvas size on load and resize
  useEffect(() => {
    const updateSize = () => {
      const { width, height } = getResponsiveSize();
      setConfig((prev) => ({ ...prev, width, height }));
    };

    updateSize(); // Initial call
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Render canvas when config updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear old canvas if any
      createParticleCanvas(containerRef.current, config);
    }
  }, [config]);

  return (
    <div>
      <div
        ref={containerRef}
        className="bg-black mx-auto w-[100px] sm:auto "
      />
    </div>
  );
}

export default ProfileImage;
