import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers, Shield, 
  CpuIcon, Globe, TerminalSquare, Workflow, Flame, CheckCircle2,
  Layers3, Sparkles, Command, GitBranch, Eye, Maximize2, RefreshCw, 
  Compass, BoxSelect, Cpu as CpuSymbol, Play, Pause, ChevronRight,
  Radio, CpuShare, Terminal as TerminalIcon, Cpu as Microchip
} from 'lucide-react';

/* ==========================================================================
   ADVANCED 60FPS WEBGL & THREE.JS CINEMATIC SPATIAL ENGINE
   ================================================================---------- */
const WebGLEngine = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.007);
    
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 40;
    
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x151515, 2.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xdc2626, 9, 200);
    pointLight1.position.set(30, 30, 40);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 7, 200);
    pointLight2.position.set(-30, -30, 30);
    scene.add(pointLight2);

    // Dynamic Multi-Layered 3D Core Matrix
    const coreGroup = new THREE.Group();
    
    const coreGeo = new THREE.IcosahedronGeometry(8.5, 2);
    const coreMat = new THREE.MeshStandardMaterial({ 
      color: 0x010101, 
      roughness: 0.1, 
      metalness: 0.99
    });
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

    const ringGeo3 = new THREE.TorusGeometry(19, 0.025, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
    ring3.rotation.z = Math.PI / 6;

    const hitBoxGeo = new THREE.SphereGeometry(12, 16, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const coreHitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);

    coreGroup.add(coreMeshSolid);
    coreGroup.add(coreMeshWire);
    coreGroup.add(innerMesh);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(ring3);
    coreGroup.add(coreHitBox);
    scene.add(coreGroup);

    // Interactive Floating Shards Field
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

    // Dense High-Performance Particle Matrix
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
      
      currentScroll += (targetScroll - currentScroll) * 0.06;
      
      const targetCoreScale = isCoreHovered ? 1.5 : 1.0;
      const pulse = Math.sin(time * 5) * 0.09;
      
      coreTargetScale.setScalar(targetCoreScale + pulse);
      coreGroup.scale.lerp(coreTargetScale, 0.12);
      
      coreGroup.rotation.y = time * 0.4 + (currentScroll * 0.0025);
      coreGroup.rotation.x = Math.sin(time * 0.3) * 0.3 + (currentScroll * 0.0015);
      innerMesh.rotation.x = -time * 0.7;
      ring1.rotation.z = time * 0.5;
      ring2.rotation.y = -time * 0.4;
      ring3.rotation.x = time * 0.3;
      
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
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 bg-black pointer-events-none" />;
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
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -16;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 16;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
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
  <div className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 text-[10px] sm:text-xs uppercase flex justify-between items-center px-4 py-3 font-light tracking-widest text-neutral-400">
    <div className="flex items-center gap-2 text-white font-bold">
      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_15px_#dc2626]"></div>
      USMAN_UBAID // IMMERSIVE SCROLL KERNEL 60FPS
    </div>
    <div className="text-[#3b82f6] font-bold hidden sm:block">LAHORE, PK [31.5204° N, 74.3587° E]</div>
  </div>
);

const Navigation = () => (
  <nav className="relative z-40 mt-12 w-full px-4 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800/80 gap-4 bg-black/75 backdrop-blur-lg">
    <div>
      <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
        Usman Ubaid <span className="text-[#dc2626]">.</span>
      </h1>
      <p className="text-xs text-neutral-400 tracking-widest mt-1 uppercase">Full-Stack SaaS Architect & 3D Interactive Systems</p>
    </div>
    <div className="flex gap-6 text-xs font-bold tracking-[0.2em] uppercase items-center">
      {['Work', 'Showcase', 'Ecosystem', 'Scrollytelling', 'Contact'].map((item, idx) => (
        <a key={idx} href={`#${item.toLowerCase()}`} className="text-neutral-400 hover:text-[#dc2626] transition-colors">
          [{item}]
        </a>
      ))}
      <a href="#contact" className="bg-white text-black px-4 py-2 hover:bg-[#dc2626] hover:text-white transition-colors">
        Let's talk
      </a>
    </div>
  </nav>
);

const Hero = () => (
  <section id="index" className="relative z-10 w-full px-4 sm:px-8 pt-24 pb-32 border-b border-neutral-800/80 bg-gradient-to-b from-transparent via-black/80 to-black">
    <div className="max-w-6xl">
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-8 font-bold flex items-center gap-2">
        <Crosshair size={16} /> FULL-STACK SaaS & 3D IMMERSIVE WORKSPACE
      </p>
      <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-white">
        I build high-end <br /><span className="stroke-text">SaaS products</span> & web apps that scale.
      </h2>
      <p className="mt-8 text-sm sm:text-lg text-neutral-400 max-w-2xl font-light tracking-wide leading-relaxed">
        I'm Usman Ubaid — a full-stack engineer turning complex startup ideas, medical architectures, and AI/ML model integrations into production-ready web platforms using Next.js, React, SQL, Python, and Vercel.
      </p>

      {/* Stats Counter Bar */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
        <div className="border border-neutral-800 bg-neutral-950/90 p-6 backdrop-blur-xl">
          <div className="text-4xl sm:text-5xl font-black text-white mb-1">4+</div>
          <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Years Shipping Code</div>
        </div>
        <div className="border border-neutral-800 bg-neutral-950/90 p-6 backdrop-blur-xl">
          <div className="text-4xl sm:text-5xl font-black text-[#dc2626] mb-1">8+</div>
          <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">SaaS & Web Apps Launched</div>
        </div>
        <div className="border border-neutral-800 bg-neutral-950/90 p-6 backdrop-blur-xl">
          <div className="text-4xl sm:text-5xl font-black text-[#3b82f6] mb-1">14+</div>
          <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Advanced Technologies</div>
        </div>
      </div>
      
      <div className="mt-12 flex flex-wrap gap-4">
        <a href="#contact" className="inline-flex items-center gap-3 bg-white text-black px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all border border-white shadow-[0_0_25px_rgba(255,255,255,0.25)]">
          Start a project <ArrowUpRight size={18} />
        </a>
        <a href="#work" className="inline-flex items-center gap-3 bg-neutral-950 text-white px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:border-[#3b82f6] transition-all border border-neutral-800">
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
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = 1 - (rect.top / windowHeight);

      cardsRef.current.forEach((card, idx) => {
        if (card) {
          const offset = idx * 0.12;
          const activeProgress = Math.max(0, Math.min(1, (scrollProgress - offset) * 1.5));
          const yOffset = (1 - activeProgress) * 120;
          const zOffset = (1 - activeProgress) * -250;
          const rotateX = (1 - activeProgress) * 20;

          card.style.transform = `translate3d(0, ${yOffset}px, ${zOffset}px) rotateX(${rotateX}deg)`;
          card.style.opacity = activeProgress;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative z-10 w-full py-32 bg-transparent perspective-1000">
      <div className="flex border-y border-neutral-800 px-4 sm:px-8 py-6 items-center justify-between bg-neutral-950/90 backdrop-blur-md mb-16 mx-4 sm:mx-8">
        <h3 className="text-sm tracking-[0.2em] uppercase font-black flex items-center gap-3 text-white">
          <Database size={20} className="text-[#dc2626] animate-pulse" /> Selected Production Work
        </h3>
        <span className="text-xs text-[#dc2626] font-bold uppercase bg-neutral-900 px-3 py-1 border border-neutral-800">NODES: {worksData.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 max-w-7xl mx-auto perspective-1000">
        {worksData.map((work, idx) => (
          <div ref={el => cardsRef.current[idx] = el} key={idx} className="transition-transform duration-75 ease-out will-change-transform">
            <TiltCard className="h-full">
              <a href={work.link} target={work.link !== '#' ? "_blank" : "_self"} rel="noopener noreferrer" className="block relative bg-white text-black border-2 border-white p-8 sm:p-10 h-96 flex flex-col justify-between group hover:border-[#dc2626] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-sm bg-black text-white px-3 py-1 font-black tracking-widest">{work.id}</span>
                  <ArrowUpRight size={28} className="text-black group-hover:text-[#dc2626] transition-transform group-hover:rotate-45" />
                </div>
                <div>
                  <h4 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-4 text-black group-hover:text-[#dc2626] transition-colors">{work.title}</h4>
                  <span className="text-xs text-white bg-[#dc2626] px-3 py-1 font-bold inline-block mb-2 shadow-[0_0_12px_rgba(220,38,38,0.5)]">{work.type}</span>
                  <p className="text-xs text-neutral-800 font-bold">// {work.tech}</p>
                </div>
              </a>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ==========================================================================
   HORIZONTAL SCROLLING SHOWCASE TEMPLATE
   ================================================================---------- */
const HorizontalShowcase = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top / (rect.height - window.innerHeight);
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        const maxTranslate = trackRef.current.scrollWidth - window.innerWidth;
        trackRef.current.style.transform = `translateX(-${scrollProgress * maxTranslate}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} id="showcase" className="relative h-[350vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-12 left-8 md:left-16 z-20">
          <p className="text-[#3b82f6] text-xs font-bold tracking-[0.3em] uppercase mb-2">// HORIZONTAL SCROLLING KERNEL</p>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">Immersive Case Studies</h3>
        </div>
        <div ref={trackRef} className="flex gap-12 pl-8 md:pl-16 w-max pt-24 will-change-transform">
          {[
            { title: "HealthcarePK Engine", tag: "MED-TECH // SQL", desc: "Full-stack medical information and patient management portal with automated record indexing." },
            { title: "Universal Contract Maker", tag: "LEGAL SaaS // VERCEL", desc: "Autonomous document synthesis engine generating custom corporate agreements instantly." },
            { title: "Neural Analytics Hub", tag: "PYTHON ML // REACT", desc: "Predictive data visualization dashboards built for pharmaceutical logistics tracking." },
            { title: "60FPS WebGL Portfolio", tag: "THREE.JS // SHADERS", desc: "High-performance interactive 3D spatial workspace for elite brand presentation." }
          ].map((item, idx) => (
            <div key={idx} className="w-[80vw] md:w-[45vw] h-[60vh] border border-neutral-800 bg-neutral-950/90 p-10 md:p-14 flex flex-col justify-between relative group hover:border-[#3b82f6] transition-colors backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#3b82f6] bg-neutral-900 px-3 py-1 border border-neutral-800">{item.tag}</span>
                <Compass size={24} className="text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">{item.title}</h4>
                <p className="text-sm text-neutral-400 font-mono leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-6 border-t border-neutral-900 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-neutral-400">
                <span>MODULE_0{idx + 1}</span>
                <span className="text-white group-hover:text-[#3b82f6] transition-colors">EXPLORE_NODE &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   ULTRA-CREATIVE SCROLLYTELLING ECOSYSTEM (NEW IMMERSIVE MATRIX ARCHITECTURE)
   ================================================================---------- */
const ImmersiveEcosystemScrollytelling = () => {
  const [activeLayer, setActiveLayer] = useState(0);
  const sectionRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      layersRef.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          setActiveLayer(index);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ecosystemLayers = [
    {
      id: "LAYER_01",
      title: "Frontend & Reactive UI Architecture",
      subtitle: "Immersive User Engagement",
      icon: Code,
      accent: "#dc2626",
      desc: "Crafting blazing-fast reactive interfaces using React, Next.js, and Tailwind CSS. Every microinteraction and magnetic hover state is engineered to maximize user session time and engagement.",
      metrics: ["60 FPS Rendering", "Sub-100ms TTI", "Zero-Latency UI"],
      codeSnippet: `export default function ReactiveClient() {\n  return <motion.div whileHover={{ scale: 1.05 }}>\n    <InteractiveMesh />\n  </motion.div>;\n}`
    },
    {
      id: "LAYER_02",
      title: "Secure SQL & Relational Databases",
      subtitle: "High-Throughput Data Integrity",
      icon: Database,
      accent: "#3b82f6",
      desc: "Designing bulletproof relational database schemas in PostgreSQL and MySQL. Tailored specifically for healthcare records, financial ledgers, and enterprise multi-tenant SaaS hubs.",
      metrics: ["ACID Compliance", "Optimized Query Indexing", "Encrypted State"],
      codeSnippet: `CREATE TABLE clinical_records (\n  id SERIAL PRIMARY KEY,\n  patient_hash VARCHAR(64) UNIQUE,\n  telemetry JSONB,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);`
    },
    {
      id: "LAYER_03",
      title: "Python ML & AI Model Integration",
      subtitle: "Autonomous Decision Pipelines",
      icon: Cpu,
      accent: "#10b981",
      desc: "Integrating custom machine learning models and predictive analytics into web apps. Powering automated legal contract generation and clinical pattern recognition seamlessly.",
      metrics: ["Real-time Inference", "PyTorch / Scikit Pipelines", "Automated Synthesis"],
      codeSnippet: `import torch\nimport torch.nn as nn\n\nclass MedicalPredictor(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.layer = nn.Linear(512, 128)`
    },
    {
      id: "LAYER_04",
      title: "Vercel Edge & Cloud Deployment",
      subtitle: "Global Low-Latency Distribution",
      icon: Globe,
      accent: "#f59e0b",
      desc: "Deploying enterprise-grade microservices and serverless functions directly to global edge networks. Ensuring lightning-fast asset delivery and 99.99% uptime for startups.",
      metrics: ["Edge Computing", "Global CDN Caching", "Instant Invalidation"],
      codeSnippet: `export const config = { runtime: 'edge' };\n\nexport default async function handler(req) {\n  return new Response(JSON.stringify({ status: 'OK' }));\n}`
    }
  ];

  return (
    <section ref={sectionRef} id="ecosystem" className="relative z-10 w-full py-36 bg-black border-b border-neutral-800 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <p className="text-[#dc2626] text-xs font-bold tracking-[0.4em] uppercase mb-4">// IMMERSIVE ECOSYSTEM MATRIX</p>
          <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">Full-Stack Scrollytelling Architecture</h3>
          <p className="text-sm text-neutral-400 font-mono mt-4">Scroll down to inspect each layer of the technical stack in real-time execution.</p>
        </div>

        {/* Dynamic Scrollytelling Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          
          {/* Left Sticky Interactive Terminal / Console */}
          <div className="lg:col-span-5 sticky top-32 border border-neutral-800 bg-neutral-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{ecosystemLayers[activeLayer].id} // INSPECTOR</span>
            </div>

            <div className="mb-6">
              <span className="text-xs font-mono px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 inline-block mb-3">
                {ecosystemLayers[activeLayer].subtitle}
              </span>
              <h4 className="text-2xl font-bold uppercase text-white tracking-tight">{ecosystemLayers[activeLayer].title}</h4>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ecosystemLayers[activeLayer].metrics.map((m, idx) => (
                <div key={idx} className="bg-black border border-neutral-900 p-3 text-center">
                  <span className="text-[10px] font-mono text-neutral-400 block">{m}</span>
                </div>
              ))}
            </div>

            {/* Live Code Telemetry Box */}
            <div className="bg-black border border-neutral-800 p-4 rounded text-xs font-mono text-neutral-300 overflow-x-auto relative group">
              <div className="absolute top-2 right-2 text-neutral-600"><TerminalIcon size={16} /></div>
              <pre className="text-[#dc2626]">{ecosystemLayers[activeLayer].codeSnippet}</pre>
            </div>
          </div>

          {/* Right Scrolling Content Steps */}
          <div className="lg:col-span-7 space-y-48 pt-12">
            {ecosystemLayers.map((layer, idx) => {
              const IconComp = layer.icon;
              return (
                <div 
                  key={idx} 
                  ref={el => layersRef.current[idx] = el}
                  className={`p-8 sm:p-12 border transition-all duration-500 bg-neutral-950/80 backdrop-blur-lg ${activeLayer === idx ? 'border-[#dc2626] shadow-[0_0_40px_rgba(220,38,38,0.2)] scale-[1.02]' : 'border-neutral-900 opacity-40'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-mono text-neutral-500">{layer.id}</span>
                    <div className="p-3 bg-black border border-neutral-800 text-[#dc2626]">
                      <IconComp size={28} />
                    </div>
                  </div>
                  <h4 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-4">{layer.title}</h4>
                  <p className="text-sm text-neutral-400 font-mono leading-relaxed mb-6">{layer.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {layer.metrics.map((met, mIdx) => (
                      <span key={mIdx} className="text-[10px] bg-black border border-neutral-800 px-3 py-1 font-mono text-neutral-300">
                        // {met}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

/* ==========================================================================
   STANDARD SCROLLYTELLING NARRATIVE MILESTONES
   ================================================================---------- */
const ScrollytellingSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      stepsRef.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
          setActiveStep(index);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const milestones = [
    { phase: "PHASE_01 // ARCHITECTING", title: "System Scoping & Database Modeling", desc: "Defining high-throughput database schemas in PostgreSQL, establishing secure REST endpoints, and designing component hierarchies." },
    { phase: "PHASE_02 // ENGINEERING", title: "Full-Stack React & Next.js Build", desc: "Developing responsive SaaS interfaces using Tailwind CSS, implementing server actions, and configuring lightning-fast Vercel edge deployment." },
    { phase: "PHASE_03 // 3D KERNEL INTEGRATION", title: "WebGL Shaders & Spatial Shards", desc: "Embedding Three.js particle matrices, raycasted mouse physics, and hardware-accelerated 60FPS visual depth into user interfaces." },
    { phase: "PHASE_04 // DEPLOYMENT & SCALE", title: "Production Launch & AI Pipelines", desc: "Connecting Python machine learning models, optimizing performance metrics, and pushing live to production environments." }
  ];

  return (
    <section id="scrollytelling" className="relative z-10 w-full py-32 bg-black border-b border-neutral-800 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Sticky Visual Indicator Column */}
        <div className="lg:col-span-5 sticky top-32 border border-neutral-800 bg-neutral-950 p-8 sm:p-10 backdrop-blur-xl">
          <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-4">// NARRATIVE KERNEL PROGRESSION</p>
          <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6">Development Lifecycle</h3>
          <div className="space-y-4 font-mono text-xs">
            {milestones.map((m, idx) => (
              <div key={idx} className={`p-4 border transition-all flex items-center justify-between ${activeStep === idx ? 'border-[#dc2626] bg-neutral-900 text-white' : 'border-neutral-900 bg-black text-neutral-500'}`}>
                <span>{m.phase}</span>
                {activeStep === idx && <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-ping"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling Narrative Steps Column */}
        <div className="lg:col-span-7 space-y-32">
          {milestones.map((m, idx) => (
            <div key={idx} ref={el => stepsRef.current[idx] = el} className="min-h-[60vh] flex flex-col justify-center border-l-2 border-neutral-800 pl-8 sm:pl-12">
              <span className="text-xs font-mono text-[#dc2626] mb-3 tracking-widest">{m.phase}</span>
              <h4 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">{m.title}</h4>
              <p className="text-base text-neutral-400 font-mono leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const Capabilities = () => (
  <section id="expertise" className="relative z-10 w-full border-b border-neutral-800 bg-black px-4 sm:px-8 py-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-3 mb-6 text-white">
          <Cpu size={16} className="text-[#dc2626]" /> Core Expertise
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">Comprehensive technical stack covering modern web applications, relational databases, cloud deployment, and AI pipelines.</p>
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {[
          { icon: Code, title: 'Full-Stack Development', desc: 'React, Next.js, Node.js, and robust backend integrations.' },
          { icon: Server, title: 'Database & SQL Architecture', desc: 'PostgreSQL, MySQL, and optimized relational data schemas.' },
          { icon: Box, title: 'WebGL & Three.js 3D', desc: 'Immersive browser experiences and high-performance visual engines.' },
          { icon: Layers, title: 'Python & AI Models', desc: 'Tailored machine learning models and medical-tech integrations.' }
        ].map((cap, idx) => (
          <div key={idx} className="flex gap-4 p-5 border border-neutral-800 bg-neutral-950/80 hover:border-[#dc2626]/50 transition-colors">
            <cap.icon size={24} className="text-[#dc2626] shrink-0 mt-1" />
            <div>
              <h5 className="text-sm font-bold uppercase tracking-widest mb-2 text-white">{cap.title}</h5>
              <p className="text-xs text-neutral-400">{cap.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="relative z-10 w-full bg-black">
    <div className="px-4 sm:px-8 py-24 border-b border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase text-white">Let's build<br/>something great.</h2>
        <p className="text-xs text-neutral-400 mt-6 tracking-widest uppercase font-bold">Reach out directly to discuss your SaaS or web platform.</p>
        <div className="mt-8 flex flex-col gap-4 text-xs font-bold tracking-widest">
          <a href="mailto:dev@healthcarepk.online" className="text-neutral-300 hover:text-[#dc2626] transition-colors">DEV@HEALTHCAREPK.ONLINE</a>
          <a href="tel:+923041381382" className="text-neutral-300 hover:text-[#dc2626] transition-colors">+92 304 1381382</a>
          <span className="text-[#3b82f6]">LAHORE, PAKISTAN [31.5204° N, 74.3587° E]</span>
        </div>
      </div>
      <div>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="YOUR EMAIL" required className="bg-neutral-900 border border-neutral-800 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors" />
          <textarea placeholder="PROJECT DETAILS / MESSAGE" rows="4" required className="bg-neutral-900 border border-neutral-800 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors"></textarea>
          <button type="submit" className="bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">Send Message</button>
        </form>
      </div>
    </div>
    <div className="px-4 sm:px-8 py-6 text-[10px] text-neutral-500 tracking-widest uppercase font-bold flex justify-between">
      <div>&copy; {new Date().getFullYear()} USMAN UBAID // ALL RIGHTS RESERVED.</div>
      <div>60FPS_PORTFOLIO_ACTIVE</div>
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
        <ImmersiveEcosystemScrollytelling />
        <ScrollytellingSection />
        <Capabilities />
        <Footer />
      </main>
    </div>
  );
}
