import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Scene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create floating spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.8,
    });

    const spheres: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 15
      );
      sphere.scale.setScalar(Math.random() * 0.5 + 0.5);
      sceneRef.current.add(sphere);
      spheres.push(sphere);

      // Animate each sphere
      gsap.to(sphere.position, {
        y: `+=${Math.random() * 2 - 1}`,
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    cameraRef.current.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        spheres.forEach((sphere) => {
          sphere.rotation.x += 0.005;
          sphere.rotation.y += 0.005;
        });
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default Scene3D;