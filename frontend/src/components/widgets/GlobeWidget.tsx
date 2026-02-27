import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Globe } from 'lucide-react';

export function GlobeWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    globe: THREE.Mesh;
    points: THREE.Points;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Globe
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x1a1f2e,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Wireframe overlay
    const wireGeometry = new THREE.SphereGeometry(1.01, 24, 24);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireGlobe = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireGlobe);

    // Data points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 150;
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;

      const x = Math.cos(theta) * Math.sin(phi) * 1.05;
      const y = Math.sin(theta) * Math.sin(phi) * 1.05;
      const z = Math.cos(phi) * 1.05;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorType = Math.random();
      if (colorType > 0.7) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.2;
      } else if (colorType > 0.4) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.2;
      }
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    sceneRef.current = { scene, camera, renderer, globe, points };

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      wireGlobe.rotation.y += 0.002;
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">Global Intelligence Overview</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400">LIVE</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 rounded bg-[#0a0a0f]" />
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#1a1f2e] rounded p-1">
          <div className="text-[10px] text-gray-500">Tracking</div>
 <div className="text-sm font-mono text-cyan-400">8,432</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-1">
          <div className="text-[10px] text-gray-500">Alerts</div>
          <div className="text-sm font-mono text-red-400">23</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-1">
          <div className="text-[10px] text-gray-500">Sources</div>
          <div className="text-sm font-mono text-green-400">156</div>
        </div>
      </div>
    </div>
  );
}
