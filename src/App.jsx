import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import { 
  Code, Cpu, Terminal, Zap, Activity, Server, ArrowUpRight, 
  Database, Crosshair, Mail, Phone, MapPin, Box, Layers, Shield, 
  Globe, Workflow, Flame, CheckCircle2, Compass, Network, Menu, X
} from 'lucide-react';

/* ==========================================================================
   1. REACT THREE FIBER 3D SCENE & INTERACTIVE ARTIFACT
   ================================================================---------- */
function CyberCore({ scrollProgress }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Scroll-linked rotation and geometric transformation
    meshRef.current.rotation.y = time * 0.4 + scrollProgress * Math.PI * 2;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.3 + scrollProgress * 1.5;
    
    // Dynamic scale scaling based on scroll progression
    const targetScale = 1.8 + Math.sin(scrollProgress * Math.PI) * 0.4;
    meshRef.current.scale.setScalar(targetScale);
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <MeshTransmissionMaterial 
          backside 
          samples={16} 
          resolution={512} 
          transmission={0.94} 
          roughness={0.15} 
          thickness={1.5} 
          ior={1.6} 
          color="#dc2626" 
        />
      </mesh>
      <Sparkles count={150} scale={12} size={2} speed={0.4} color="#ffffff" />
    </Float>
  );
}

const R3FCanvasLayer = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none" style={{ WebkitTransform: 'translateZ(0)' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#dc2626" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#3b82f6" />
        <CyberCore scrollProgress={scrollProgress} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

/* ==========================================================================
   2. UI COMPONENTS & MICROINTERACTIONS
   ================================================================---------- */
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 768) return;
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
  <div className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/15 text-[9px] sm:text-xs uppercase flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 font-light tracking-widest text-neutral-200 shadow-2xl">
    <div className="flex items-center gap-2 text-white font-bold truncate">
      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse shadow-[0_0_15px_#dc2626] shrink-0"></div>
      <span className="truncate">USMAN_UBAID // R3F ARCHITECTURAL KERNEL 60FPS</span>
    </div>
    <div className="text-[#3b82f6] font-bold hidden md:block shrink-0">LAHORE, PK [31.5204° N, 74.3587° E]</div>
  </div>
);

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-40 mt-10 sm:mt-12 w-full px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-white flex items-center gap-2 drop-shadow-md">
          Usman Ubaid <span className="text-[#dc2626]">.</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-300 tracking-widest mt-0.5 uppercase hidden sm:block">Full-Stack SaaS Architect & 3D Systems</p>
      </div>

      <div className="hidden lg:flex gap-6 text-xs font-bold tracking-[0.2em] uppercase items-center">
        {['Work', 'Showcase', 'Ecosystem', 'Scrollytelling', 'Contact'].map((item, idx) => (
          <a key={idx} href={`#${item.toLowerCase()}`} className="text-neutral-200 hover:text-[#dc2626] transition-colors">
            [{item}]
          </a>
        ))}
        <a href="#contact" className="bg-white/20 hover:bg-[#dc2626] text-white backdrop-blur-md border border-white/30 px-4 py-2 transition-all shadow-lg">
          Let's talk
        </a>
      </div>

      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2 border border-white/20 bg-white/[0.05] backdrop-blur-md">
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/20 p-6 flex flex-col gap-4 lg:hidden shadow-2xl">
          {['Work', 'Showcase', 'Ecosystem', 'Scrollytelling', 'Contact'].map((item, idx) => (
            <a key={idx} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-200 hover:text-[#dc2626] py-2 border-b border-white/10">
              [{item}]
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="bg-[#dc2626] text-white text-center py-3 font-bold uppercase tracking-widest mt-2">
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
        <Crosshair size={16} className="shrink-0" /> <span className="truncate">FULL-STACK SaaS & R3F SPATIAL WORKSPACE</span>
      </p>
      <h2 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] text-white drop-shadow-2xl">
        I build high-end <br /><span className="stroke-text">SaaS products</span> & web apps that scale.
      </h2>
      <p className="mt-6 sm:mt-8 text-xs sm:text-lg text-neutral-200 max-w-2xl font-light tracking-wide leading-relaxed bg-white/[0.04] p-6 sm:p-8 border border-white/15 backdrop-blur-2xl shadow-2xl">
        I'm Usman Ubaid — a full-stack engineer turning complex startup ideas, medical architectures, and AI/ML model integrations into production-ready web platforms using Next.js, React, SQL, Python, and Vercel.
      </p>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-2xl">
          <div className="text-3xl sm:text-5xl font-black text-white mb-1">4+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Years Shipping Code</div>
        </div>
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-2xl">
          <div className="text-3xl sm:text-5xl font-black text-[#dc2626] mb-1">8+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">SaaS & Web Apps Launched</div>
        </div>
        <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-2xl">
          <div className="text-3xl sm:text-5xl font-black text-[#3b82f6] mb-1">14+</div>
          <div className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-widest font-bold">Advanced Technologies</div>
        </div>
      </div>
      
      <div className="mt-10 sm:mt-12 flex flex-wrap gap-4">
        <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/90 text-black px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#dc2626] hover:text-white transition-all border border-white/40 shadow-2xl backdrop-blur-md">
          Start a project <ArrowUpRight size={18} />
        </a>
        <a href="#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/[0.04] backdrop-blur-2xl text-white px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:border-[#3b82f6] transition-all border border-white/20 shadow-2xl">
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative z-10 w-full py-24 sm:py-32 bg-transparent perspective-1000">
      <div className="flex flex-col sm:flex-row border-y border-white/15 px-4 sm:px-8 py-5 sm:py-6 items-start sm:items-center justify-between bg-white/[0.03] backdrop-blur-2xl mb-12 sm:mb-16 mx-4 sm:mx-8 shadow-2xl gap-3 sm:gap-0">
        <h3 className="text-xs sm:text-sm tracking-[0.2em] uppercase font-black flex items-center gap-3 text-white">
          <Database size={20} className="text-[#dc2626] animate-pulse shrink-0" /> Selected Production Work
        </h3>
        <span className="text-xs text-[#dc2626] font-bold uppercase bg-white/[0.05] px-3 py-1 border border-white/20 backdrop-blur-xl shadow-lg">NODES: {worksData.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 max-w-7xl mx-auto perspective-1000">
        {worksData.map((work, idx) => (
          <div ref={el => cardsRef.current[idx] = el} key={idx} className="transition-transform duration-75 ease-out will-change-transform">
            <TiltCard className="h-full">
              <a href={work.link} target={work.link !== '#' ? "_blank" : "_self"} rel="noopener noreferrer" className="block relative bg-white/90 backdrop-blur-2xl text-black border-2 border-white/60 p-6 sm:p-10 h-80 sm:h-96 flex flex-col justify-between group hover:border-[#dc2626] hover:shadow-[0_20px_50px_rgba(220,38,38,0.4)] transition-all shadow-2xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm bg-black text-white px-3 py-1 font-black tracking-widest shadow">{work.id}</span>
                  <ArrowUpRight size={24} className="text-black group-hover:text-[#dc2626] transition-transform group-hover:rotate-45" />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase mb-3 sm:mb-4 text-black group-hover:text-[#dc2626] transition-colors">{work.title}</h4>
                  <span className="text-[10px] sm:text-xs text-white bg-[#dc2626] px-2.5 py-1 font-bold inline-block mb-2 shadow-[0_0_12px_rgba(220,38,38,0.5)]">{work.type}</span>
                  <p className="text-[11px] sm:text-xs text-neutral-800 font-bold">// {work.tech}</p>
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
   3. ISOLATED VIEW-LOCKED HORIZONTAL SCROLLING BLOCK
   ================================================================---------- */
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
    <section ref={containerRef} id="showcase" className="relative h-[350vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-10 sm:top-12 left-4 sm:left-16 z-20 pointer-events-none">
          <p className="text-[#3b82f6] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-2 bg-white/[0.04] px-3 sm:px-4 py-1.5 border border-white/25 w-fit backdrop-blur-2xl shadow-xl">// ISOLATED HORIZONTAL KERNEL</p>
          <h3 className="text-2xl sm:text-5xl font-black tracking-tight uppercase text-white drop-shadow-2xl">Immersive Case Studies</h3>
        </div>
        <div ref={trackRef} className="flex gap-6 sm:gap-12 pl-4 sm:pl-16 w-max pt-20 sm:pt-24 will-change-transform">
          {[
            { title: "HealthcarePK Engine", tag: "MED-TECH // SQL", desc: "Full-stack medical information and patient management portal with automated record indexing." },
            { title: "Universal Contract Maker", tag: "LEGAL SaaS // VERCEL", desc: "Autonomous document synthesis engine generating custom corporate agreements instantly." },
            { title: "Neural Analytics Hub", tag: "PYTHON ML // REACT", desc: "Predictive data visualization dashboards built for pharmaceutical logistics tracking." },
            { title: "60FPS WebGL Portfolio", tag: "THREE.JS // SHADERS", desc: "High-performance interactive 3D spatial workspace for elite brand presentation." }
          ].map((item, idx) => (
            <div key={idx} className="w-[85vw] md:w-[45vw] h-[55vh] sm:h-[60vh] border border-white/20 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-14 flex flex-col justify-between relative group hover:border-[#3b82f6] transition-colors shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] sm:text-xs font-mono text-[#3b82f6] bg-white/[0.06] px-3 py-1 border border-white/20">{item.tag}</span>
                <Compass size={22} className="text-neutral-300 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-3 sm:mb-4 text-white drop-shadow">{item.title}</h4>
                <p className="text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-4 sm:pt-6 border-t border-white/15 flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-300">
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
   4. VIEW-LOCKED RADIAL ORBITAL SCROLLYTELLING CONTAINER
   ================================================================---------- */
const RadialOrbitalScrollytelling = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const modules = [
    { id: "NODE_01", title: "Frontend & Reactive UI Architecture", category: "CLIENT KERNEL", icon: Code, color: "#dc2626", desc: "Engineered with React, Next.js, and Tailwind CSS. Implements smooth custom magnetic cursors and GPU-accelerated spatial transformations.", stats: "60 FPS Render Rate" },
    { id: "NODE_02", title: "Secure SQL & Relational Databases", category: "BACKEND INTEGRATION", icon: Database, color: "#3b82f6", desc: "Robust PostgreSQL and MySQL schemas optimized for high-throughput multi-tenant SaaS platforms and secure authentication pipelines.", stats: "ACID Compliant Storage" },
    { id: "NODE_03", title: "Python Machine Learning & AI", category: "INTELLIGENT PIPELINES", icon: Cpu, color: "#10b981", desc: "Advanced neural networks and automated contract generation systems built with Python, PyTorch, and Vercel Edge functions.", stats: "Real-time AI Synthesis" },
    { id: "NODE_04", title: "Global Vercel Edge Infrastructure", category: "CLOUD DEPLOYMENT", icon: Globe, color: "#f59e0b", desc: "Low-latency serverless architecture ensuring global distribution, instant cache invalidation, and bulletproof uptime.", stats: "99.99% Edge Uptime" }
  ];

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight <= 0) return;

        let currentProgress = -rect.top / totalHeight;
        currentProgress = Math.max(0, Math.min(1, currentProgress));
        const newIndex = Math.min(modules.length - 1, Math.floor(currentProgress * modules.length));
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
    <section ref={containerRef} id="ecosystem" className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between px-4 sm:px-16 py-12 sm:py-20 pointer-events-auto">
        
        <div className="flex justify-between items-center border-b border-white/15 pb-4 sm:pb-6 bg-white/[0.03] backdrop-blur-2xl px-4 sm:px-6 rounded shadow-2xl">
          <div>
            <p className="text-[#dc2626] text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1">// RADIAL ORBITAL ECOSYSTEM</p>
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

          <div className="lg:col-span-7 border border-white/20 bg-white/[0.04] backdrop-blur-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
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

        <div className="grid grid-cols-4 gap-2 sm:gap-4 border-t border-white/15 pt-4 sm:pt-6 bg-white/[0.03] backdrop-blur-2xl px-4 sm:px-6 pb-3 sm:pb-4 rounded shadow-2xl">
          {modules.map((m, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 sm:h-2 transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'bg-[#dc2626] shadow-[0_0_15px_#dc2626]' : 'bg-white/20 hover:bg-white/40'}`}
              onClick={() => {
                if (!containerRef.current) return;
                const totalH = (containerRef.current.scrollHeight - window.innerHeight);
                window.scrollTo({ top: (idx / modules.length) * totalH + containerRef.current.offsetTop, behavior: 'smooth' });
              }}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* ==========================================================================
   5. VIEW-LOCKED NARRATIVE SCROLLYTELLING CONTAINER
   ================================================================---------- */
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
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight <= 0) return;

        let progress = -rect.top / totalHeight;
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
    <section ref={containerRef} id="scrollytelling" className="relative h-[400vh] bg-transparent border-b border-white/15">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center px-4 sm:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-center">
          <div className="lg:col-span-5 border border-white/20 bg-white/[0.04] backdrop-blur-3xl p-6 sm:p-10 shadow-2xl">
            <p className="text-[#dc2626] text-xs font-bold tracking-[0.3em] uppercase mb-3 sm:mb-4">// NARRATIVE KERNEL PROGRESSION</p>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6 drop-shadow">Development Lifecycle</h3>
            <div className="space-y-3 sm:space-y-4 font-mono text-xs">
              {milestones.map((m, idx) => (
                <div key={idx} className={`p-3 sm:p-4 border transition-all flex items-center justify-between ${activeStep === idx ? 'border-[#dc2626] bg-white/[0.08] backdrop-blur-xl text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-white/15 bg-white/[0.02] text-neutral-300'}`}>
                  <span className="truncate">{m.phase}</span>
                  {activeStep === idx && <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-ping shrink-0 ml-2"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="min-h-[45vh] sm:min-h-[55vh] flex flex-col justify-center border-l-2 border-white/30 pl-6 sm:pl-12 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-12 rounded shadow-2xl transition-all duration-300">
              <span className="text-xs font-mono text-[#dc2626] mb-2 sm:mb-3 tracking-widest">{milestones[activeStep].phase}</span>
              <h4 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-tight sm:leading-none drop-shadow">{milestones[activeStep].title}</h4>
              <p className="text-sm sm:text-base text-neutral-200 font-mono leading-relaxed">{milestones[activeStep].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => (
  <section id="expertise" className="relative z-10 w-full border-b border-white/15 bg-transparent px-4 sm:px-8 py-20 sm:py-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 sm:gap-16">
      <div className="bg-white/[0.04] backdrop-blur-2xl p-6 border border-white/20 rounded shadow-2xl">
        <h3 className="text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-3 mb-4 sm:mb-6 text-white drop-shadow">
          <Cpu size={16} className="text-[#dc2626]" /> Core Expertise
        </h3>
        <p className="text-xs text-neutral-200 leading-relaxed">Comprehensive technical stack covering modern web applications, relational databases, cloud deployment, and AI pipelines.</p>
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        {[
          { icon: Code, title: 'Full-Stack Development', desc: 'React, Next.js, Node.js, and robust backend integrations.' },
          { icon: Server, title: 'Database & SQL Architecture', desc: 'PostgreSQL, MySQL, and optimized relational data schemas.' },
          { icon: Box, title: 'WebGL & Three.js 3D', desc: 'Immersive browser experiences and high-performance visual engines.' },
          { icon: Layers, title: 'Python & AI Models', desc: 'Tailored machine learning models and medical-tech integrations.' }
        ].map((cap, idx) => (
          <div key={idx} className="flex gap-4 p-5 border border-white/20 bg-white/[0.04] backdrop-blur-2xl hover:border-[#dc2626]/60 transition-colors shadow-2xl">
            <cap.icon size={24} className="text-[#dc2626] shrink-0 mt-1" />
            <div>
              <h5 className="text-sm font-bold uppercase tracking-widest mb-2 text-white drop-shadow">{cap.title}</h5>
              <p className="text-xs text-neutral-200">{cap.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="relative z-10 w-full bg-transparent">
    <div className="px-4 sm:px-8 py-20 sm:py-24 border-b border-white/15 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 bg-white/[0.03] backdrop-blur-2xl shadow-2xl">
      <div>
        <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-2xl">Let's build<br/>something great.</h2>
        <p className="text-xs text-neutral-200 mt-4 sm:mt-6 tracking-widest uppercase font-bold">Reach out directly to discuss your SaaS or web platform.</p>
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 text-xs font-bold tracking-widest">
          <a href="mailto:dev@healthcarepk.online" className="text-neutral-100 hover:text-[#dc2626] transition-colors truncate">DEV@HEALTHCAREPK.ONLINE</a>
          <a href="tel:+923041381382" className="text-neutral-100 hover:text-[#dc2626] transition-colors">+92 304 1381382</a>
          <span className="text-[#3b82f6]">LAHORE, PAKISTAN [31.5204° N, 74.3587° E]</span>
        </div>
      </div>
      <div>
        <form className="flex flex-col gap-4 bg-white/[0.04] p-6 sm:p-8 border border-white/20 backdrop-blur-3xl shadow-2xl" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:dev@healthcarepk.online'; }}>
          <input type="email" placeholder="YOUR EMAIL" required className="bg-black/50 border border-white/20 p-3 sm:p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none transition-colors backdrop-blur-md" />
          <textarea placeholder="PROJECT DETAILS / MESSAGE" rows="4" required className="bg-black/50 border border-white/20 p-3 sm:p-4 text-xs font-bold uppercase text-white focus:border-[#dc2626] outline-none resize-none transition-colors backdrop-blur-md"></textarea>
          <button type="submit" className="bg-white/90 text-black py-3 sm:py-4 text-xs font-black uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-colors border border-white shadow-xl backdrop-blur-md">Send Message</button>
        </form>
      </div>
    </div>
    <div className="px-4 sm:px-8 py-5 sm:py-6 text-[10px] text-neutral-300 tracking-widest uppercase font-bold flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 bg-white/[0.02] backdrop-blur-xl border-t border-white/15">
      <div>&copy; {new Date().getFullYear()} USMAN UBAID // ALL RIGHTS RESERVED.</div>
      <div>R3F_SAFARI_OPTIMIZED_KERNEL</div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen relative font-mono text-white bg-black overflow-x-hidden">
      <R3FCanvasLayer />
      <SystemStatus />
      <main className="relative z-10 pt-10 sm:pt-12">
        <Navigation />
        <Hero />
        <Works />
        <HorizontalShowcase />
        <RadialOrbitalScrollytelling />
        <ScrollytellingSection />
        <Capabilities />
        <Footer />
      </main>
    </div>
  );
}
