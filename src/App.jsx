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
      currentScroll += (targetScroll - currentScroll) * 0.05;
      
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
      const camTargetZ = 40 - (currentScroll * 0.025);
      
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
  <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/15 text-[9px] sm:text-xs uppercase flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 font-light tracking-widest text-neutral-200 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
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
    <nav className="relative z-40 mt-10 sm:mt-12 w-full px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-white/15 bg-neutral-950/90 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-white flex items-center gap-2 drop-shadow-md">
          Usman Ubaid <span className="text-[#dc2626]">.</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-300 tracking-widest mt-0.5 uppercase hidden sm:block">Full-Stack SaaS Architect & 3D Interactive Systems</p>
      </div>

      <div className="hidden lg:flex gap-6 text-xs font-bold tracking-[0.2em] uppercase items-center">
        {['Work', 'Skills', 'Ecosystem', 'Scrollytelling', 'Expertise', 'Contact'].map((item, idx) => (
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
          {['Work', 'Skills', 'Ecosystem', 'Scrollytelling', 'Expertise', 'Contact'].map((item, idx) => (
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
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-6 sm:mb-8 font-bold flex items-center gap-2 bg-neutral-950/80 backdrop-blur-xl w-fit px-3 sm:px-4 py-1.5 border border-white/20 shadow-xl">
        <Crosshair size={16} className="shrink-0" /> <span className="truncate">FULL-STACK SaaS & 3D IMMERSIVE WORKSPACE</span>
      </p>
      <h2 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
        I build high-end <br /><span className="stroke-text">SaaS products</span> & web apps that scale.
      </h2>
      <p className="mt-6 sm:mt-8 text-xs sm:text-lg text-neutral-200 max-w-2xl font-light tracking-wide leading-relaxed bg-neutral-950/80 p-6 sm:p-8 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        I'm Usman Ubaid — a full-stack engineer turning complex startup ideas, medical architectures, and AI/ML model integrations into production-ready web platforms using Next.js, React, SQL, Python, and Vercel.
      </p>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
        <div className="border border-white/15 bg-neutral-950/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-white mb-1 drop-shadow">4+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Years Shipping Code</div>
        </div>
        <div className="border border-white/15 bg-neutral-950/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-[#dc2626] mb-1 drop-shadow">8+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">SaaS & Web Apps Launched</div>
        </div>
        <div className="border border-white/15 bg-neutral-950/80 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-3xl sm:text-5xl font-black text-[#3b82f6] mb-1 drop-shadow">14+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Advanced Technologies</div>
        </div>
      </div>
      
      <div className="mt-10 sm:mt-12 flex flex-wrap gap-4">
        <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/90 text-black px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
          Start a project <ArrowUpRight size={18} />
        </a>
        <a href="#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-neutral-950/80 backdrop-blur-2xl text-white px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:border-[#3b82f6] transition-all border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
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
    <section ref={containerRef} id="work" className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 sm:px-12 max-w-7xl mx-auto">
        
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
   SKILLS SECTION — HORIZONTAL RUNNING TICKER
   ================================================================---------- */
const SkillsTicker = () => {
  const skills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 
    'Three.js', 'Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'WebGL', 'Vercel'
  ];

  const tickerContent = [...skills, ...skills, ...skills];

  return (
    <section id="skills" className="relative z-10 w-full py-20 bg-transparent border-b border-white/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-8">
        <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-1">// TECHNICAL CORE STACK</p>
        <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow">Skills & Technologies</h3>
      </div>

      <div className="relative w-full overflow-hidden py-4 bg-neutral-950/80 border-y border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex w-max animate-marquee gap-6">
          {tickerContent.map((skill, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 px-6 py-3.5 bg-black/80 backdrop-blur-xl border border-white/20 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg shrink-0 hover:border-[#dc2626] transition-colors"
            >
              <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse"></div>
              {skill}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
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
        
        <div className="flex justify-between items-center border-b border-white/15 pb-4 sm:pb-6 bg-neutral-950/90 backdrop-blur-2xl px-4 sm:px-6 rounded shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
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
            
            <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-neutral-950/90 backdrop-blur-2xl border-2 border-[#dc2626] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] relative z-10 transition-all duration-500">
              {React.createElement(modules[activeIndex].icon, { size: 36, style: { color: modules[activeIndex].color } })}
            </div>
            
            <div className="mt-6 sm:mt-8 text-center relative z-10">
              <span className="text-[10px] sm:text-xs font-mono px-3 sm:px-4 py-1.5 bg-neutral-950/90 backdrop-blur-2xl border border-white/20 text-white uppercase shadow-lg">
                {modules[activeIndex].category}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 border border-white/20 bg-neutral-950/90 backdrop-blur-3xl p-6 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden rounded">
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
              <span className="text-[11px] sm:text-xs font-mono font-bold text-white bg-neutral-950/90 backdrop-blur-xl px-3 py-1 border border-white/20 w-fit">
                {modules[activeIndex].stats}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 border-t border-white/15 pt-4 sm:pt-6 bg-neutral-950/90 backdrop-blur-2xl px-4 sm:px-6 pb-3 sm:pb-4 rounded shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
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
          <div className="lg:col-span-5 border border-white/15 bg-neutral-950/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl rounded">
            <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-4">// SLOW NARRATIVE PROGRESSION</p>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6">Development Lifecycle</h3>
            <div className="space-y-4 font-mono text-xs">
              {milestones.map((m, idx) => (
                <div key={idx} className={`p-3 sm:p-4 border transition-all flex items-center justify-between ${activeStep === idx ? 'border-[#dc2626] bg-neutral-900 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-white/10 bg-neutral-950 text-neutral-400'}`}>
                  <span>{m.phase}</span>
                  {activeStep === idx && <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-ping"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="min-h-[45vh] sm:min-h-[55vh] flex flex-col justify-center border-l-2 border-white/20 pl-8 sm:pl-12 bg-neutral-950/90 backdrop-blur-md p-8 rounded shadow-2xl transition-all duration-300">
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

/* ==========================================================================
   ELITE HIGH-END 3D CYBER-HOLOGRAPHIC SPATIAL DECK (EXPERTISE)
   ================================================================---------- */
const EliteCyberExpertiseDeck = () => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

  const pillars = [
    {
      id: 'SYS-01',
      title: 'Full-Stack Architecture & React',
      category: 'REACTIVE SYSTEM KERNEL',
      desc: 'Architecting high-throughput server-side rendering pipelines and reactive UI layers with Next.js, React, and modular Tailwind component ecosystems.',
      metric: '99.98% Latency Optimization',
      color: 0xdc2626
    },
    {
      id: 'SYS-02',
      title: 'Relational Database Engineering',
      category: 'ACID COMPLIANT STORAGE',
      desc: 'Designing enterprise multi-tenant PostgreSQL databases, secure token verification layers, and encrypted data access control protocols.',
      metric: 'Sub-Millisecond Indexing',
      color: 0x3b82f6
    },
    {
      id: 'SYS-03',
      title: 'WebGL & 3D Spatial Engines',
      category: 'GPU ACCELERATED GRAPHICS',
      desc: 'Building custom hardware-accelerated 3D browser experiences, raycasted collision meshes, and real-time GLSL visual shaders using Three.js.',
      metric: '60 FPS Stable Frame Lock',
      color: 0x10b981
    },
    {
      id: 'SYS-04',
      title: 'Python Machine Learning & AI',
      category: 'AUTONOMOUS SYNTHESIS',
      desc: 'Deploying neural networks, PyTorch predictive classification models, and serverless automated contract synthesisers via Vercel Edge.',
      metric: 'Real-Time Neural Inference',
      color: 0xf59e0b
    }
  ];

  useEffect(() => {
    const section = containerRef.current;
    const canvasWrap = mountRef.current;
    if (!section || !canvasWrap) return;

    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.005);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasWrap.appendChild(renderer.domElement);

    // Multi-layered Cyber Hologram Core Structure
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);

    // Outer Tech Sphere
    const outerGeo = new THREE.IcosahedronGeometry(6, 2);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: true, transparent: true, opacity: 0.35 });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    holoGroup.add(outerMesh);

    // Inner Solid Monolith
    const innerGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.95 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    holoGroup.add(innerMesh);

    // Floating Cyber Ring Matrix
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(8 + i * 2, 0.04, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xdc2626 : i === 1 ? 0x3b82f6 : 0x10b981, transparent: true, opacity: 0.6 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (2 + i);
      ringMesh.rotation.y = Math.PI / (3 + i);
      holoGroup.add(ringMesh);
      rings.push(ringMesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xdc2626, 12, 100);
    pointLight.position.set(10, 20, 15);
    scene.add(pointLight);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = canvasWrap.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvasWrap.addEventListener('mousemove', onMouseMove);

    let scrollProgress = 0;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      if (scrollRange <= 0) return;
      let progress = -rect.top / scrollRange;
      scrollProgress = Math.max(0, Math.min(1, progress));
      
      const activeIdx = Math.min(pillars.length - 1, Math.floor(progress * pillars.length));
      setActiveCard(activeIdx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      holoGroup.rotation.y += (mouseX * 0.9 - holoGroup.rotation.y) * 0.08 + 0.006;
      holoGroup.rotation.x += (mouseY * 0.6 - holoGroup.rotation.x) * 0.08;

      outerMesh.rotation.y = time * 0.3 + scrollProgress * Math.PI * 2;
      innerMesh.rotation.x = time * 0.4;
      innerMesh.rotation.y = -time * 0.2;

      rings.forEach((ring, i) => {
        ring.rotation.z = time * (0.3 + i * 0.15);
        ring.rotation.y = time * (0.15 + i * 0.08);
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!canvasWrap) return;
      const nw = canvasWrap.clientWidth;
      const nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      canvasWrap.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (canvasWrap) canvasWrap.innerHTML = '';
    };
  }, []);

  return (
    <section ref={containerRef} id="expertise" className="relative h-[500vh] bg-transparent border-b border-white/10">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto z-20">
        
        {/* Professional Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-white/20 pb-4 pt-4 px-8 mb-8 bg-neutral-950/95 backdrop-blur-3xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] gap-4 shrink-0">
          <div>
            <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-1">// ELITE SYSTEM ARCHITECTURE & EXPERTISE</p>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow">Core Technical Matrix</h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-neutral-400">PILOT MODULE 0{activeCard + 1} / 0{pillars.length}</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-3.5 py-1.5 border border-emerald-500/40 rounded-lg">// 60 FPS ACTIVE</span>
          </div>
        </div>

        {/* Master Grid: Cinematic 3D Hologram Deck + High-End Glassmorphic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Cyber Hologram Viewport */}
          <div className="lg:col-span-5 h-[340px] sm:h-[440px] border border-white/25 bg-neutral-950/95 backdrop-blur-3xl relative rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.99)] flex items-center justify-center shrink-0">
            <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
            <div className="absolute top-4 left-4 font-mono text-[10px] text-neutral-400 bg-black/90 px-3.5 py-1.5 border border-white/20 rounded-lg backdrop-blur-md pointer-events-none">
              [INTERACTIVE 3D HOLOGRAM MATRIX]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#dc2626] bg-black/90 px-3.5 py-1.5 border border-[#dc2626]/40 rounded-lg backdrop-blur-md pointer-events-none animate-pulse">
              NODE ACTIVE // 0{activeCard + 1}
            </div>
          </div>

          {/* Right: Interactive Professional HUD Cards */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {pillars.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`border p-6 sm:p-7 transition-all duration-500 cursor-pointer backdrop-blur-3xl rounded-2xl relative overflow-hidden group shadow-2xl ${
                  activeCard === idx 
                    ? 'border-[#dc2626] bg-neutral-900/95 shadow-[0_0_40px_rgba(220,38,38,0.3)] translate-x-2' 
                    : 'border-white/15 bg-neutral-950/80 opacity-65 hover:opacity-100 hover:border-white/40'
                }`}
              >
                {activeCard === idx && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#dc2626] shadow-[0_0_20px_#dc2626]"></div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black px-3 py-1 bg-black text-white rounded-lg border border-white/20">{item.id}</span>
                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#dc2626] transition-colors">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#3b82f6] bg-blue-950/80 border border-blue-500/40 px-3 py-1 rounded-lg font-bold tracking-wider">{item.category}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed mb-4 pl-0 sm:pl-12">
                  {item.desc}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-white/10 pl-0 sm:pl-12 text-xs font-mono">
                  <span className="text-neutral-400">System Benchmark:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3.5 py-1 rounded-lg border border-emerald-500/40">{item.metric}</span>
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
        <form className="flex flex-col gap-4 bg-black/60 p-8 border border-white/15 backdrop-blur-xl shadow-2xl rounded" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="YOUR EMAIL" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors rounded" />
          <textarea placeholder="PROJECT DETAILS / MESSAGE" rows="4" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors rounded"></textarea>
          <button type="submit" className="bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded">Send Message</button>
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
        <SkillsTicker />
        <RadialOrbitalScrollytelling />
        <ScrollytellingSection />
        <EliteCyberExpertiseDeck />
        <Footer />
      </main>
    </div>
  );
}
