import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useDashboardStore } from '../store/dashboardStore';

interface Aircraft {
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
}

interface Satellite {
  noradId: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const aircraftGroupRef = useRef<THREE.Group | null>(null);
  const satelliteGroupRef = useRef<THREE.Group | null>(null);
  
  const { aircraft, satellites, selectedModule } = useDashboardStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 12;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      emissive: 0x0f0f1a,
      emissiveIntensity: 0.2,
      shininess: 25,
      specular: new THREE.Color(0x333333),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(10.3, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(10.05, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Grid lines
    const gridHelper = new THREE.PolarGridHelper(15, 16, 8, 64, 0x00d4ff, 0x00d4ff);
    gridHelper.position.y = -5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.1;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 0.5, 50);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Aircraft group
    const aircraftGroup = new THREE.Group();
    scene.add(aircraftGroup);
    aircraftGroupRef.current = aircraftGroup;

    // Satellite group
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    satelliteGroupRef.current = satelliteGroup;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate earth slowly
      earth.rotation.y += 0.0005;
      wireframe.rotation.y += 0.0005;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    setIsInitialized(true);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isInitialized]);

  // Update aircraft markers
  useEffect(() => {
    if (!aircraftGroupRef.current || !isInitialized) return;

    // Clear existing aircraft
    while (aircraftGroupRef.current.children.length > 0) {
      aircraftGroupRef.current.remove(aircraftGroupRef.current.children[0]);
    }

    // Add aircraft markers
    aircraft.forEach((ac: Aircraft) => {
      const phi = (90 - ac.latitude) * (Math.PI / 180);
      const theta = (ac.longitude + 180) * (Math.PI / 180);
      
      const x = -(10.2 * Math.sin(phi) * Math.cos(theta));
      const z = 10.2 * Math.sin(phi) * Math.sin(theta);
      const y = 10.2 * Math.cos(phi);

      const geometry = new THREE.ConeGeometry(0.08, 0.25, 4);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(x, y, z);
      marker.lookAt(0, 0, 0);
      marker.rotateX(Math.PI / 2);
      marker.rotateZ((ac.heading * Math.PI) / 180);
      
      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(x, y, z);
      
      aircraftGroupRef.current?.add(marker);
      aircraftGroupRef.current?.add(glow);
    });
  }, [aircraft, isInitialized]);

  // Update satellite markers
  useEffect(() => {
    if (!satelliteGroupRef.current || !isInitialized) return;

    // Clear existing satellites
    while (satelliteGroupRef.current.children.length > 0) {
      satelliteGroupRef.current.remove(satelliteGroupRef.current.children[0]);
    }

    // Add satellite markers
    satellites.forEach((sat: Satellite) => {
      const altitudeScale = 1 + (sat.altitude / 6371) * 2;
      const phi = (90 - sat.latitude) * (Math.PI / 180);
      const theta = (sat.longitude + 180) * (Math.PI / 180);
      
      const x = -(10 * altitudeScale * Math.sin(phi) * Math.cos(theta));
      const z = 10 * altitudeScale * Math.sin(phi) * Math.sin(theta);
      const y = 10 * altitudeScale * Math.cos(phi);

      const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(x, y, z);
      
      // Orbit trail
      const trailGeometry = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(50 * 3);
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const tx = -(10 * altitudeScale * Math.sin(phi + angle * 0.1) * Math.cos(theta));
        const tz = 10 * altitudeScale * Math.sin(phi + angle * 0.1) * Math.sin(theta);
        const ty = 10 * altitudeScale * Math.cos(phi + angle * 0.1);
        trailPositions[i * 3] = tx;
        trailPositions[i * 3 + 1] = ty;
        trailPositions[i * 3 + 2] = tz;
      }
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.2,
      });
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      
      satelliteGroupRef.current?.add(marker);
      satelliteGroupRef.current?.add(trail);
    });
  }, [satellites, isInitialized]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)' }}
    >
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-cyan-400 font-mono animate-pulse">
            INITIALIZING 3D GLOBE...
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded px-3 py-2">
          <div className="text-xs text-cyan-400 font-mono">
            <div>MODULE: {selectedModule.toUpperCase()}</div>
            <div>AIRCRAFT: {aircraft.length}</div>
            <div>SATELLITES: {satellites.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
