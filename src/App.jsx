import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers, Shield, 
  CpuIcon, Globe, TerminalSquare, Workflow, Flame, CheckCircle2,
  Layers3, Sparkles, Command, GitBranch, Eye, Maximize2, RefreshCw, 
  Compass, BoxSelect, Cpu as CpuSymbol, Play, Pause, ChevronRight,
  Radio, CpuShare, Terminal as TerminalIcon, Cpu as Microchip, Hexagon, Network, Menu, X
} from 'lucide-react';

/* ==========================================================================
   ADVANCED 60FPS WEBGL & THREE.JS SPATIAL ENGINE (SAFARI & MOBILE OPTIMIZED)
   ================================================================---------- */
const WebGLEngine = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.007);
    
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 40;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true, 
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x222222, 3.0);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xdc2626, 12, 250);
    pointLight1.position.set(30, 30, 40);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 10, 250);
    pointLight2.position.set(-30, -30, 30);
    scene.add(pointLight2);

    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(8.5, 2);
    
    const coreMat = new THREE.MeshStandardMaterial({ 
      color: 0x050505, 
      roughness: 0.1, 
      metalness: 0.99,
      side: THREE.DoubleSide
    });
    const coreMeshSolid = new THREE.Mesh(coreGeo, coreMat);
    
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: true, transparent: true, opacity: 0.95 });
    const coreMeshWire = new THREE.Mesh(coreGeo, wireMat);

    const innerGeo = new THREE.IcosahedronGeometry(5, 1);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.8 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);

    const ringGeo1 = new THREE.TorusGeometry(13, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;

    const ringGeo2 = new THREE.TorusGeometry(16, 0.035, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat1);
    ring2.rotation.y = Math.PI / 4;

    const hitBoxGeo = new THREE.SphereGeometry(12, 16, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const coreHitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);

    coreGroup.add(coreMeshSolid);
    coreGroup.add(coreMeshWire);
    coreGroup.add(innerMesh);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(coreHitBox);
    scene.add(coreGroup);

    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(1.0, 0);
    const shardMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.15, metalness: 0.9, side: THREE.DoubleSide });
    const shards = [];
    
    const shardLimit = window.innerWidth < 768 ? 25 : 60;
    for(let i = 0; i < shardLimit; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 80);
      shard.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.08,
        rotSpeedY: (Math.random() - 0.5) * 0.08,
        originX: shard.position.x,
        originY: shard.position.y,
        originZ: shard.position.z,
        phase: Math.random() * Math.PI * 2
      };
      shards.push(shard);
      shardsGroup.add(shard);
    }
    scene.add(shardsGroup);

    const particleCount = window.innerWidth < 768 ? 1200 : 3500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleOriginalPos = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i += 3) {
      const r = 15 + Math.random() * 70;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      particlePos[i] = x; particlePos[i+1] = y; particlePos[i+2] = z;
      particleOriginalPos[i] = x; particleOriginalPos[i+1] = y; particleOriginalPos[i+2] = z;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.9 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouse = new THREE.Vector3(0,0,0);
    const planeGeo = new THREE.PlaneGeometry(1000, 1000);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const interactionPlane = new THREE.Mesh(planeGeo, planeMat);
    scene.add(interactionPlane);

    let isCoreHovered = false;
    
    const handleMove = (clientX, clientY) => {
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const planeIntersects = raycaster.intersectObject(interactionPlane);
      if (planeIntersects.length > 0) targetMouse.copy(planeIntersects[0].point);
      const coreIntersects = raycaster.intersectObject(coreHitBox);
      isCoreHovered = coreIntersects.length > 0;
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let targetScroll = 0;
    let currentScroll = 0;
    const onScroll = () => { targetScroll = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId;
    const clock = new THREE.Clock();
    const coreTargetScale = new THREE.Vector3(1, 1, 1);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      currentScroll += (targetScroll - currentScroll) * 0.05; // Ultra-smooth space-travel damping
      
      const targetCoreScale = isCoreHovered ? 1.5 : 1.0;
      const pulse = Math.sin(time * 5) * 0.09;
      coreTargetScale.setScalar(targetCoreScale + pulse);
      coreGroup.scale.lerp(coreTargetScale, 0.12);
      
      coreGroup.rotation.y = time * 0.3 + (currentScroll * 0.0015);
      coreGroup.rotation.x = Math.sin(time * 0.2) * 0.2 + (currentScroll * 0.001);
      innerMesh.rotation.x = -time * 0.5;
      ring1.rotation.z = time * 0.3;
      ring2.rotation.y = -time * 0.25;
      
      const camTargetX = (mouse.x * 12);
      const camTargetY = (-(currentScroll * 0.015) + (mouse.y * 12));
      const camTargetZ = 40 - (currentScroll * 0.025); // Deep space travel zoom effect
      
      camera.position.x += (camTargetX - camera.position.x) * 0.06;
      camera.position.y += (camTargetY - camera.position.y) * 0.06;
      camera.position.z += (camTargetZ - camera.position.z) * 0.06;
      camera.lookAt(0, 0, 0);

      shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.position.y = shard.userData.originY + Math.sin(time * 3 + shard.userData.phase) * 3.2;
        const distToMouse = shard.position.distanceTo(targetMouse);
        if(distToMouse < 28) {
          const dir = shard.position.clone().sub(targetMouse).normalize();
          shard.position.add(dir.multiplyScalar(0.45));
        } else {
          shard.position.x += (shard.userData.originX - shard.position.x) * 0.08;
          shard.position.z += (shard.userData.originZ - shard.position.z) * 0.08;
        }
      });

      const positions = particleGeo.attributes.position.array;
      for(let i = 0; i < positions.length; i += 3) {
        const px = positions[i];
        const py = positions[i+1];
        const pz = positions[i+2];
        const dx = px - targetMouse.x;
        const dy = py - targetMouse.y;
        const dz = pz - targetMouse.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if(dist < 22) {
          const force = (22 - dist) * 0.22;
          positions[i] += (dx / dist) * force;
          positions[i+1] += (dy / dist) * force;
          positions[i+2] += (dz / dist) * force;
        }
        positions[i] += (particleOriginalPos[i] - positions[i]) * 0.09;
        positions[i+1] += (particleOriginalPos[i+1] - positions[i+1]) * 0.09;
        positions[i+2] += (particleOriginalPos[i+2] - positions[i+2]) * 0.09;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 bg-black pointer-events-none" style={{ WebkitTransform: 'translateZ(0)' }} />;
};

/* ==========================================================================
   UI COMPONENTS & MICROINTERACTIONS
   ================================================================---------- */
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`transition-transform duration-150 ease-out transform-gpu ${className}`}>
      {children}
    </div>
  );
};

const SystemStatus = () => (
  <div className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/15 text-[9px] sm:text-xs uppercase flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 font-light tracking-widest text-neutral-200 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
    <div className="flex items-center gap-2 text-white font-bold truncate">
      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_15px_#dc2626] shrink-0"></div>
      <span className="truncate">USMAN_UBAID // SAFARI GLOSSMORPHIC KERNEL</span>
    </div>
    <div className="text-[#3b82f6] font-bold hidden md:block shrink-0">LAHORE, PK [31.5204° N, 74.3587° E]</div>
  </div>
);

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-40 mt-10 sm:mt-12 w-full px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-white flex items-center gap-2 drop-shadow-md">
          Usman Ubaid <span className="text-[#dc2626]">.</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-300 tracking-widest mt-0.5 uppercase hidden sm:block">Full-Stack SaaS Architect & 3D Interactive Systems</p>
      </div>

      <div className="hidden lg:flex gap-6 text-xs font-bold tracking-[0.2em] uppercase items-center">
        {['Work', 'Showcase', 'Ecosystem', 'Scrollytelling', 'Expertise', 'Contact'].map((item, idx) => (
          <a key={idx} href={`#${item.toLowerCase()}`} className="text-neutral-200 hover:text-[#dc2626] transition-colors">
            [{item}]
          </a>
        ))}
        <a href="#contact" className="bg-white/20 hover:bg-[#dc2626] text-white backdrop-blur-md border border-white/30 px-4 py-2 transition-all shadow-lg">
          Let's talk
        </a>
      </div>

      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className="lg:hidden text-white p-2 border border-white/20 bg-white/[0.05] backdrop-blur-md"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/20 p-6 flex flex-col gap-4 lg:hidden shadow-2xl">
          {['Work', 'Showcase', 'Ecosystem', 'Scrollytelling', 'Expertise', 'Contact'].map((item, idx) => (
            <a 
              key={idx} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-200 hover:text-[#dc2626] py-2 border-b border-white/10"
            >
              [{item}]
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#dc2626] text-white text-center py-3 font-bold uppercase tracking-widest mt-2"
          >
            Let's talk
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section id="index" className="relative z-10 w-full px-4 sm:px-8 pt-20 sm:pt-24 pb-24 sm:pb-32 border-b border-white/15 bg-transparent">
    <div className="max-w-6xl">
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-6 sm:mb-8 font-bold flex items-center gap-2 bg-white/[0.05] backdrop-blur-xl w-fit px-3 sm:px-4 py-1.5 border border-white/20 shadow-xl">
        <Crosshair size={16} className="shrink-0" /> <span className="truncate">FULL-STACK SaaS & 3D IMMERSIVE WORKSPACE</span>
      </p>
      <h2 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
        I build high-end <br /><span className="stroke-text">SaaS products</span> & web apps that scale.
      </h2>
      <p className="mt-6 sm:mt-8 text-xs sm:text-lg text-neutral-200 max-w-2xl font-light tracking-wide leading-relaxed bg-white/[0.04] p-6 sm:p-8 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        I'm Usman Ubaid — a full-stack engineer turning complex startup ideas, medical architectures, and AI/ML model integrations into production-ready web platforms using Next.js, React, SQL, Python, and Vercel.
      </p>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-white mb-1 drop-shadow">4+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Years Shipping Code</div>
        </div>
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-[#dc2626] mb-1 drop-shadow">8+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">SaaS & Web Apps Launched</div>
        </div>
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-[#3b82f6] mb-1 drop-shadow">14+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Advanced Technologies</div>
        </div>
      </div>
      
      <div className="mt-10 sm:mt-12 flex flex-wrap gap-4">
        <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/90 text-black px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
          Start a project <ArrowUpRight size={18} />
        </a>
        <a href="#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/[0.04] backdrop-blur-2xl text-white px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:border-[#3b82f6] transition-all border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          Selected work <Activity size={18} className="text-[#3b82f6]" />
        </a>
      </div>
    </div>
  </section>
);

const worksData = [
  { id: 'SYS.01', title: 'HealthcarePK', type: 'Healthcare Digital Infrastructure', tech: 'React / Node / PostgreSQL / Python ML', link: 'https://healthcarepk.online' },
  { id: 'SYS.02', title: 'Contract Maker', type: 'Legal SaaS Platform & Generator', tech: 'Next.js / Tailwind / Vercel Edge', link: 'https://universal-contract-maker.vercel.app/' },
  { id: 'SYS.03', title: 'UsmanUbaid Portfolio', type: 'Interactive 3D 60fps Web Engine', tech: 'React / Three.js / WebGL / Tailwind', link: '#' },
];

/* ==========================================================================
   ULTRA-SMOOTH 3D CARD CAROUSEL DECK FOR WORKS SECTION
   ================================================================---------- */
const Works = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return;

        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));

        const newIndex = Math.min(worksData.length - 1, Math.floor(progress * worksData.length));
        setActiveIndex(newIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} id="work" className="relative h-[600vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 sm:px-12 max-w-7xl mx-auto">
        
        {/* Deep Dark Glossmorphic Header */}
        <div className="flex flex-col sm:flex-row border border-white/20 px-6 py-5 items-start sm:items-center justify-between bg-neutral-950/90 backdrop-blur-2xl mb-8 shadow-[0_12px_40px_rgba(0,0,0,0.95)] rounded gap-3 sm:gap-0">
          <div>
            <p className="text-[#dc2626] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1">// 3D SPATIAL CARD DECK</p>
            <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow">Selected Production Work</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400">NODE 0{activeIndex + 1} / 0{worksData.length}</span>
            <span className="text-xs text-[#dc2626] font-bold uppercase bg-white/[0.08] px-3 py-1 border border-white/25 shadow-lg">ACTIVE</span>
          </div>
        </div>

        {/* 3D Depth-Layered Card Stage */}
        <div className="relative h-[420px] sm:h-[480px] w-full flex items-center justify-center perspective-1000">
          {worksData.map((work, idx) => {
            const distance = idx - activeIndex;
            const isCurrent = distance === 0;
            const isPrev = distance < 0;
            
            let transformStyle = '';
            let opacityStyle = 0;
            let filterStyle = 'blur(12px)';
            let pointerEvents = 'none';

            if (isCurrent) {
              transformStyle = 'translate3d(0, 0, 0px) rotateX(0deg) scale3d(1, 1, 1)';
              opacityStyle = 1;
              filterStyle = 'blur(0px)';
              pointerEvents = 'auto';
            } else if (isPrev) {
              transformStyle = 'translate3d(-120px, -40px, -300px) rotateY(20deg) rotateX(8deg) scale3d(0.8, 0.8, 0.8)';
              opacityStyle = 0.3;
              filterStyle = 'blur(8px)';
            } else {
              transformStyle = 'translate3d(160px, 50px, -400px) rotateY(-25deg) rotateX(-10deg) scale3d(0.7, 0.7, 0.7)';
              opacityStyle = 0.15;
              filterStyle = 'blur(12px)';
            }

            return (
              <div 
                key={idx} 
                className="absolute w-full max-w-4xl transition-all duration-700 ease-out will-change-transform"
                style={{ 
                  transform: transformStyle,
                  opacity: opacityStyle,
                  filter: filterStyle,
                  pointerEvents: pointerEvents,
                  zIndex: isCurrent ? 50 : 10 - Math.abs(distance)
                }}
              >
                <TiltCard className="w-full">
                  <a 
                    href={work.link} 
                    target={work.link !== '#' ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    className="block relative bg-neutral-950/95 backdrop-blur-3xl text-white border-2 border-white/40 p-8 sm:p-14 h-80 sm:h-96 flex flex-col justify-between group hover:border-[#dc2626] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all shadow-[0_30px_70px_rgba(0,0,0,0.98)] rounded"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs sm:text-sm bg-white/10 text-white px-3 py-1 font-black tracking-widest border border-white/20 shadow">{work.id}</span>
                      <ArrowUpRight size={32} className="text-neutral-400 group-hover:text-[#dc2626] transition-transform group-hover:rotate-45" />
                    </div>
                    <div>
                      <h4 className="text-3xl sm:text-6xl font-black tracking-tighter uppercase mb-4 text-white group-hover:text-[#dc2626] transition-colors drop-shadow-lg">{work.title}</h4>
                      <span className="text-xs text-white bg-[#dc2626] px-3.5 py-1 font-bold inline-block mb-3 shadow-[0_0_15px_rgba(220,38,38,0.7)]">{work.type}</span>
                      <p className="text-xs sm:text-sm text-neutral-300 font-mono tracking-wider">// {work.tech}</p>
                    </div>
                  </a>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Navigator Bar */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          {worksData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-500 rounded cursor-pointer ${activeIndex === idx ? 'bg-[#dc2626] shadow-[0_0_15px_#dc2626]' : 'bg-white/20 hover:bg-white/40'}`}
              onClick={() => {
                if (!containerRef.current) return;
                const scrollRange = containerRef.current.scrollHeight - window.innerHeight;
                window.scrollTo({ top: (idx / worksData.length) * scrollRange + containerRef.current.offsetTop, behavior: 'smooth' });
              }}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* ==========================================================================
   EXPANDED IMMERSIVE SHOWCASE SECTION (FIXED TEXT OVERLAP & PADDING)
   ================================================================---------- */
const showcaseBlocks = [
  { id: 'SC.01', tag: 'HEALTHCARE SYSTEM', title: 'Clinical Enterprise Cloud', desc: 'Secure HIPAA-compliant hospital architecture processing millions of real-time diagnostics securely.', tech: 'React / Node / PostgreSQL', highlight: 'Zero Latency' },
  { id: 'SC.02', tag: 'LEGAL AUTOMATION', title: 'Universal Contract Synthesizer', desc: 'AI-powered document generation protocol compiling customized corporate agreements instantly on Vercel Edge.', tech: 'Next.js / Tailwind / Vercel Edge', highlight: 'Autonomous AI' },
  { id: 'SC.03', tag: 'PHARMACEUTICAL ERP', title: 'Supply Chain Neural Hub', desc: 'Predictive data visualization dashboards monitoring pharmaceutical inventory flow and regional distribution.', tech: 'Python ML / WebGL / Pandas', highlight: 'Predictive ML' },
  { id: 'SC.04', tag: 'FINANCIAL DEPOSITORY', title: 'Secured Asset Vault', desc: 'Electronic depository integration linked with Central Depository Company for regulated trading frameworks.', tech: 'TypeScript / REST / Vault API', highlight: 'Bank-Grade' },
  { id: 'SC.05', tag: 'IMMERSIVE 3D KERNEL', title: 'WebGL Spatial Workspace', desc: 'Hardware-accelerated 60FPS browser-based 3D environment featuring raycasted mouse physics and shaders.', tech: 'Three.js / GLSL / Custom Shaders', highlight: '60 FPS 3D' },
  { id: 'SC.06', tag: 'BIOMETRIC ANALYTICS', title: 'Diagnostic Vision Hub', desc: 'Neural network pattern recognition interface built for rapid processing of medical imaging data.', tech: 'PyTorch / FastApi / React', highlight: 'High Throughput' }
];

const HorizontalShowcase = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return;

        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));

        const maxTranslate = trackRef.current.scrollWidth - window.innerWidth;
        trackRef.current.style.transform = `translate3d(-${progress * Math.max(0, maxTranslate)}px, 0, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} id="showcase" className="relative h-[600vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        
        {/* Fixed Title Header Positioned Safely Above Cards to Prevent Overlap */}
        <div className="px-4 sm:px-16 mb-8 pointer-events-none max-w-5xl">
          <p className="text-[#3b82f6] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-2 bg-white/[0.04] px-3 sm:px-4 py-1.5 border border-white/25 w-fit backdrop-blur-2xl shadow-xl">// EXPANDED SHOWCASE REPOSITORY</p>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">Ecosystem Architecture & Modules</h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-2">Explore all 6 deployed systems driving high-end performance across healthcare, legal, and fintech sectors.</p>
        </div>

        {/* Horizontal Sliding Cards Track */}
        <div className="w-full overflow-hidden">
          <div ref={trackRef} className="flex gap-6 sm:gap-10 pl-4 sm:pl-16 w-max will-change-transform">
            {showcaseBlocks.map((item, idx) => (
              <div key={idx} className="w-[85vw] md:w-[42vw] h-[52vh] sm:h-[58vh] border border-white/25 bg-neutral-950/95 backdrop-blur-3xl p-6 sm:p-12 flex flex-col justify-between relative group hover:border-[#3b82f6] transition-colors shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] sm:text-xs font-mono text-[#3b82f6] bg-white/[0.06] px-3 py-1 border border-white/20">{item.tag}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 border border-emerald-500/30">// {item.highlight}</span>
                </div>
                <div className="my-auto">
                  <span className="text-xs font-mono text-neutral-500 block mb-1">{item.id}</span>
                  <h4 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-3 text-white group-hover:text-[#3b82f6] transition-colors drop-shadow">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 sm:pt-6 border-t border-white/15 flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-300">
                  <span className="text-neutral-400">// {item.tech}</span>
                  <span className="text-white group-hover:text-[#3b82f6] transition-colors flex items-center gap-1">INSPECT &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const RadialOrbitalScrollytelling = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const modules = [
    { id: "NODE_01", title: "Frontend & Reactive UI Architecture", category: "CLIENT KERNEL", icon: Code, color: "#dc2626", desc: "Engineered with React, Next.js, and Tailwind CSS. Implements butter-smooth custom magnetic cursors, perspective tilt cards, and GPU-accelerated spatial transformations.", stats: "60 FPS Render Rate" },
    { id: "NODE_02", title: "Secure SQL & Relational Databases", category: "BACKEND INTEGRATION", icon: Database, color: "#3b82f6", desc: "Robust PostgreSQL and MySQL schemas optimized for high-throughput multi-tenant SaaS platforms, medical record indexes, and secure authentication pipelines.", stats: "ACID Compliant Storage" },
    { id: "NODE_03", title: "Python Machine Learning & AI", category: "INTELLIGENT PIPELINES", icon: Cpu, color: "#10b981", desc: "Advanced neural networks and automated contract generation systems built with Python, PyTorch, and Vercel Edge functions for real-time inference.", stats: "Real-time AI Synthesis" },
    { id: "NODE_04", title: "Global Vercel Edge Infrastructure", category: "CLOUD DEPLOYMENT", icon: Globe, color: "#f59e0b", desc: "Low-latency serverless architecture ensuring global distribution, instant cache invalidation, and bulletproof uptime for production startup applications.", stats: "99.99% Edge Uptime" }
  ];

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return;

        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        const newIndex = Math.min(modules.length - 1, Math.floor(progress * modules.length));
        setActiveIndex(newIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [modules.length]);

  return (
    <section ref={containerRef} id="ecosystem" className="relative h-[600vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between px-4 sm:px-16 py-12 sm:py-20 pointer-events-auto">
        
        <div className="flex justify-between items-center border-b border-white/15 pb-4 sm:pb-6 bg-white/[0.03] backdrop-blur-2xl px-4 sm:px-6 rounded shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div>
            <p className="text-[#dc2626] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1">// SLOW-SCROLL ECOSYSTEM MATRIX</p>
            <h3 className="text-xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow">Interactive Matrix</h3>
          </div>
          <div className="text-right font-mono text-[10px] sm:text-xs text-neutral-200">
            ACTIVE_INDEX: <span className="text-white font-bold">0{activeIndex + 1} / 0{modules.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center my-auto">
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
            <div className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '25s' }}></div>
            <div className="absolute w-40 sm:w-52 h-40 sm:h-52 rounded-full border border-dashed border-white/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            
            <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-white/[0.05] backdrop-blur-2xl border-2 border-[#dc2626] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] relative z-10 transition-all duration-500">
              {React.createElement(modules[activeIndex].icon, { size: 36, style: { color: modules[activeIndex].color } })}
            </div>
            
            <div className="mt-6 sm:mt-8 text-center relative z-10">
              <span className="text-[10px] sm:text-xs font-mono px-3 sm:px-4 py-1.5 bg-white/[0.06] backdrop-blur-2xl border border-white/20 text-white uppercase shadow-lg">
                {modules[activeIndex].category}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 border border-white/20 bg-white/[0.04] backdrop-blur-3xl p-6 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-600/25 to-transparent pointer-events-none"></div>
            
            <span className="text-[10px] sm:text-xs font-mono text-[#dc2626] block mb-2">{modules[activeIndex].id} // SYSTEM KERNEL</span>
            <h4 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-tight sm:leading-none drop-shadow">
              {modules[activeIndex].title}
            </h4>
            <p className="text-xs sm:text-base text-neutral-200 font-mono leading-relaxed mb-6 sm:mb-8">
              {modules[activeIndex].desc}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 sm:pt-6 border-t border-white/15 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <Network size={16} className="text-[#3b82f6] shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono text-neutral-300 uppercase">Performance Benchmark:</span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-white bg-white/[0.06] backdrop-blur-xl px-3 py-1 border border-white/20 w-fit">
                {modules[activeIndex].stats}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 border-t border-white/15 pt-4 sm:pt-6 bg-white/[0.03] backdrop-blur-2xl px-4 sm:px-6 pb-3 sm:pb-4 rounded shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          {modules.map((m, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 sm:h-2 transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'bg-[#dc2626] shadow-[0_0_15px_#dc2626]' : 'bg-white/20 hover:bg-white/40'}`}
              onClick={() => {
                if (!containerRef.current) return;
                const scrollRange = containerRef.current.scrollHeight - window.innerHeight;
                window.scrollTo({ top: (idx / modules.length) * scrollRange + containerRef.current.offsetTop, behavior: 'smooth' });
              }}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

const ScrollytellingSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  const milestones = [
    { phase: "PHASE_01 // ARCHITECTING", title: "System Scoping & Database Modeling", desc: "Defining high-throughput database schemas in PostgreSQL, establishing secure REST endpoints, and designing component hierarchies." },
    { phase: "PHASE_02 // ENGINEERING", title: "Full-Stack React & Next.js Build", desc: "Developing responsive SaaS interfaces using Tailwind CSS, implementing server actions, and configuring lightning-fast Vercel edge deployment." },
    { phase: "PHASE_03 // 3D KERNEL INTEGRATION", title: "WebGL Shaders & Spatial Shards", desc: "Embedding Three.js particle matrices, raycasted mouse physics, and hardware-accelerated 60FPS visual depth into user interfaces." },
    { phase: "PHASE_04 // DEPLOYMENT & SCALE", title: "Production Launch & AI Pipelines", desc: "Connecting Python machine learning models, optimizing performance metrics, and pushing live to production environments." }
  ];

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return;

        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        const newStep = Math.min(milestones.length - 1, Math.floor(progress * milestones.length));
        setActiveStep(newStep);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [milestones.length]);

  return (
    <section ref={containerRef} id="scrollytelling" className="relative h-[600vh] bg-transparent border-b border-white/10">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center px-4 sm:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-center">
          <div className="lg:col-span-5 border border-white/15 bg-black/60 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
            <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-4">// SLOW NARRATIVE PROGRESSION</p>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6">Development Lifecycle</h3>
            <div className="space-y-4 font-mono text-xs">
              {milestones.map((m, idx) => (
                <div key={idx} className={`p-3 sm:p-4 border transition-all flex items-center justify-between ${activeStep === idx ? 'border-[#dc2626] bg-black/80 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-white/10 bg-black/40 text-neutral-400'}`}>
                  <span>{m.phase}</span>
                  {activeStep === idx && <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-ping"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="min-h-[45vh] sm:min-h-[55vh] flex flex-col justify-center border-l-2 border-white/20 pl-8 sm:pl-12 bg-black/40 backdrop-blur-md p-8 rounded transition-all duration-300">
              <span className="text-xs font-mono text-[#dc2626] mb-3 tracking-widest">{milestones[activeStep].phase}</span>
              <h4 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-tight sm:leading-none">{milestones[activeStep].title}</h4>
              <p className="text-sm sm:text-base text-neutral-300 font-mono leading-relaxed">{milestones[activeStep].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Expertise3DMatrix = () => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(0);

  const capabilitiesData = [
    { id: '01', title: 'Full-Stack Architecture', tech: 'React / Next.js / Node', color: 0xdc2626, desc: 'High-performance reactive interfaces and scalable server-side infrastructure.' },
    { id: '02', title: 'Relational Databases', tech: 'PostgreSQL / MySQL / SQL', color: 0x3b82f6, desc: 'Optimized multi-tenant schemas, secure auth pipelines, and ACID compliance.' },
    { id: '03', title: 'WebGL & 3D Spatial Engines', tech: 'Three.js / Shaders / R3F', color: 0x10b981, desc: 'Immersive browser-based 3D environments, raycasted physics, and 60FPS shaders.' },
    { id: '04', title: 'Python & AI Pipelines', tech: 'PyTorch / ML / Automation', color: 0xf59e0b, desc: 'Tailored machine learning models and automated contract/data synthesis.' }
  ];

  useEffect(() => {
    const sectionEl = containerRef.current;
    const canvasContainer = mountRef.current;
    if (!sectionEl || !canvasContainer) return;

    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    const prismGroup = new THREE.Group();
    const layers = [];

    capabilitiesData.forEach((cap, idx) => {
      const layerGroup = new THREE.Group();
      
      const geo = new THREE.CylinderGeometry(6 - idx * 0.8, 6 - idx * 0.8, 0.6, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: cap.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      
      const ringGeo = new THREE.TorusGeometry(5 - idx * 0.6, 0.04, 16, 50);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;

      layerGroup.add(mesh);
      layerGroup.add(ring);
      
      layerGroup.position.y = (idx - 1.5) * 2.8;
      prismGroup.add(layerGroup);
      layers.push({ group: layerGroup, basePosY: (idx - 1.5) * 2.8 });
    });

    scene.add(prismGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 10, 100);
    pointLight.position.set(10, 20, 15);
    scene.add(pointLight);

    let mouseX = 0;
    let mouseY = 0;
    let currentScrollProgress = 0;

    const handleMouseMove = (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    let animationFrameId = null;

    const handleScroll = () => {
      if (!sectionEl) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = sectionEl.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return;

        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        currentScrollProgress = progress;

        const calculatedIndex = Math.min(capabilitiesData.length - 1, Math.floor(progress * capabilitiesData.length));
        setActiveLayer(calculatedIndex);
      });
    };

    canvasContainer.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      prismGroup.rotation.y += (mouseX * 0.8 - prismGroup.rotation.y) * 0.08 + 0.004;
      prismGroup.rotation.x += (mouseY * 0.5 - prismGroup.rotation.x) * 0.08;

      const targetExplosion = 0.8 + currentScrollProgress * 1.8;

      layers.forEach((layer, idx) => {
        const isHighlighted = idx === activeLayer;
        const explosionMultiplier = isHighlighted ? 1.9 : 0.9;
        const targetPosY = layer.basePosY * targetExplosion * explosionMultiplier;
        
        layer.group.position.y += (targetPosY - layer.group.position.y) * 0.1;
        layer.group.rotation.y = time * (idx % 2 === 0 ? 0.25 : -0.25);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasContainer) return;
      const nw = canvasContainer.clientWidth;
      const nh = canvasContainer.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasContainer.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (canvasContainer) canvasContainer.innerHTML = '';
    };
  }, [activeLayer]);

  return (
    <section ref={containerRef} id="expertise" className="relative h-[600vh] bg-transparent border-b border-white/10">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 sm:px-16 py-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/15 pb-6 mb-8 bg-white/[0.03] backdrop-blur-2xl px-6 rounded shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] gap-4">
          <div>
            <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-1">// SLOW-SCROLL 3D HOLOGRAPHIC MATRIX</p>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow">Technical Blueprint & Stack</h3>
          </div>
          <span className="text-xs font-mono text-neutral-300 bg-white/[0.05] px-3 py-1 border border-white/20">SLOW SCROLL PRISM EXPANSION // 3D INTERACTION</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 h-[400px] sm:h-[480px] border border-white/20 bg-white/[0.02] backdrop-blur-3xl relative rounded overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-center">
            <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
            <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[10px] text-neutral-400 bg-black/60 px-3 py-1 border border-white/10">
              [SLOW SCROLL TO EXPAND LAYERS // DRAG TO ROTATE]
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            {capabilitiesData.map((cap, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveLayer(idx)}
                className={`border p-4 sm:p-6 transition-all duration-300 cursor-pointer backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-start gap-4 ${
                  activeLayer === idx 
                    ? 'border-[#dc2626] bg-white/[0.08] shadow-[0_0_25px_rgba(220,38,38,0.3)] translate-x-2' 
                    : 'border-white/15 bg-white/[0.03] opacity-60 hover:opacity-100 hover:border-white/40'
                }`}
              >
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white border border-white/20 shrink-0">{cap.id}</span>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">{cap.title}</h5>
                    <span className="text-[10px] font-mono text-[#dc2626] font-bold">{cap.tech}</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="relative z-10 w-full bg-transparent">
    <div className="px-4 sm:px-8 py-24 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-16 bg-black/50 backdrop-blur-md">
      <div>
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase text-white drop-shadow">Let's build<br/>something great.</h2>
        <p className="text-xs text-neutral-300 mt-6 tracking-widest uppercase font-bold">Reach out directly to discuss your SaaS or web platform.</p>
        <div className="mt-8 flex flex-col gap-4 text-xs font-bold tracking-widest">
          <a href="mailto:dev@healthcarepk.online" className="text-neutral-200 hover:text-[#dc2626] transition-colors">DEV@HEALTHCAREPK.ONLINE</a>
          <a href="tel:+923041381382" className="text-neutral-200 hover:text-[#dc2626] transition-colors">+92 304 1381382</a>
          <span className="text-[#3b82f6]">LAHORE, PAKISTAN [31.5204° N, 74.3587° E]</span>
        </div>
      </div>
      <div>
        <form className="flex flex-col gap-4 bg-black/60 p-8 border border-white/15 backdrop-blur-xl shadow-2xl" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="YOUR EMAIL" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors" />
          <textarea placeholder="PROJECT DETAILS / MESSAGE" rows="4" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors"></textarea>
          <button type="submit" className="bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">Send MessageBox</button>
        </form>
      </div>
    </div>
    <div className="px-4 sm:px-8 py-6 text-[10px] text-neutral-400 tracking-widest uppercase font-bold flex justify-between bg-black/80 backdrop-blur-md border-t border-white/10">
      <div>&copy; {new Date().getFullYear()} USMAN UBAID // ALL RIGHTS RESERVED.</div>
      <div>60FPS_TRANSPARENT_KERNEL_ACTIVE</div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen relative font-mono text-white bg-black">
      <WebGLEngine />
      <SystemStatus />
      <main className="relative z-10 pt-12">
        <Navigation />
        <Hero />
        <Works />
        <HorizontalShowcase />
        <RadialOrbitalScrollytelling />
        <ScrollytellingSection />
        <Expertise3DMatrix />
        <Footer />
      </main>
    </div>
  );
}
