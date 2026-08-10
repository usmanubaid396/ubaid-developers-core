import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers, Shield, 
  CpuIcon, Globe, TerminalSquare, Workflow, Flame, Layers3, Sparkles
} from 'lucide-react';

const WebGLEngine = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.010);
    
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.z = 50;
    
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // Advanced Lighting Setup for SaaS/Cyber Look
    const ambientLight = new THREE.AmbientLight(0x111111, 1.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xdc2626, 6, 150);
    pointLight1.position.set(20, 20, 30);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 4, 150);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Primary Multi-Layered 3D Core Matrix
    const coreGroup = new THREE.Group();
    
    const coreGeo = new THREE.IcosahedronGeometry(10, 2);
    const coreMat = new THREE.MeshStandardMaterial({ 
      color: 0x050505, 
      roughness: 0.15, 
      metalness: 0.95,
      wireframe: false
    });
    const coreMeshSolid = new THREE.Mesh(coreGeo, coreMat);
    
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: true, transparent: true, opacity: 0.8 });
    const coreMeshWire = new THREE.Mesh(coreGeo, wireMat);

    // Secondary Inner Pulsing Globe
    const innerGeo = new THREE.IcosahedronGeometry(6, 1);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.5 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);

    // Outer Orbiting Torus Rings (60fps Watch-style mechanics)
    const ringGeo = new THREE.TorusGeometry(16, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;

    const ringGeo2 = new THREE.TorusGeometry(19, 0.05, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    ring2.rotation.y = Math.PI / 4;

    const hitBoxGeo = new THREE.SphereGeometry(14, 16, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const coreHitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);

    coreGroup.add(coreMeshSolid);
    coreGroup.add(coreMeshWire);
    coreGroup.add(innerMesh);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(coreHitBox);
    scene.add(coreGroup);

    // Floating Interactive 3D Shards Field
    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(1.2, 0);
    const shardMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.8 });
    const shards = [];
    
    for(let i = 0; i < 55; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60);
      shard.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.06,
        rotSpeedY: (Math.random() - 0.5) * 0.06,
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
    const particleCount = 3500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleOriginalPos = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i += 3) {
      const r = 20 + Math.random() * 60;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      particlePos[i] = x; particlePos[i+1] = y; particlePos[i+2] = z;
      particleOriginalPos[i] = x; particleOriginalPos[i+1] = y; particleOriginalPos[i+2] = z;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Physics & 3D Raycasting Repulsion
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
      
      currentScroll += (targetScroll - currentScroll) * 0.08;
      
      // Dynamic Core Morphing & Rotation
      const targetCoreScale = isCoreHovered ? 1.4 : 1.0;
      const pulse = Math.sin(time * 4) * 0.07;
      
      coreTargetScale.setScalar(targetCoreScale + pulse);
      coreGroup.scale.lerp(coreTargetScale, 0.1);
      
      coreGroup.rotation.y = time * 0.3 + (currentScroll * 0.002);
      coreGroup.rotation.x = Math.sin(time * 0.2) * 0.2 + (currentScroll * 0.001);
      innerMesh.rotation.x = -time * 0.5;
      ring1.rotation.z = time * 0.4;
      ring2.rotation.y = -time * 0.3;
      
      // Cinematic Camera Kinematics (60fps luxury watch style reaction)
      const camTargetX = (mouse.x * 12);
      const camTargetY = (-(currentScroll * 0.018) + (mouse.y * 12));
      const camTargetZ = 50 - (currentScroll * 0.03);
      
      camera.position.x += (camTargetX - camera.position.x) * 0.07;
      camera.position.y += (camTargetY - camera.position.y) * 0.07;
      camera.position.z += (camTargetZ - camera.position.z) * 0.07;
      camera.lookAt(0, 0, 0);

      // Shard Float & Repulsion Physics
      shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.position.y = shard.userData.originY + Math.sin(time * 3 + shard.userData.phase) * 2.2;
        
        const distToMouse = shard.position.distanceTo(targetMouse);
        if(distToMouse < 22) {
          const dir = shard.position.clone().sub(targetMouse).normalize();
          shard.position.add(dir.multiplyScalar(0.35));
        } else {
          shard.position.x += (shard.userData.originX - shard.position.x) * 0.06;
          shard.position.z += (shard.userData.originZ - shard.position.z) * 0.06;
        }
      });

      // Particle Repulsion
      const positions = particleGeo.attributes.position.array;
      for(let i = 0; i < positions.length; i += 3) {
        const px = positions[i];
        const py = positions[i+1];
        const pz = positions[i+2];
        const dx = px - targetMouse.x;
        const dy = py - targetMouse.y;
        const dz = pz - targetMouse.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if(dist < 18) {
          const force = (18 - dist) * 0.18;
          positions[i] += (dx / dist) * force;
          positions[i+1] += (dy / dist) * force;
          positions[i+2] += (dz / dist) * force;
        }

        positions[i] += (particleOriginalPos[i] - positions[i]) * 0.07;
        positions[i+1] += (particleOriginalPos[i+1] - positions[i+1]) * 0.07;
        positions[i+2] += (particleOriginalPos[i+2] - positions[i+2]) * 0.07;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.05;

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

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 14;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
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
      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_12px_#dc2626]"></div>
      SYS_ONLINE // 60FPS KERNEL ACTIVE
    </div>
    <div className="text-[#3b82f6] font-bold hidden sm:block">LAHORE, PK [31.5204° N, 74.3587° E]</div>
  </div>
);

const Navigation = () => (
  <nav className="relative z-40 mt-12 w-full px-4 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800/80 gap-4 bg-black/75 backdrop-blur-lg">
    <div>
      <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
        UBAID DEVELOPERS <span className="text-[#dc2626]">_</span>
      </h1>
      <p className="text-xs text-neutral-400 tracking-widest mt-1 uppercase">SaaS Architecture & High-Performance 3D Systems</p>
    </div>
    <div className="flex gap-6 text-xs font-bold tracking-[0.2em] uppercase">
      {['Index', 'Architecture', 'Ecosystem', 'Specs', 'Initiate'].map((item, idx) => (
        <a key={idx} href={`#${item.toLowerCase()}`} className="text-neutral-400 hover:text-[#dc2626] transition-colors">
          [{item}]
        </a>
      ))}
    </div>
  </nav>
);

const Hero = () => (
  <section id="index" className="relative z-10 w-full px-4 sm:px-8 pt-24 pb-32 border-b border-neutral-800/80 bg-gradient-to-b from-transparent via-black/80 to-black">
    <div className="max-w-6xl">
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-8 font-bold flex items-center gap-2">
        <Crosshair size={16} /> OP_DIRECTIVE_004 // 60FPS INTERACTIVE MATRIX
      </p>
      <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-white">
        Ubaid <br /><span className="stroke-text">Developers</span>
      </h2>
      <div className="mt-16 max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-300 bg-neutral-950/90 p-6 border border-neutral-800 backdrop-blur-xl shadow-2xl">
        <div>
          <strong className="text-white block mb-2 text-[10px] tracking-widest uppercase text-[#dc2626]">Mission_Parameters</strong>
          Engineering industrial-grade SaaS applications, advanced WebGL interfaces, and secure medical data infrastructures with luxury watch-level smoothness.
        </div>
        <div>
          <strong className="text-white block mb-2 text-[10px] tracking-widest uppercase text-[#3b82f6]">Core_Stack</strong>
          React_18 // Three.js // Next.js // Python ML // Tailwind // Vercel Edge
        </div>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <a href="#initiate" className="inline-flex items-center gap-3 bg-white text-black px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all border border-white shadow-[0_0_25px_rgba(255,255,255,0.25)]">
          Deploy Solution <ArrowUpRight size={18} />
        </a>
        <a href="#architecture" className="inline-flex items-center gap-3 bg-neutral-950 text-white px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:border-[#3b82f6] transition-all border border-neutral-800">
          Explore Nodes <Activity size={18} className="text-[#3b82f6]" />
        </a>
      </div>
    </div>
  </section>
);

const worksData = [
  { id: 'SYS.01', title: 'HealthcarePK', type: 'Healthcare Digital Infrastructure', tech: 'React / Node / PostgreSQL', link: 'https://healthcarepk.online' },
  { id: 'SYS.02', title: 'Contract Maker', type: 'Legal SaaS Platform & Generator', tech: 'Next.js / Tailwind / Vercel', link: 'https://universal-contract-maker.vercel.app/' },
  { id: 'SYS.03', title: 'Pharma Ops', type: 'Pharmaceutical Mfg & ERP', tech: 'Full-Stack / Python / WebGL', link: '#' },
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
    <section ref={sectionRef} id="architecture" className="relative z-10 w-full py-32 bg-transparent perspective-1000">
      <div className="flex border-y border-neutral-800 px-4 sm:px-8 py-6 items-center justify-between bg-neutral-950/90 backdrop-blur-md mb-16 mx-4 sm:mx-8">
        <h3 className="text-sm tracking-[0.2em] uppercase font-black flex items-center gap-3 text-white">
          <Database size={20} className="text-[#dc2626] animate-pulse" /> Selected SaaS Architecture Nodes
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

// Multi-Template Section 3: SaaS Ecosystem Templates
const EcosystemTemplates = () => (
  <section id="ecosystem" className="relative z-10 w-full py-32 border-b border-neutral-800 bg-neutral-950/70 px-4 sm:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <p className="text-[#3b82f6] text-xs font-bold tracking-[0.3em] uppercase mb-2">// TEMPLATE_MODULES_03 // MULTI-TIER ECOSYSTEM</p>
        <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">Enterprise SaaS Solutions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TiltCard>
          <div className="border border-neutral-800 bg-black/90 p-8 h-full flex flex-col justify-between relative group hover:border-[#dc2626] transition-all">
            <div>
              <div className="text-[#dc2626] mb-4"><Shield size={28} /></div>
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1 text-neutral-400 uppercase tracking-widest">MODULE_ALPHA</span>
              <h4 className="text-xl font-bold uppercase text-white mt-4 mb-2">Medical Cloud ERP</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">Secure multi-tenant hospital & pharmaceutical management pipeline ensuring HIPAA compliance and zero latency.</p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs font-bold">
              <span className="text-[#dc2626]">DEPLOYED</span>
              <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="border border-neutral-800 bg-black/90 p-8 h-full flex flex-col justify-between relative group hover:border-[#3b82f6] transition-all">
            <div>
              <div className="text-[#3b82f6] mb-4"><Workflow size={28} /></div>
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1 text-neutral-400 uppercase tracking-widest">MODULE_BETA</span>
              <h4 className="text-xl font-bold uppercase text-white mt-4 mb-2">Autonomous Contract Engine</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">AI-driven document generation platform that compiles complex corporate agreements in real-time via Vercel Edge.</p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs font-bold">
              <span className="text-[#3b82f6]">ACTIVE SaaS</span>
              <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="border border-neutral-800 bg-black/90 p-8 h-full flex flex-col justify-between relative group hover:border-white transition-all">
            <div>
              <div className="text-white mb-4"><Flame size={28} /></div>
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1 text-neutral-400 uppercase tracking-widest">MODULE_GAMMA</span>
              <h4 className="text-xl font-bold uppercase text-white mt-4 mb-2">WebGL 3D Portfolio Suite</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">Immersive 60fps hardware-accelerated interactive web engine built for elite brand presence and high-end conversion.</p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs font-bold">
              <span className="text-white">LIVE ENGINE</span>
              <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  </section>
);

const Capabilities = () => (
  <section id="specs" className="relative z-10 w-full border-b border-neutral-800 bg-black px-4 sm:px-8 py-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-3 mb-6 text-white">
          <Cpu size={16} className="text-[#dc2626]" /> System Specifications
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">Industrial-grade engineering methodologies delivering uncompromised high-throughput performance across all modules.</p>
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {[
          { icon: Code, title: 'Full-Stack Web Dev', desc: 'Microservice architectures built for zero-latency execution.' },
          { icon: Server, title: 'SaaS Engineering', desc: 'Scalable cloud-native applications like Universal Contract Maker.' },
          { icon: Box, title: 'WebGL & Shaders', desc: 'Hardware-accelerated 3D rendering with React and Three.js.' },
          { icon: Layers, title: 'Python ML & Medical', desc: 'Secure data pipelines tailored for healthcare operations.' }
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
  <footer id="initiate" className="relative z-10 w-full bg-black">
    <div className="px-4 sm:px-8 py-24 border-b border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase text-white">Initiate<br/>Sequence</h2>
        <p className="text-xs text-neutral-400 mt-6 tracking-widest uppercase font-bold">Establish secure connection via encrypted terminal dispatch.</p>
        <div className="mt-8 flex flex-col gap-4 text-xs font-bold tracking-widest">
          <a href="mailto:dev@healthcarepk.online" className="text-neutral-300 hover:text-[#dc2626] transition-colors">DEV@HEALTHCAREPK.ONLINE</a>
          <a href="tel:+923041381382" className="text-neutral-300 hover:text-[#dc2626] transition-colors">+92 304 1381382</a>
          <span className="text-[#3b82f6]">LAHORE, PAKISTAN [31.5204° N, 74.3587° E]</span>
        </div>
      </div>
      <div>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="ENTER_IDENTIFIER (EMAIL)" required className="bg-neutral-900 border border-neutral-800 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors" />
          <textarea placeholder="DEFINE_PARAMETERS (MESSAGE)" rows="4" required className="bg-neutral-900 border border-neutral-800 p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors"></textarea>
          <button type="submit" className="bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">Execute Command</button>
        </form>
      </div>
    </div>
    <div className="px-4 sm:px-8 py-6 text-[10px] text-neutral-500 tracking-widest uppercase font-bold flex justify-between">
      <div>&copy; {new Date().getFullYear()} UBAID DEVELOPERS // ALL RIGHTS RESERVED.</div>
      <div>60FPS_SECURE_KERNEL_ACTIVE</div>
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
        <EcosystemTemplates />
        <Capabilities />
        <Footer />
      </main>
    </div>
  );
}
