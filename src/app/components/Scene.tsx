"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  useGLTF,
  Loader,
  Environment,
  MeshReflectorMaterial,
  useTexture,
  Text3D,
  Html,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Glitch, ChromaticAberration, Bloom } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';

const MODEL_PATH = "/models/riff_hills.glb";
const FANTASY_HOUSE_PATH = "/models/fantasy_house.glb";
const PINE_TREE_PATH = "/models/pine_tree.glb";
const STYLIZED_TREE_PATH = "/models/stylized_tree.glb";
const HDRI_PATH = "/hdri/forest_sunrise.exr";

useGLTF.preload(MODEL_PATH);
useGLTF.preload(FANTASY_HOUSE_PATH);
useGLTF.preload(PINE_TREE_PATH);
useGLTF.preload(STYLIZED_TREE_PATH);

function CircularCameraRotation({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const angleRef = useRef<number | null>(null);
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  useEffect(() => {
    if (!enabled) {
      angleRef.current = null;
      return;
    }

    const speed = 0.005; // Rotation speed
    const radius = 3500;
    const centerX = 0;
    const centerZ = -3000;
    const centerY = planeY + 350; // Match PORTFOLIO height

    // Calculate initial angle from camera's CURRENT position to avoid jump
    if (angleRef.current === null) {
      const dx = camera.position.x - centerX;
      const dz = camera.position.z - centerZ;
      angleRef.current = Math.atan2(dx, dz);
    }

    const animate = () => {
      if (angleRef.current === null) return;

      angleRef.current += speed;

      const x = centerX + Math.sin(angleRef.current) * radius;
      const z = centerZ + Math.cos(angleRef.current) * radius;

      camera.position.x = x;
      camera.position.z = z;
      camera.position.y = centerY;

      // Always face the exact center point where text is
      camera.lookAt(centerX, centerY, centerZ);

      // Keep camera level (no tilting)
      camera.up.set(0, 1, 0);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [camera, enabled, planeY]);

  return null;
}



function MirroredBoundary() {
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  const [diffuseMap, roughnessMap] = useTexture([
    '/textures/aerial_rocks_04_diff_4k.jpg',
    '/textures/aerial_rocks_04_rough_4k.jpg',
  ]);

  useMemo(() => {
    [diffuseMap, roughnessMap].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(50, 50);
    });
  }, [diffuseMap, roughnessMap]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, planeY, 0]} receiveShadow>
      <planeGeometry args={[100000, 100000]} />
      <meshStandardMaterial
        map={diffuseMap}
        roughnessMap={roughnessMap}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FantasyHouses() {
  const terrainGltf = useGLTF(MODEL_PATH);
  const houseGltf = useGLTF(FANTASY_HOUSE_PATH);

  const box = useMemo(() => new THREE.Box3().setFromObject(terrainGltf.scene), [terrainGltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  // Define positions for houses evenly spaced in 360 degrees around horizon
  const housePositions = useMemo(() => {
    const radius = 20000; // Distance from center (horizon)
    const centerX = 0;
    const centerZ = -3000; // Same z as the text
    const numHouses = 6;

    return Array.from({ length: numHouses }, (_, i) => {
      const angle = (i / numHouses) * Math.PI * 2; // Evenly space 360 degrees
      return {
        x: centerX + Math.cos(angle) * radius,
        z: centerZ + Math.sin(angle) * radius,
        rotation: angle + Math.PI, // Face inward toward center
        scale: 3,
      };
    });
  }, []);

  return (
    <>
      {housePositions.map((pos, i) => (
        <group key={`house-${i}`} position={[pos.x, planeY, pos.z]} rotation={[0, pos.rotation, 0]} scale={pos.scale}>
          <primitive object={houseGltf.scene.clone()} />
        </group>
      ))}
    </>
  );
}

function Trees() {
  const terrainGltf = useGLTF(MODEL_PATH);
  const pineTreeGltf = useGLTF(PINE_TREE_PATH);
  const stylizedTreeGltf = useGLTF(STYLIZED_TREE_PATH);

  const box = useMemo(() => new THREE.Box3().setFromObject(terrainGltf.scene), [terrainGltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  // Log to confirm trees are loaded
  useEffect(() => {
    console.log('=== TREE DEBUG INFO ===');
    console.log('Pine tree loaded:', pineTreeGltf);
    console.log('Stylized tree loaded:', stylizedTreeGltf);
    console.log('Plane Y position:', planeY);
    console.log('Pine tree scene children:', pineTreeGltf.scene.children);
    console.log('Stylized tree scene children:', stylizedTreeGltf.scene.children);
  }, [pineTreeGltf, stylizedTreeGltf, planeY]);

  // Define positions for pine trees randomly placed beyond houses
  const treePositions = useMemo(() => {
    const centerX = 0;
    const centerZ = -3000;
    const houseRadius = 20000;

    const minTreeSpacing = 20000; // Minimum spacing between trees
    const trees: Array<{ x: number; z: number; rotation: number; scale: number; type: string }> = [];

    // House angles - 6 houses evenly spaced at 60 degree intervals
    const houseAngles = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

    // Calculate "gap center" angles between each pair of houses
    const gapCenterAngles = Array.from({ length: 6 }, (_, i) => {
      return houseAngles[i] + (Math.PI / 3) / 2; // Halfway between houses (60°/2 = 30°)
    });

    const isInGapBetweenHouses = (angle: number) => {
      // Check if angle is in one of the 6 gaps between houses
      return gapCenterAngles.some(gapCenter => {
        let diff = Math.abs(angle - gapCenter);
        // Handle wrap around at 0/2π
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        // Allow ~25 degree spread around gap center
        return diff < 0.45;
      });
    };

    const isTooCloseToOtherTrees = (x: number, z: number) => {
      return trees.some(tree => {
        const dx = tree.x - x;
        const dz = tree.z - z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        return distance < minTreeSpacing;
      });
    };

    // Generate tree positions with better distribution
    let totalAttempts = 0;
    const maxTotalAttempts = 10000;

    // Place 75 trees in the gaps between houses, spreading outward
    for (let i = 0; i < 75 && totalAttempts < maxTotalAttempts; i++) {
      let angle, radius, x, z;
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!validPosition && attempts < maxAttempts && totalAttempts < maxTotalAttempts) {
        attempts++;
        totalAttempts++;

        // Random angle - but must be in a gap between houses
        angle = Math.random() * Math.PI * 2;

        if (isInGapBetweenHouses(angle)) {
          // Trees spread from just beyond houses to very far distance
          // More trees closer, fewer far away for natural distribution
          const distanceRoll = Math.pow(Math.random(), 0.7); // Bias toward closer
          radius = 25000 + distanceRoll * 375000; // Range: 25k to 400k

          // Add some lateral variance so trees aren't perfectly radial
          const lateralOffset = (Math.random() - 0.5) * radius * 0.2; // ±10% lateral spread

          x = centerX + Math.cos(angle) * radius + Math.sin(angle) * lateralOffset;
          z = centerZ + Math.sin(angle) * radius - Math.cos(angle) * lateralOffset;

          if (!isTooCloseToOtherTrees(x, z)) {
            validPosition = true;
          }
        }
      }

      if (validPosition) {
        // Scale trees based on distance - closer trees smaller, far trees larger
        const distance = Math.sqrt((x! - centerX) ** 2 + (z! - centerZ) ** 2);
        const scaleMultiplier = Math.max(1, distance / 50000); // Scale increases with distance
        const baseScale = 3000 + Math.random() * 2000; // 3k-5k base

        trees.push({
          x: x!,
          z: z!,
          rotation: Math.random() * Math.PI * 2,
          scale: baseScale * scaleMultiplier,
          type: 'pine',
        });
      }
    }

    console.log('Total trees:', trees.length);
    console.log('Gap center angles:', gapCenterAngles.map(a => (a * 180 / Math.PI).toFixed(0) + '°'));

    return trees;
  }, []);

  return (
    <>
      {treePositions.map((pos, i) => (
        <group key={`tree-${i}`} position={[pos.x, planeY, pos.z]} rotation={[0, pos.rotation, 0]} scale={pos.scale}>
          <primitive object={pos.type === 'pine' ? pineTreeGltf.scene.clone() : stylizedTreeGltf.scene.clone()} />
        </group>
      ))}
    </>
  );
}

function RainbowParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const count = 50000;

  const { positions: initialPositions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in a large area
      positions[i * 3] = (Math.random() - 0.5) * 8000; // x
      positions[i * 3 + 1] = Math.random() * 1000 + 100; // y (above plane)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10000; // z

      // Rainbow colors
      const hue = Math.random();
      const color = new THREE.Color();
      color.setHSL(hue, 1.0, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Varying sizes
      sizes[i] = Math.random() * 15 + 5;
    }

    return { positions, colors, sizes };
  }, []);

  useEffect(() => {
    if (particlesRef.current) {
      const geometry = particlesRef.current.geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }
  }, [initialPositions, colors, sizes]);

  // Enhanced particle animation with reality bending
  useEffect(() => {
    const animate = () => {
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const colorArray = particlesRef.current.geometry.attributes.color.array as Float32Array;
        const time = Date.now() * 0.001;

        for (let i = 0; i < count; i++) {
          // Floating motion with occasional upward gravity
          const gravityFlip = Math.sin(time * 0.1 + i * 0.001) > 0.9 ? -1 : 1;
          positions[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.5 * gravityFlip;

          // Spiral drift
          positions[i * 3] += Math.sin(time * 0.3 + i) * 0.15;
          positions[i * 3 + 2] += Math.cos(time * 0.3 + i) * 0.15;

          // Color shifting over time
          const hue = (time * 0.1 + i * 0.001) % 1;
          const color = new THREE.Color();
          color.setHSL(hue, 1.0, 0.6);
          colorArray[i * 3] = color.r;
          colorArray[i * 3 + 1] = color.g;
          colorArray[i * 3 + 2] = color.b;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, [camera]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={10}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={useMemo(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d')!;
          const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 32, 32);
          const texture = new THREE.CanvasTexture(canvas);
          return texture;
        }, [])}
      />
    </points>
  );
}

function EnterText({ onClick, opacity }: { onClick: () => void; opacity: number }) {
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  return (
    <Center position={[0, planeY + 200, -3000]} rotation={[0, Math.PI, 0]}>
      <Text3D
        font="/fonts/gentilis_bold.typeface.json"
        size={400}
        height={80}
        castShadow
        onClick={onClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
        }}
      >
        ENTER
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          emissive="#ffffff"
          emissiveIntensity={2.4}
        />
      </Text3D>
    </Center>
  );
}

function ManualCameraRotation({ enabled, centerZ }: { enabled: boolean; centerZ: number }) {
  const { camera } = useThree();
  const angleRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  useEffect(() => {
    if (!enabled) {
      angleRef.current = null;
      return;
    }

    const radius = 3000; // Distance from camera to text
    const centerX = 0;
    const centerY = planeY + 200;
    const maxSpeed = 0.03;
    const acceleration = 0.002;
    const deceleration = 0.001;

    // Initialize angle from current camera position to avoid jump
    if (angleRef.current === null) {
      const dx = camera.position.x - centerX;
      const dz = camera.position.z - centerZ;
      angleRef.current = Math.atan2(dx, dz);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    const animate = () => {
      if (angleRef.current === null) return;

      let targetVelocity = 0;

      if (keysPressed.current.has('ArrowLeft')) {
        targetVelocity = -maxSpeed;
      } else if (keysPressed.current.has('ArrowRight')) {
        targetVelocity = maxSpeed;
      }

      // Smooth acceleration/deceleration with easing
      if (targetVelocity !== 0) {
        // Accelerate toward target
        velocityRef.current += (targetVelocity - velocityRef.current) * acceleration * 10;
      } else {
        // Decelerate smoothly
        velocityRef.current *= (1 - deceleration * 10);
        if (Math.abs(velocityRef.current) < 0.0001) {
          velocityRef.current = 0;
        }
      }

      angleRef.current += velocityRef.current;

      const x = centerX + Math.sin(angleRef.current) * radius;
      const z = centerZ + Math.cos(angleRef.current) * radius;

      camera.position.x = x;
      camera.position.z = z;
      camera.position.y = 200;

      camera.lookAt(centerX, centerY, centerZ);
      camera.up.set(0, 1, 0);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
      keysPressed.current.clear();
    };
  }, [camera, enabled, centerZ, planeY]);

  return null;
}

function PortfolioText({ onClick, opacity }: { onClick: () => void; opacity: number }) {
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  return (
    <Center position={[0, planeY + 200, -1000]} rotation={[0, Math.PI, 0]}>
      <Text3D
        font="/fonts/gentilis_bold.typeface.json"
        size={400}
        height={80}
        castShadow
        onClick={onClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
        }}
      >
        PORTFOLIO
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          emissive="#ffffff"
          emissiveIntensity={2.4}
        />
      </Text3D>
    </Center>
  );
}

function ExpandingSpheres({ onWorkClick, onAboutClick, onContactClick }: {
  onWorkClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}) {
  const gltf = useGLTF(MODEL_PATH);
  const box = useMemo(() => new THREE.Box3().setFromObject(gltf.scene), [gltf.scene]);
  const planeY = box.min.y + (box.max.y - box.min.y) * 0.15;

  // Approximate character widths at size 240
  // WORK = 4 chars ≈ 600 units wide
  // ABOUT = 5 chars ≈ 750 units wide
  // CONTACT = 7 chars ≈ 1050 units wide
  const gap = 800; // Equal gap between words - wider spacing

  const workWidth = 600;
  const aboutWidth = 750;
  const contactWidth = 1050;

  // Calculate positions to have equal gaps
  // WORK will be on left, ABOUT in middle, CONTACT on right
  const totalWidth = workWidth + gap + aboutWidth + gap + contactWidth;
  const startX = -totalWidth / 2;

  const workX = startX + workWidth / 2;
  const aboutX = startX + workWidth + gap + aboutWidth / 2;
  const contactX = startX + workWidth + gap + aboutWidth + gap + contactWidth / 2;

  return (
    <group position={[0, planeY + 300, -1000]} rotation={[0, Math.PI, 0]}>
      {/* WORK Text - Left */}
      <group position={[workX, 0, 0]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="/fonts/gentilis_bold.typeface.json"
            size={240}
            height={40}
            onClick={onWorkClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            WORK
            <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={2.4} />
          </Text3D>
        </Center>
      </group>

      {/* ABOUT Text - Center */}
      <group position={[aboutX, 0, 0]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="/fonts/gentilis_bold.typeface.json"
            size={240}
            height={40}
            onClick={onAboutClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            ABOUT
            <meshStandardMaterial color="#4ecdc4" emissive="#4ecdc4" emissiveIntensity={2.4} />
          </Text3D>
        </Center>
      </group>

      {/* CONTACT Text - Right */}
      <group position={[contactX, 0, 0]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="/fonts/gentilis_bold.typeface.json"
            size={240}
            height={40}
            onClick={onContactClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            CONTACT
            <meshStandardMaterial color="#ffe66d" emissive="#ffe66d" emissiveIntensity={2.4} />
          </Text3D>
        </Center>
      </group>
    </group>
  );
}



function CameraAnimation({ targetZ, onComplete, maintainDirection }: { targetZ: number; onComplete: () => void; maintainDirection?: boolean }) {
  const { camera } = useThree();
  const startZ = useRef(camera.position.z);
  const startX = useRef(camera.position.x);
  const startY = useRef(camera.position.y);
  const startRotation = useRef(new THREE.Quaternion().copy(camera.quaternion));
  const startTime = useRef(Date.now());
  const duration = 1500; // 1.5 seconds

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (maintainDirection) {
        // Move forward in the direction camera is facing
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(startRotation.current);
        const distance = 2500; // Distance to move forward

        camera.position.x = startX.current + direction.x * distance * easeProgress;
        camera.position.z = startZ.current + direction.z * distance * easeProgress;
      } else {
        // Only move Z position, keep X and Y constant, maintain camera view
        camera.position.x = startX.current;
        camera.position.y = startY.current;
        camera.position.z = startZ.current + (targetZ - startZ.current) * easeProgress;
        // Don't change camera rotation - it stays looking forward
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();
  }, [camera, targetZ, onComplete, maintainDirection]);

  return null;
}

export default function Scene() {
  const [showEnter, setShowEnter] = useState(true);
  const [enterOpacity, setEnterOpacity] = useState(1);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioOpacity, setPortfolioOpacity] = useState(1);
  const [showSpheres, setShowSpheres] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTarget, setAnimationTarget] = useState(-3000);
  const [activePage, setActivePage] = useState<'work' | 'about' | 'contact' | null>(null);
  const [startRotation, setStartRotation] = useState(false);
  const [maintainDirection, setMaintainDirection] = useState(false);
  const [enableControls, setEnableControls] = useState(false);

  const handleEnterClick = () => {
    // Fade out ENTER and show PORTFOLIO immediately
    const fadeOut = setInterval(() => {
      setEnterOpacity((prev) => {
        const newOpacity = prev - 0.05;
        if (newOpacity <= 0) {
          clearInterval(fadeOut);
          setShowEnter(false);
          return 0;
        }
        return newOpacity;
      });
    }, 30);

    // Start animation and show PORTFOLIO immediately
    setIsAnimating(true);
    setAnimationTarget(-4000); // New camera target position
    setShowPortfolio(true);

    // Fade in PORTFOLIO during the animation
    setPortfolioOpacity(0);
    const fadeIn = setInterval(() => {
      setPortfolioOpacity((prev) => {
        const newOpacity = prev + 0.05;
        if (newOpacity >= 1) {
          clearInterval(fadeIn);
          return 1;
        }
        return newOpacity;
      });
    }, 30);
  };

  const handlePortfolioClick = () => {
    // Keep rotation going, just swap PORTFOLIO for spheres
    const fadeOut = setInterval(() => {
      setPortfolioOpacity((prev) => {
        const newOpacity = prev - 0.05;
        if (newOpacity <= 0) {
          clearInterval(fadeOut);
          setShowPortfolio(false);
          setShowSpheres(true);
          return 0;
        }
        return newOpacity;
      });
    }, 30);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setMaintainDirection(false);
    if (animationTarget === -4000) {
      // Enable manual rotation with arrow keys
      setStartRotation(true);
    }
  };

  return (
    <>
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 50, position: [0, 200, -6000], near: 1, far: 500000 }}>
        <Suspense fallback={null}>
          <Environment files={HDRI_PATH} background backgroundIntensity={0.15} environmentIntensity={0.3} />

          <MirroredBoundary />
          <FantasyHouses />
          <Trees />
          <RainbowParticles />
          {showEnter && <EnterText onClick={handleEnterClick} opacity={enterOpacity} />}
          {showPortfolio && <PortfolioText onClick={handlePortfolioClick} opacity={portfolioOpacity} />}
          {showSpheres && (
            <ExpandingSpheres
              onWorkClick={() => setActivePage('work')}
              onAboutClick={() => setActivePage('about')}
              onContactClick={() => setActivePage('contact')}
            />
          )}
          {isAnimating && (
            <CameraAnimation
              targetZ={animationTarget}
              onComplete={handleAnimationComplete}
              maintainDirection={maintainDirection}
            />
          )}
          <ManualCameraRotation
            enabled={startRotation && (showPortfolio || showSpheres)}
            centerZ={-1000}
          />
        </Suspense>

        <ambientLight intensity={0.3} />

        {/* Main sun light */}
        <directionalLight
          position={[100, 200, 100]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={3500}
          shadow-camera-left={-1000}
          shadow-camera-right={1000}
          shadow-camera-top={1000}
          shadow-camera-bottom={-1000}
        />

        {/* Rim light for depth */}
        <directionalLight
          position={[-50, 50, -100]}
          intensity={0.8}
          color="#ffeedd"
        />

        <hemisphereLight args={[0xffffee, 0x443322, 0.8]} />

        <OrbitControls
          enabled={false}
          enableDamping
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          target={[0, 350, -3000]}
          makeDefault
        />

        {/* Surreal Post-Processing Effects */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
          <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
          <Glitch
            delay={new THREE.Vector2(5, 10)}
            duration={new THREE.Vector2(0.1, 0.3)}
            strength={new THREE.Vector2(0.1, 0.3)}
            mode={GlitchMode.SPORADIC}
          />
        </EffectComposer>
      </Canvas>

      <Loader />

      {/* Dynamic instruction prompt */}
      {!activePage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1rem',
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: 500,
        }}>
          {showEnter && 'Click ENTER'}
          {showPortfolio && 'Click PORTFOLIO • Use ← → arrow keys to rotate'}
          {showSpheres && 'Click WORK, ABOUT, or CONTACT • Use ← → arrow keys to rotate'}
        </div>
      )}

      {/* Glass-morphism section overlays */}
      {activePage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `2px solid ${activePage === 'work' ? '#ff6b9d' : activePage === 'about' ? '#4ecdc4' : '#ffe66d'}`,
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37),
                          0 0 60px ${activePage === 'work' ? 'rgba(255, 107, 157, 0.3)' : activePage === 'about' ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 230, 109, 0.3)'}`,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setActivePage(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>

            <h1 style={{
              fontSize: '4rem',
              marginBottom: '2rem',
              color: activePage === 'work' ? '#ff6b9d' : activePage === 'about' ? '#4ecdc4' : '#ffe66d',
              textTransform: 'uppercase',
              fontFamily: 'Gentilis, monospace',
              fontWeight: 'bold',
              textShadow: `0 0 30px ${activePage === 'work' ? '#ff6b9d' : activePage === 'about' ? '#4ecdc4' : '#ffe66d'},
                           0 0 60px ${activePage === 'work' ? '#ff6b9d' : activePage === 'about' ? '#4ecdc4' : '#ffe66d'}`,
              letterSpacing: '0.1em',
            }}>
              {activePage}
            </h1>

            <div style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'Gentilis, monospace',
              lineHeight: '1.8',
            }}>
              {activePage === 'work' && (
                <div>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Add your work content here...
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Showcase your projects, portfolio pieces, and professional accomplishments.
                  </p>
                </div>
              )}
              {activePage === 'about' && (
                <div>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Add your about content here...
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Tell your story, share your background, and let people know who you are.
                  </p>
                </div>
              )}
              {activePage === 'contact' && (
                <div>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Add your contact content here...
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Share ways people can reach you - email, social media, or other platforms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
