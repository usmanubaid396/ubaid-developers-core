import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers
} from 'lucide-react';

const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('.magnetic-target, a, button, input, textarea')) {
        cursorRef.current?.classList.add('hovering');
        dotRef.current?.classList.add('hovering');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('.magnetic-target, a, button, input, textarea')) {
        cursorRef.current?.classList.remove('hovering');
        dotRef.current?.classList.remove('hovering');
      }
    };

    const render = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
      }
      requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    const raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block"></div>
      <div ref={dotRef} className="custom-cursor-dot hidden md:block"></div>
    </>
  );
};

const WebGLEngine = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.012);
    
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 65;
    
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.8, 0.5, 0.1);
    bloomPass.threshold = 0.08;
    bloomPass.strength = 2.4;
    bloomPass.radius = 0.9;
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Enhanced Multi-Layered Core Matrix
    const coreGroup = new THREE.Group();
    
    const coreGeo = new THREE.IcosahedronGeometry(13, 2);
    const coreMatSolid = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const coreMeshSolid = new THREE.Mesh(coreGeo, coreMatSolid);
    
    const coreMatWire = new THREE.LineBasicMaterial({ color: 0xdc2626, transparent: true, opacity: 0.4 });
    const wireframe = new THREE.WireframeGeometry(coreGeo);
    const coreMeshWire = new THREE.LineSegments(wireframe, coreMatWire);
    
    const innerGeo = new THREE.IcosahedronGeometry(9, 1);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, wireframe: true, transparent: true, opacity: 0.3 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);

    const outerGeo = new THREE.DodecahedronGeometry(18, 0);
    const outerMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
    const outerWire = new THREE.WireframeGeometry(outerGeo);
    const outerMesh = new THREE.LineSegments(outerWire, outerMat);

    const hitBoxGeo = new THREE.SphereGeometry(18, 16, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const coreHitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);

    coreGroup.add(coreMeshSolid);
    coreGroup.add(coreMeshWire);
    coreGroup.add(innerMesh);
    coreGroup.add(outerMesh);
    coreGroup.add(coreHitBox);
    scene.add(coreGroup);

    // Dynamic Data Shards
    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(1.4, 0);
    const shardMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 });
    const shards = [];
    
    for(let i = 0; i < 50; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 90, Math.random() * 50 + 5);
      shard.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.06,
        rotSpeedY: (Math.random() - 0.5) * 0.06,
        floatSpeed: Math.random() * 0.02 + 0.01,
        originY: shard.position.y,
        phase: Math.random() * Math.PI * 2
      };
      shards.push(shard);
      shardsGroup.add(shard);
    }
    scene.add(shardsGroup);

    // High-Density Particle Matrix
    const particleCount = 4000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleOriginalPos = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i += 3) {
      const r = 35 + Math.random() * 70;
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

    // Cyber Grid Floor
    const gridGeo = new THREE.PlaneGeometry(600, 600, 120, 120);
    const gridMat = new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.5 });
    const gridWire = new THREE.WireframeGeometry(gridGeo);
    const grid = new THREE.LineSegments(gridWire, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -35;
    scene.add(grid);

    // Raycasting & Interaction Physics
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

    let shockwaveIntensity = 0;
    const onClick = () => { shockwaveIntensity = 1.2; };
    window.addEventListener('click', onClick);

    let isUIHovered = false;
    const onProjectHover = (e) => { isUIHovered = !!e.detail.id; };
    window.addEventListener('projectHover', onProjectHover);

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
      if (shockwaveIntensity > 0) shockwaveIntensity -= 0.02;
      
      const targetCoreScale = isCoreHovered ? 1.35 : (isUIHovered ? 1.2 : 1.0);
      const baseRotationSpeed = (isCoreHovered || isUIHovered) ? 0.45 : 0.18;
      const pulse = Math.sin(time * 3.5) * 0.08;
      
      coreTargetScale.setScalar(targetCoreScale + pulse);
      coreGroup.scale.lerp(coreTargetScale, 0.1);
      
      coreGroup.rotation.y = time * baseRotationSpeed + (currentScroll * 0.002);
      coreGroup.rotation.z = time * (baseRotationSpeed * 0.6) + (currentScroll * 0.001);
      innerMesh.rotation.x = -time * (baseRotationSpeed + 0.25);
      outerMesh.rotation.y = -time * (baseRotationSpeed * 0.4);
      
      const targetColor = isCoreHovered ? new THREE.Color(0xffffff) : new THREE.Color(0xdc2626);
      coreMatWire.color.lerp(targetColor, 0.1);
      
      const camTargetX = mouse.x * 14;
      const camTargetY = -(currentScroll * 0.018) + (mouse.y * 14);
      const camTargetZ = 65 - (currentScroll * 0.03);
      
      camera.position.x += (camTargetX - camera.position.x) * 0.06;
      camera.position.y += (camTargetY - camera.position.y) * 0.06;
      camera.position.z += (camTargetZ - camera.position.z) * 0.06;
      
      if (shockwaveIntensity > 0) {
        camera.position.x += (Math.random() - 0.5) * shockwaveIntensity * 2.5;
        camera.position.y += (Math.random() - 0.5) * shockwaveIntensity * 2.5;
      }
      
      camera.lookAt(0,0,0);
      grid.position.z = (time * (isUIHovered ? 30 : 18)) % 6;
      
      shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.position.y = shard.userData.originY + Math.sin(time * 2.2 + shard.userData.phase) * 2.5;
        const distToMouse = shard.position.distanceTo(targetMouse);
        if(distToMouse < 22) {
           const dir = shard.position.clone().sub(targetMouse).normalize();
           shard.position.add(dir.multiplyScalar(0.25));
        }
      });

      const positions = particleGeo.attributes.position.array;
      const forceRadius = isUIHovered ? 28 : 20;
      const v = new THREE.Vector3();
      
      for(let i = 0; i < positions.length; i += 3) {
        v.set(positions[i], positions[i+1], positions[i+2]);
        const distToMouse = v.distanceTo(targetMouse);
        const distToCenter = v.distanceTo(new THREE.Vector3(0,0,0));
        
        if(distToMouse < forceRadius) {
          const dir = v.clone().sub(targetMouse).normalize();
          const force = (forceRadius - distToMouse) * (isCoreHovered ? 0.18 : 0.1); 
          positions[i] += dir.x * force;
          positions[i+1] += dir.y * force;
          positions[i+2] += dir.z * force;
        }
        
        if (shockwaveIntensity > 0) {
          const ripple = Math.sin(distToCenter * 0.4 - time * 18) * shockwaveIntensity * 2.5;
          const dir = v.clone().normalize();
          positions[i] += dir.x * ripple;
          positions[i+1] += dir.y * ripple;
          positions[i+2] += dir.z * ripple;
        }
        
        positions[i] += (particleOriginalPos[i] - positions[i]) * 0.07;
        positions[i+1] += (particleOriginalPos[i+1] - positions[i+1]) * 0.07;
        positions[i+2] += (particleOriginalPos[i+2] - positions[i+2]) * 0.07;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = time * (isUIHovered ? 0.12 : 0.06);

      composer.render();
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('projectHover', onProjectHover);
      cancelAnimationFrame(rafId);
      
      coreGeo.dispose(); coreMatSolid.dispose(); coreMatWire.dispose();
      innerGeo.dispose(); innerMat.dispose(); outerGeo.dispose(); outerMat.dispose();
      hitBoxGeo.dispose(); hitBoxMat.dispose(); wireframe.dispose(); outerWire.dispose();
      particleGeo.dispose(); particleMat.dispose(); gridGeo.dispose(); gridMat.dispose();
      planeGeo.dispose(); planeMat.dispose(); shardGeo.dispose(); shardMat.dispose();
      
      composer.dispose();
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 bg-black pointer-events-none" />;
};

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  let reqId = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    targetRotation.current = { x: rotateX, y: rotateY };
  };

  const handleMouseLeave = () => {
    targetRotation.current = { x: 0, y: 0 };
  };

  const updateRotation = () => {
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.12;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.12;

    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    reqId.current = requestAnimationFrame(updateRotation);
  };

  useEffect(() => {
    reqId.current = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(reqId.current);
  }, []);

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out transform-gpu preserve-3d ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

const SystemStatus = () => {
  const [time, setTime] = useState(new Date().toISOString());
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toISOString()), 1000);
    const handleMouseMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => { clearInterval(timer); window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 bg-black/85 backdrop-blur-md brutalist-border-b text-[10px] sm:text-xs uppercase flex flex-wrap justify-between items-center px-4 py-3 font-light tracking-widest text-neutral-400 gap-y-2 pointer-events-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 text-white font-bold">
          <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_12px_#dc2626]"></div>
          SYS_ONLINE
        </span>
        <span className="hidden sm:inline-block text-white font-bold">PAKISTAN // UBAID_DEV_KERNEL</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="hidden md:inline-block text-[#dc2626] font-bold">LAHORE, PK [31.5204° N, 74.3587° E]</span>
        <span className="hidden lg:inline-block">X:{coords.x.toString().padStart(4, '0')} Y:{coords.y.toString().padStart(4, '0')}</span>
        <span>{time.split('T')[1].split('.')[0]} UTC</span>
      </div>
    </div>
  );
};

const Navigation = () => (
  <nav className="relative z-40 mt-16 w-full px-4 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center brutalist-border-b gap-4 md:gap-0 bg-black/50 backdrop-blur-md">
    <div className="magnetic-target group">
      <h1 className="text-2xl font-bold tracking-tighter leading-none flex items-center gap-2 text-white group-hover:text-[#dc2626] transition-colors">
        UBAID DEVELOPERS <span className="text-[#dc2626] group-hover:text-white">_</span>
      </h1>
      <p className="text-xs text-neutral-500 tracking-widest mt-1 uppercase">Applied Creative Engineering</p>
    </div>
    <div className="flex gap-6 text-xs font-bold tracking-[0.2em] uppercase">
      {['Index', 'Architecture', 'Specs', 'Initiate'].map((item, idx) => (
        <a key={idx} href={`#${item.toLowerCase()}`} className="magnetic-target text-neutral-400 hover:text-[#dc2626] transition-colors duration-200">
          [{item}]
        </a>
      ))}
    </div>
  </nav>
);

const Hero = () => (
  <section id="index" className="relative z-10 w-full px-4 sm:px-8 pt-24 pb-32 brutalist-border-b bg-gradient-to-b from-transparent to-black/90">
    <div className="max-w-6xl">
      <p className="text-[#dc2626] text-xs sm:text-sm tracking-[0.3em] mb-8 flex items-center gap-3 font-bold">
        <Crosshair size={16} /> OP_DIRECTIVE_002 // PAKISTAN
      </p>
      <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase magnetic-target inline-block">
        Ubaid
        <br />
        <span className="stroke-text">Developers</span>
        <span className="inline-block w-4 h-4 sm:w-6 sm:h-6 bg-[#dc2626] rounded-full ml-4 animate-pulse shadow-[0_0_25px_#dc2626]"></span>
      </h2>
      
      <div className="mt-16 max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-400 font-light tracking-wide bg-black/70 p-6 brutalist-border backdrop-blur-md">
        <div>
          <strong className="text-white block mb-2 text-[10px] tracking-widest uppercase">Mission_Parameters</strong>
          Architecting industrial-grade digital experiences. We transform complex logic into uncompromised raw utility and visual power.
        </div>
        <div>
          <strong className="text-white block mb-2 text-[10px] tracking-widest uppercase">Tech_Stack</strong>
          React_18 // Three.js // Python // WebGL // Tailwind_CSS // Vercel
        </div>
      </div>
      
      <div className="mt-12 flex flex-wrap gap-4">
        <a href="#initiate" className="magnetic-target inline-flex items-center gap-3 bg-white text-black px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all group brutalist-border">
          Deploy Project 
          <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
        </a>
      </div>
    </div>
  </section>
);

const worksData = [
  { 
    id: 'SYS.01', 
    title: 'HealthcarePK', 
    type: 'Healthcare Digital Infrastructure', 
    tech: 'React / Node / PostgreSQL',
    link: 'https://healthcarepk.online'
  },
  { 
    id: 'SYS.02', 
    title: 'Contract Maker', 
    type: 'Legal SaaS Platform & Generator', 
    tech: 'Next.js / Tailwind / Vercel',
    link: 'https://universal-contract-maker.vercel.app/'
  },
  { 
    id: 'SYS.03', 
    title: 'Pharma Ops', 
    type: 'Pharmaceutical Mfg & ERP', 
    tech: 'Full-Stack / Python / WebGL',
    link: '#'
  },
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
           const offset = idx * 0.15;
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
    <section ref={sectionRef} id="architecture" className="relative z-10 w-full py-32 bg-transparent perspective-1000 pointer-events-none">
      <div className="pointer-events-auto flex border-y-2 border-white/20 px-4 sm:px-8 py-6 items-center justify-between bg-white/5 backdrop-blur-md mb-16 mx-4 sm:mx-8">
        <h3 className="text-sm tracking-[0.2em] uppercase font-black flex items-center gap-3 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          <Database size={20} className="text-[#dc2626] animate-pulse" /> Selected Architecture
        </h3>
        <span className="text-xs text-[#dc2626] font-bold hidden sm:inline-block tracking-widest uppercase bg-white/10 px-3 py-1 brutalist-border">
          QUERY_RESULT: {worksData.length} NODES
        </span>
      </div>
      
      <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 max-w-7xl mx-auto perspective-1000">
        {worksData.map((work, idx) => (
          <div 
            ref={el => cardsRef.current[idx] = el} 
            key={idx} 
            className="transition-transform duration-75 ease-out will-change-transform"
          >
            <TiltCard className="h-full">
              <a 
                href={work.link}
                target={work.link !== '#' ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('projectHover', { detail: { id: work.id } }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('projectHover', { detail: { id: null } }))}
                className="magnetic-target block relative bg-white border-2 border-white p-8 sm:p-12 h-96 flex flex-col justify-between overflow-hidden group transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:border-[#dc2626]"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMjIyIiAvPgo8L3N2Zz4=')] opacity-[0.03] group-hover:opacity-10 transition-opacity z-0 pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(40px)' }}>
                  <span className="text-sm bg-black text-white px-3 py-1 font-black tracking-widest brutalist-border">{work.id}</span>
                  {work.link !== '#' ? (
                    <ArrowUpRight size={32} className="text-black group-hover:text-[#dc2626] transition-colors group-hover:rotate-45" />
                  ) : (
                    <Activity size={32} className="text-black group-hover:text-[#dc2626] transition-colors animate-pulse" />
                  )}
                </div>
                
                <div className="relative z-10" style={{ transform: 'translateZ(60px)' }}>
                  <h4 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-6 text-black group-hover:text-[#dc2626] transition-colors leading-[0.9]">{work.title}</h4>
                  <div className="flex flex-col gap-3 text-[10px] sm:text-xs font-bold tracking-[0.1em] text-neutral-600 uppercase">
                    <span className="text-white bg-[#dc2626] w-fit px-3 py-1.5 shadow-[0_0_15px_rgba(220,38,38,0.5)]">{work.type}</span>
                    <span className="mt-2 text-black font-black">// {work.tech}</span>
                  </div>
                </div>
              </a>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
};

const Capabilities = () => (
  <section id="specs" className="relative z-10 w-full brutalist-border-b bg-black px-4 sm:px-8 py-24 sm:py-32">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-3 mb-6 text-white">
            <Cpu size={16} className="text-[#dc2626]" /> Specifications
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs font-light tracking-wide">
            Our engineering methodology strips away abstraction layers, engaging directly with core web APIs, robust backend architectures, and machine learning models to deliver uncompromised performance.
          </p>
        </div>
        
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {[
            { icon: Code, title: 'Full-Stack Web Dev', desc: 'End-to-end monolithic and microservice architectures built for high-throughput data processing and zero-latency rendering.' },
            { icon: Server, title: 'SaaS Engineering', desc: 'Robust, scalable multi-tenant infrastructure designed for cloud-native applications like Universal Contract Maker.' },
            { icon: Box, title: 'WebGL & Shaders', desc: 'Hardware-accelerated 3D rendering, custom GLSL shaders, and interactive DOM manipulation using React and Three.js.' },
            { icon: Layers, title: 'Python ML & Medical', desc: 'Integration of machine learning models and secure data pipelines specifically tailored for healthcare and pharmaceutical operations.' }
          ].map((cap, idx) => (
            <div key={idx} className="flex gap-5 group magnetic-target p-4 -m-4 rounded hover:bg-neutral-900/60 transition-colors">
              <div className="w-14 h-14 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-500 group-hover:border-[#dc2626] group-hover:text-[#dc2626] transition-colors bg-black">
                <cap.icon size={24} />
              </div>
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest mb-3 text-neutral-300 group-hover:text-white transition-colors">{cap.title}</h5>
                <p className="text-[11px] text-neutral-500 leading-relaxed tracking-wide">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="initiate" className="relative z-10 w-full bg-black/95 backdrop-blur-xl">
    <div className="px-4 sm:px-8 py-24 md:py-32 brutalist-border-b grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
      
      <div>
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase magnetic-target text-white hover:text-[#dc2626] transition-colors duration-500 leading-[0.9] inline-block">
          Initiate<br/>Sequence
        </h2>
        <p className="text-[10px] text-neutral-500 mt-8 tracking-[0.2em] uppercase font-bold">
          Establish secure connection via encrypted terminal.
        </p>
        
        <div className="mt-12 flex flex-col gap-6">
          <a href="mailto:dev@healthcarepk.online" className="magnetic-target flex items-center gap-4 text-neutral-400 hover:text-white transition-colors group w-fit">
            <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:border-[#dc2626] transition-colors bg-black">
              <Mail size={16} className="group-hover:text-[#dc2626] transition-colors" />
            </div>
            <span className="text-xs tracking-[0.2em] font-bold">DEV@HEALTHCAREPK.ONLINE</span>
          </a>
          <a href="tel:+923041381382" className="magnetic-target flex items-center gap-4 text-neutral-400 hover:text-white transition-colors group w-fit">
            <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:border-[#dc2626] transition-colors bg-black">
              <Phone size={16} className="group-hover:text-[#dc2626] transition-colors" />
            </div>
            <span className="text-xs tracking-[0.2em] font-bold">+92 304 1381382</span>
          </a>
          <div className="magnetic-target flex items-center gap-4 text-[#dc2626] group w-fit cursor-default">
            <div className="w-10 h-10 border border-[#dc2626] flex items-center justify-center bg-[#dc2626]/10 group-hover:bg-[#dc2626] group-hover:text-black transition-colors">
              <MapPin size={16} />
            </div>
            <span className="text-xs tracking-[0.1em] font-bold uppercase group-hover:text-white transition-colors">LAHORE, PAKISTAN [31.5204° N, 74.3587° E]</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-md w-full lg:ml-auto">
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input 
            type="email" 
            placeholder="ENTER_IDENTIFIER (EMAIL)" 
            required
            className="magnetic-target w-full bg-black/50 border border-neutral-800 px-5 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white focus:outline-none focus:border-[#dc2626] transition-colors"
          />
          <textarea 
            placeholder="DEFINE_PARAMETERS (MESSAGE)" 
            rows="5"
            required
            className="magnetic-target w-full bg-black/50 border border-neutral-800 px-5 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
          ></textarea>
          <button type="submit" className="magnetic-target w-full bg-white text-black py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-colors flex justify-center items-center gap-3 brutalist-border">
            Execute Command <Activity size={16} />
          </button>
        </form>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 py-8 text-[10px] text-neutral-600 tracking-[0.2em] uppercase font-bold bg-black">
      <div>&copy; {new Date().getFullYear()} UBAID DEVELOPERS // ALL RIGHTS RESERVED.</div>
      <div className="flex gap-6 mt-4 md:mt-0">
        <span className="magnetic-target hover:text-white transition-colors cursor-pointer">Github</span>
        <span className="magnetic-target hover:text-white transition-colors cursor-pointer">LinkedIn</span>
        <span className="magnetic-target hover:text-white transition-colors cursor-pointer">System_Logs</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <>
      <MagneticCursor />
      <div className="scanline" />
      <div className="noise-overlay" />
      
      <div className="min-h-screen relative font-mono text-white">
        <WebGLEngine />
        <SystemStatus />
        
        <main className="relative z-10 pt-12">
          <Navigation />
          <Hero />
          <Works />
          <Capabilities />
          <Footer />
        </main>
      </div>
    </>
  );
}
