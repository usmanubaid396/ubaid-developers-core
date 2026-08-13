import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers, Shield, 
  CpuIcon, Globe, TerminalSquare, Workflow, Flame, CheckCircle2,
  Layers3, Sparkles, Command, GitBranch, Eye, Maximize2, RefreshCw, 
  Compass, BoxSelect, Cpu as CpuSymbol, Play, Pause, ChevronRight,
  Radio, CpuShare, Terminal as TerminalIcon, Cpu as Microchip, Hexagon, Network, Menu, X,
  Github, Linkedin, ExternalLink
} from 'lucide-react';

/* ==========================================================================
   ADVANCED 60FPS WEBGL & THREE.JS CINEMATIC SPATIAL ENGINE
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

    const ambientLight = new THREE.AmbientLight(0x151515, 2.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xdc2626, 9, 200);
    pointLight1.position.set(30, 30, 40);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 7, 200);
    pointLight2.position.set(-30, -30, 30);
    scene.add(pointLight2);

    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(8.5, 2);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.1, metalness: 0.99 });
    const coreMeshSolid = new THREE.Mesh(coreGeo, coreMat);
    
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: true, transparent: true, opacity: 0.9 });
    const coreMeshWire = new THREE.Mesh(coreGeo, wireMat);

    const innerGeo = new THREE.IcosahedronGeometry(5, 1);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.7 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);

    const ringGeo1 = new THREE.TorusGeometry(13, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
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
    const shardMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.15, metalness: 0.9 });
    const shards = [];
    
    for(let i = 0; i < 70; i++) {
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

    const particleCount = 4500;
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
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.85 });
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
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const planeIntersects = raycaster.intersectObject(interactionPlane);
      if (planeIntersects.length > 0) targetMouse.copy(planeIntersects[0].point);
      const coreIntersects = raycaster.intersectObject(coreHitBox);
      isCoreHovered = coreIntersects.length > 0;
    };
    window.addEventListener('mousemove', onMouseMove);

    let targetScroll = 0;
    let currentScroll = 0;
    const onScroll = () => { targetScroll = window.scrollY; };
    window.addEventListener('scroll', onScroll);

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
      
      coreGroup.rotation.y = time * 0.4 + (currentScroll * 0.0025);
      coreGroup.rotation.x = Math.sin(time * 0.3) * 0.3 + (currentScroll * 0.0015);
      innerMesh.rotation.x = -time * 0.7;
      ring1.rotation.z = time * 0.5;
      ring2.rotation.y = -time * 0.4;
      
      const camTargetX = (mouse.x * 16);
      const camTargetY = (-(currentScroll * 0.022) + (mouse.y * 16));
      const camTargetZ = 40 - (currentScroll * 0.035);
      
      camera.position.x += (camTargetX - camera.position.x) * 0.08;
      camera.position.y += (camTargetY - camera.position.y) * 0.08;
      camera.position.z += (camTargetZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.position.y = shard.userData.originY + Math.sin(time * 4 + shard.userData.phase) * 3.2;
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
      particles.rotation.y = time * 0.07;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
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
  <div className="fixed top-0 w-full z-50 bg-black backdrop-blur-xl border-b border-white/15 text-[9px] sm:text-xs uppercase flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 font-light tracking-widest text-neutral-200">
    <div className="flex items-center gap-2 text-white font-bold truncate">
      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_15px_#dc2626] shrink-0"></div>
      <span className="truncate">MUHAMMAD USMAN // FULL-STACK PORTFOLIO</span>
    </div>
    <div className="text-[#3b82f6] font-bold hidden md:block shrink-0">VEHARI & LAHORE, PK</div>
  </div>
);

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-40 mt-10 sm:mt-12 w-full px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-white/15 bg-black backdrop-blur-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
          Muhammad Usman <span className="text-[#dc2626]">.</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-400 tracking-widest mt-0.5 uppercase hidden sm:block">Full-Stack Developer — SaaS, Healthcare, and Interactive Systems</p>
      </div>

      <div className="hidden lg:flex gap-6 text-xs font-bold tracking-[0.2em] uppercase items-center text-neutral-300">
        {['About', 'Projects', 'Skills', 'Contact'].map((item, idx) => (
          <a key={idx} href={`#${item.toLowerCase()}`} className="hover:text-[#dc2626] transition-colors">
            [{item}]
          </a>
        ))}
        <a href="#contact" className="bg-white/10 hover:bg-[#dc2626] text-white border border-white/20 px-4 py-2 transition-all">
          Get in Touch
        </a>
      </div>

      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className="lg:hidden text-white p-2 border border-neutral-800 bg-neutral-900"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-b border-neutral-800 p-6 flex flex-col gap-4 lg:hidden z-50">
          {['About', 'Projects', 'Skills', 'Contact'].map((item, idx) => (
            <a 
              key={idx} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-300 hover:text-[#dc2626] py-2 border-b border-neutral-900"
            >
              [{item}]
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#dc2626] text-white text-center py-3 font-bold uppercase tracking-widest mt-2"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section id="about" className="relative z-10 w-full px-4 sm:px-8 pt-20 sm:pt-24 pb-24 sm:pb-32 border-b border-white/15 bg-black">
    <div className="max-w-6xl">
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-6 sm:mb-8 font-bold flex items-center gap-2 bg-neutral-950 w-fit px-3 sm:px-4 py-1.5 border border-neutral-800">
        <Crosshair size={16} className="shrink-0" /> <span className="truncate">VEHARI & LAHORE, PAKISTAN</span>
      </p>
      <h2 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] text-white">
        Full-Stack Developer <br /><span className="text-neutral-500">— SaaS, Healthcare, & Interactive Systems.</span>
      </h2>
      <p className="mt-6 sm:mt-8 text-xs sm:text-lg text-neutral-300 max-w-3xl font-light tracking-wide leading-relaxed bg-neutral-950 p-6 sm:p-8 border border-neutral-800">
        Selected work across solo builds, client engagements, and team projects. Public samples available on GitHub; proprietary work available on request. I work across the stack depending on the project scope — from solo MVPs to leading frontend teams on regulated client products. My public GitHub shows sample work; detailed case studies for proprietary projects are available by request.
      </p>
      
      <div className="mt-10 sm:mt-12 flex flex-wrap gap-4 text-xs font-mono uppercase">
        <a href="mailto:dev@healthcarepk.online" className="inline-flex items-center gap-2 bg-white text-black px-6 py-4 font-bold hover:bg-[#dc2626] hover:text-white transition-colors border border-white">
          <Mail size={16} /> dev@healthcarepk.online
        </a>
        <a href="https://github.com/usmanubaid396" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-6 py-4 hover:border-[#dc2626] transition-colors">
          <Github size={16} /> github.com/usmanubaid396
        </a>
        <a href="https://linkedin.com/in/uu51" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-6 py-4 hover:border-[#dc2626] transition-colors">
          <Linkedin size={16} /> linkedin.com/in/uu51
        </a>
      </div>
    </div>
  </section>
);

const projectsData = [
  {
    title: 'HealthcarePK (Clinical Enterprise Cloud)',
    role: '[CONTRIBUTOR]',
    desc: 'Contributed the PostgreSQL schema and REST auth layer for a healthcare project. Handled role-based access control and audit logging.',
    note: 'Source code private — architecture notes available on request.',
    link: null
  },
  {
    title: 'Universal Contract Maker',
    role: '[SOLO BUILD]',
    desc: 'Built the open-source contract template engine, then extended it for a client deployment adding dynamic document generation and client-side validation logic.',
    note: null,
    link: 'https://github.com/usmanubaid396/universal-contract-maker'
  },
  {
    title: 'Supply Chain Neural Hub',
    role: '[CONTRIBUTOR]',
    desc: 'Integrated the data visualization dashboards and filtering controls using React and Plotly for a client logistics project.',
    note: 'Source code private — architecture notes available on request.',
    link: null
  },
  {
    title: 'Secured Asset Vault',
    role: '[CONTRIBUTOR]',
    desc: 'Built the user onboarding forms and electronic depository alert tracking interface for a financial client application.',
    note: 'Source code private — architecture notes available on request.',
    link: null
  },
  {
    title: 'WebGL Spatial Workspace',
    role: '[SOLO BUILD]',
    desc: 'Engineered the 60FPS Three.js particle matrix and raycasted mouse interaction component for portfolio demonstration.',
    note: null,
    link: 'https://github.com/usmanubaid396'
  },
  {
    title: 'Diagnostic Vision Hub',
    role: '[CONTRIBUTOR]',
    desc: 'Built the Streamlit interface and data ingestion pipeline wrapper for a machine learning model demo.',
    note: 'Source code private — architecture notes available on request.',
    link: null
  }
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

        const newIndex = Math.min(projectsData.length - 1, Math.floor(progress * projectsData.length));
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
    <section ref={containerRef} id="projects" className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 sm:px-12 max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row border border-white/10 px-6 py-5 items-start sm:items-center justify-between bg-black/60 backdrop-blur-2xl mb-8 shadow-2xl rounded gap-3 sm:gap-0">
          <div>
            <p className="text-[#dc2626] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1">// PROJECTS & CONTRIBUTIONS</p>
            <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">Selected Engagements</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400">ITEM 0{activeIndex + 1} / 0{projectsData.length}</span>
            <span className="text-xs text-[#dc2626] font-bold uppercase bg-black px-3 py-1 border border-white/10">ACTIVE</span>
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[480px] w-full flex items-center justify-center perspective-1000">
          {projectsData.map((project, idx) => {
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
                  <div className="block relative bg-black/90 backdrop-blur-3xl text-white border-2 border-white/20 p-8 sm:p-14 h-80 sm:h-96 flex flex-col justify-between shadow-2xl rounded">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-[#dc2626] bg-[#dc2626]/20 border border-[#dc2626]/40 px-2.5 py-1">
                          {project.role}
                        </span>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#dc2626] transition-colors">
                            <ArrowUpRight size={24} />
                          </a>
                        )}
                      </div>
                      <h4 className="text-2xl sm:text-4xl font-black tracking-tight uppercase mb-3 text-white">{project.title}</h4>
                      <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">{project.desc}</p>
                    </div>
                    {project.note && (
                      <p className="text-[11px] text-neutral-400 italic border-t border-white/10 pt-3">
                        {project.note}
                      </p>
                    )}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-6 gap-2 mt-8">
          {projectsData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-500 rounded cursor-pointer ${activeIndex === idx ? 'bg-[#dc2626] shadow-[0_0_15px_#dc2626]' : 'bg-white/20 hover:bg-white/40'}`}
              onClick={() => {
                if (!containerRef.current) return;
                const scrollRange = containerRef.current.scrollHeight - window.innerHeight;
                window.scrollTo({ top: (idx / projectsData.length) * scrollRange + containerRef.current.offsetTop, behavior: 'smooth' });
              }}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* ==========================================================================
   SKILLS SECTION — HORIZONTAL NEWS TICKER & PROMINENT BLOCKS
   ================================================================---------- */
const Skills = () => {
  const skillsList = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
    'Python', 'PostgreSQL', 'Three.js', 'Tailwind CSS', 'REST APIs'
  ];

  const tickerItems = [...skillsList, ...skillsList, ...skillsList];

  return (
    <section id="skills" className="relative z-10 w-full py-24 border-b border-white/10 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-10">
        <p className="text-[#dc2626] text-xs tracking-widest uppercase mb-2">// TECHNICAL COMPETENCIES</p>
        <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Skills</h3>
      </div>

      <div className="relative w-full overflow-hidden py-4 bg-neutral-950/80 border-y border-white/20 backdrop-blur-md">
        <div className="flex w-max animate-marquee gap-6">
          {tickerItems.map((skill, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-6 py-4 border-2 border-white/30 bg-black/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded text-sm font-mono font-bold tracking-wider uppercase text-white hover:border-[#dc2626] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all shrink-0"
            >
              <span className="w-2.5 h-2.5 bg-[#dc2626] rounded-full animate-pulse"></span>
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
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="relative z-10 w-full bg-black font-mono text-xs">
    <div className="px-4 sm:px-8 py-24 border-b border-white/10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 bg-black/50 backdrop-blur-md">
      <div>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white mb-4">Get in touch.</h2>
        <p className="text-xs text-neutral-300 tracking-widest uppercase font-bold mb-6">Reach out directly via email or connect via profile links.</p>
        <div className="flex flex-col gap-3 text-xs font-bold tracking-widest">
          <a href="mailto:dev@healthcarepk.online" className="text-neutral-200 hover:text-[#dc2626] transition-colors">DEV@HEALTHCAREPK.ONLINE</a>
          <a href="https://github.com/usmanubaid396" target="_blank" rel="noopener noreferrer" className="text-neutral-200 hover:text-[#dc2626] transition-colors">GITHUB.COM/USMANUBAID396</a>
          <a href="https://linkedin.com/in/uu51" target="_blank" rel="noopener noreferrer" className="text-neutral-200 hover:text-[#dc2626] transition-colors">LINKEDIN.COM/IN/UU51</a>
        </div>
      </div>
      <div>
        <form className="flex flex-col gap-4 bg-black/60 p-8 border border-white/15 backdrop-blur-xl shadow-2xl" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="YOUR EMAIL" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors" />
          <textarea placeholder="MESSAGE / INQUIRY" rows="4" required className="bg-black/80 border border-white/15 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors"></textarea>
          <button type="submit" className="bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">Send Message</button>
        </form>
      </div>
    </div>
    <div className="px-4 sm:px-8 py-6 text-[10px] text-neutral-400 tracking-widest uppercase font-bold flex flex-col sm:flex-row justify-between items-center gap-2 max-w-6xl mx-auto bg-black/80 backdrop-blur-md">
      <div>&copy; {new Date().getFullYear()} Muhammad Usman. All rights reserved.</div>
      <div>Full-Stack Developer Portfolio</div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen relative font-mono text-white bg-black selection:bg-red-600 selection:text-white">
      <WebGLEngine />
      <SystemStatus />
      <main className="relative z-10 pt-12">
        <Navigation />
        <Navigation />
        <Hero />
        <Works />
        <Skills />
        <Footer />
      </main>
    </div>
  );
}
