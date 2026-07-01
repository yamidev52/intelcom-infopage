import { useState, useEffect, useRef, type RefObject, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  Camera, Shield, Wrench, Building2, Home, Factory,
  Phone, Mail, MapPin, ChevronDown, Menu, X, Clock,
  Award, Users, CheckCircle, ShoppingCart, Star,
  ArrowRight, Wifi, MonitorPlay, Lock, Zap,
  Navigation, Store, CalendarDays,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/Logo Letra-SF.png";
import logoAltImg from "@/imports/Logo_Letra_Blanco-removebg-preview.png";
import SocialButtons from "./components/ui/SocialButtons";
import { SITE, getWhatsAppLink } from "@/config/siteConfig";

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInViewport(ref: RefObject<Element | null>, once = true): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); if (once) obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return inView;
}

function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, trigger]);
  return count;
}

// ─── Scroll Progress ─────────────────────────────────────────────────────────

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-[#205B9C] via-[#338FF2] to-[#2A77C9] origin-left"
        style={{ scaleX: progress / 100 }}
        transition={{ ease: "linear", duration: 0 }}
      />
    </div>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

const globalStyles = `
  * { scrollbar-width: none; -ms-overflow-style: none; }
  *::-webkit-scrollbar { display: none; }
`;

// ─── Navbar ──────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Tienda", href: "#tienda" },
  { label: "Contacto", href: "#contacto" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Menú principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/96 backdrop-blur-md shadow-md shadow-slate-200/60 border-b border-slate-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-18 py-3">
        <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo("#inicio"); }} className="flex items-center" aria-label="Ir al inicio">
          <ImageWithFallback
            src={scrolled ? logoImg : logoAltImg}
            alt="Intelcom logo"
            className="h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8" role="menubar" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              role="menuitem"
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className={`text-xs font-bold tracking-widest uppercase font-['Montserrat'] transition-colors duration-200 ${
                scrolled ? "text-slate-500 hover:text-[#205B9C]" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={(e) => { e.preventDefault(); scrollTo("#contacto"); }}
            className="ml-2 px-5 py-2.5 bg-[#205B9C] text-white text-xs font-bold tracking-widest uppercase font-['Montserrat'] hover:bg-[#194778] transition-colors duration-200 rounded-sm"
          >
            Cotizar
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className={`md:hidden p-2 rounded ${scrolled ? "text-[#205B9C]" : "text-white"}`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          id="mobile-menu"
          role="menu"
          aria-label="Menú móvil"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-100 px-6 py-6 flex flex-col gap-5 shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              role="menuitem"
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="text-left text-xs font-bold tracking-widest uppercase font-['Montserrat'] text-slate-600 hover:text-[#205B9C] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={(e) => { e.preventDefault(); scrollTo("#contacto"); }}
            className="mt-1 px-5 py-3 bg-[#205B9C] text-white text-xs font-bold tracking-widest uppercase font-['Montserrat'] rounded-sm text-center"
          >
            Solicitar Cotización
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroImages = [
  "https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?w=1600&h=900&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1589935447067-5531094415d1?w=1600&h=900&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1708807472445-d33589e6b090?w=1600&h=900&fit=crop&auto=format",
];

function Hero() {
  const [activeImg, setActiveImg] = useState(0);
  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const t = setInterval(() => setActiveImg((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#112F4F]">
      {/* Rotating background images */}
      {heroImages.map((src, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1200" style={{ opacity: activeImg === i ? 1 : 0 }}>
          <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-[#112F4F]/72" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#112F4F]/90 via-[#112F4F]/55 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-24">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-sm mb-8 text-white/90 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#338FF2] animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold tracking-widest uppercase font-['Montserrat']">Desde 1984 · 40 años de experiencia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-['Montserrat'] font-black uppercase leading-none text-white mb-5"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "-0.02em" }}
          >
            Ingeniera en
            <span className="block text-[#338FF2]">Telecomunicaciones</span>
            <span className="block text-white/60" style={{ fontSize: "0.65em", fontWeight: 700 }}>y Seguridad Electronica</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/65 text-base sm:text-lg leading-relaxed mb-10 font-['Lora'] max-w-lg"
          >
            Instalación, mantenimiento y reparación de circuito cerrado de televisión. Soluciones a medida con cuatro décadas de confianza.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => scrollTo("#servicios")}
              className="px-7 py-4 bg-[#338FF2] text-white font-bold tracking-widest uppercase text-xs font-['Montserrat'] hover:bg-[#2A77C9] transition-all duration-200 shadow-lg shadow-[#338FF2]/30 flex items-center justify-center gap-2 rounded-sm"
            >
              Ver Servicios <ArrowRight size={14} />
            </button>
            <button
              onClick={() => scrollTo("#contacto")}
              className="px-7 py-4 bg-white/10 border border-white/25 text-white font-bold tracking-widest uppercase text-xs font-['Montserrat'] hover:bg-white/18 transition-all duration-200 backdrop-blur-sm flex items-center justify-center rounded-sm"
            >
              Solicitar Cotización
            </button>
          </motion.div>

          {/* Image dots */}
          <div className="flex gap-2 mt-10">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-1 rounded-full transition-all duration-300 ${activeImg === i ? "w-8 bg-[#338FF2]" : "w-2 bg-white/25"}`}
              />
            ))}
          </div>
        </div>

        {/* Floating coverage card — hidden on small screens */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="hidden xl:block absolute right-10 bottom-16 bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-sm max-w-xs"
        >
          <p className="text-white/45 text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-4">Cobertura de servicios</p>
          <div className="space-y-4">
            {[
              { icon: Home, label: "Residencial", desc: "Casas y condominios" },
              { icon: Building2, label: "Comercial", desc: "Oficinas y negocios" },
              { icon: Factory, label: "Industrial", desc: "Plantas y corporativos" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#338FF2]/20 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[#338FF2]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold font-['Montserrat']">{label}</p>
                  <p className="text-white/45 text-xs font-['Lora']">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/35 z-10 cursor-pointer"
        onClick={() => document.querySelector("#nosotros")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="text-[10px] font-bold tracking-widest uppercase font-['Montserrat']">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 40, suffix: "+", label: "Años de Experiencia", icon: Award },
  { value: 2500, suffix: "+", label: "Instalaciones Realizadas", icon: Camera },
  { value: 850, suffix: "+", label: "Clientes Satisfechos", icon: Users },
  { value: 24, suffix: "/7", label: "Soporte Técnico", icon: Clock },
];

function StatItem({ value, suffix, label, icon: Icon, inView, delay }: {
  value: number; suffix: string; label: string;
  icon: React.ElementType; inView: boolean; delay: number;
}) {
  const count = useCountUp(value, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="flex flex-col items-center text-center gap-3 py-2 px-2"
    >
      <div className="w-11 h-11 rounded-sm bg-[#205B9C]/10 border border-[#205B9C]/15 flex items-center justify-center">
        <Icon size={20} className="text-[#205B9C]" />
      </div>
      <span className="font-['Montserrat'] font-black text-[#112F4F] leading-none text-4xl sm:text-5xl">
        {count}{suffix}
      </span>
      <span className="text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase font-['Montserrat']">{label}</span>
    </motion.div>
  );
}

function Stats() {
  const ref = useRef(null);
  const inView = useInViewport(ref);
  return (
    <div ref={ref} className="bg-white border-b border-slate-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-slate-100">
        {STATS.map((stat, i) => <StatItem key={i} {...stat} inView={inView} delay={i * 0.1} />)}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const ref = useRef(null);
  const inView = useInViewport(ref);

  const milestones = [
    { year: "1984", event: "Fundación de Intelcom en Cuautitlan Izcalli, EDOMEX" },
    { year: "1995", event: "Expansión a soluciones corporativas y cobertura regional" },
    { year: "2005", event: "Certificación en sistemas analógicos y digitales HD" },
    { year: "2015", event: "Integración de tecnología IP y videovigilancia en la nube" },
    { year: "2024", event: "40 años siendo líderes en seguridad electrónica en México" },
  ];

  return (
    <section id="nosotros" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[#205B9C] text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-4"
            >
              — Nuestra Historia
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-['Montserrat'] font-black uppercase text-[#112F4F] leading-none mb-8"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Cuatro Décadas<br />
              <span className="text-[#205B9C]">Protegiendo</span><br />
              Lo Que Importa
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="space-y-4 text-slate-600 font-['Lora'] leading-relaxed text-base"
            >
              <p>
                Fundada en 1984, Intelcom nació con una visión clara: brindar soluciones de seguridad electrónica confiables y accesibles para cada tipo de cliente, desde el hogar familiar hasta el corporativo más exigente.
              </p>
              <p>
                A lo largo de cuatro décadas hemos evolucionado junto con la tecnología, adoptando los sistemas más avanzados de videovigilancia analógica, digital, IP y en la nube, sin perder la esencia del servicio personalizado que nos caracteriza.
              </p>
              <p>
                Hoy somos referentes en telecomunicaciones y seguridad empresarial, con un equipo de técnicos certificados y más de 2,500 instalaciones exitosas en todo el territorio nacional.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["CCTV Analógico", "Sistemas IP", "DVR / NVR", "Cámaras 4K", "Monitoreo 24/7", "Redes Estructuradas"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-[#205B9C]/8 border border-[#205B9C]/18 text-[#205B9C] text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] rounded-sm">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative mt-4 lg:mt-0">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#205B9C] via-[#338FF2] to-slate-200" />
            <div className="space-y-8 pl-12 sm:pl-14">
              {milestones.map(({ year, event }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                  className="relative"
                >
                  <div className="absolute -left-[2.35rem] top-1 w-4 h-4 rounded-full border-2 border-[#205B9C] bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#205B9C]" />
                  </div>
                  <span className="font-['Montserrat'] text-[#205B9C] font-black text-sm">{year}</span>
                  <p className="text-slate-600 font-['Lora'] mt-1 leading-snug text-sm sm:text-base">{event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Camera, title: "Instalación CCTV",
    description: "Diseño e instalación de sistemas de circuito cerrado a medida, con análisis del sitio, selección de equipos y pruebas en sitio.",
    features: ["Cámaras HD / 4K / PTZ", "DVR y NVR de alta capacidad", "Cableado estructurado", "Software de monitoreo"],
  },
  {
    icon: Wrench, title: "Mantenimiento Preventivo",
    description: "Programas de mantenimiento periódico para garantizar el óptimo funcionamiento de tu sistema durante todo el año.",
    features: ["Revisión y limpieza de cámaras", "Actualización de firmware", "Verificación de grabaciones", "Informe técnico detallado"],
  },
  {
    icon: Zap, title: "Reparación y Soporte",
    description: "Diagnóstico y reparación rápida de fallas en equipos de videovigilancia, con soporte en sitio y remoto garantizado.",
    features: ["Diagnóstico en menos de 4 hrs", "Reparación de equipos", "Sustitución de componentes", "Garantía de servicio"],
  },
  {
    icon: MonitorPlay, title: "Monitoreo Remoto",
    description: "Accede a tus cámaras desde cualquier dispositivo. Alertas y notificaciones en tiempo real configuradas a tu medida.",
    features: ["App móvil iOS / Android", "Alertas de movimiento", "Respaldo en la nube", "Acceso multi-usuario"],
  },
  {
    icon: Wifi, title: "Redes y Telecomunicaciones",
    description: "Infraestructura de red para soportar sistemas IP de alta demanda con switches PoE, Cat6 y fibra óptica.",
    features: ["Cableado Cat6 / Cat6A", "Switches PoE administrables", "VLANs de seguridad", "Fibra óptica"],
  },
  {
    icon: Lock, title: "Control de Acceso",
    description: "Soluciones biométricas, RFID y cerraduras electrónicas integradas con tu sistema de videovigilancia existente.",
    features: ["Lectores biométricos", "Acceso por tarjeta RFID", "Integración con CCTV", "Registro de ingresos"],
  },
];

const clientTypes = [
  { icon: Home, label: "Hogar" },
  { icon: Building2, label: "Empresa" },
  { icon: Factory, label: "Corporativo" },
];

function Services() {
  const [activeClient, setActiveClient] = useState(0);
  const ref = useRef(null);
  const inView = useInViewport(ref);

  return (
    <section id="servicios" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-[#205B9C] text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-4"
          >
            — Lo Que Hacemos
          </motion.p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-['Montserrat'] font-black uppercase text-[#112F4F] leading-none"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Nuestros <span className="text-[#205B9C]">Servicios</span>
            </motion.h2>

            <div className="flex gap-2 flex-wrap">
              {clientTypes.map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 border border-[#205B9C] bg-[#205B9C] text-white rounded-sm text-xs font-bold tracking-widest uppercase font-['Montserrat'] cursor-default"
                >
                  <Icon size={14} /> {label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.6 }}
                  className="group p-6 sm:p-7 bg-slate-50 border border-slate-100 hover:border-[#205B9C]/25 hover:bg-white hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300 rounded-sm relative"
                >
                  <div className="w-11 h-11 bg-[#205B9C]/10 border border-[#205B9C]/12 flex items-center justify-center mb-5 group-hover:bg-[#205B9C]/16 transition-colors rounded-sm">
                    <Icon size={20} className="text-[#205B9C]" />
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-[#112F4F] text-base uppercase tracking-wide mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 font-['Lora']">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-500 font-['Montserrat']">
                        <CheckCircle size={11} className="text-[#338FF2] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#205B9C]/15 group-hover:border-[#205B9C]/50 transition-colors duration-300 rounded-tr-sm" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Physical Store ───────────────────────────────────────────────────────────

function StoreBanner() {
  const ref = useRef(null);
  const inView = useInViewport(ref);

  return (
    <section id="tienda" className="py-16 sm:py-20 bg-[#112F4F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-sm"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1589186161289-9eb8898086df?w=1400&h=600&fit=crop&auto=format"
              alt="Equipos de videovigilancia en exhibición"
              className="w-full h-full object-cover opacity-15"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#112F4F] via-[#112F4F]/95 to-[#194778]/80" />
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#338FF2]/40" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#338FF2]/40" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#338FF2]/40" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#338FF2]/40" />

          <div className="relative z-10 py-12 sm:py-14 px-6 sm:px-12">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#338FF2]/12 border border-[#338FF2]/25 mb-6 rounded-sm">
                  <ShoppingCart size={13} className="text-[#338FF2]" />
                  <span className="text-[#338FF2] text-[10px] font-bold tracking-widest uppercase font-['Montserrat']">Tienda en Línea · Próximamente</span>
                </div>

                <h2
                  className="font-['Montserrat'] font-black uppercase text-white leading-none mb-5"
                  style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
                >
                  Mientras tanto,{" "}
                  <span className="text-[#338FF2]">visítanos</span>{" "}
                  en sucursal
                </h2>
                <p className="text-white/55 font-['Lora'] text-base leading-relaxed mb-8">
                  Nuestra tienda física cuenta con equipos en exhibición, demostraciones en vivo y asesoría personalizada de expertos en seguridad. Encuentra todo lo que tu proyecto necesita.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={SITE.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#338FF2] text-white font-bold tracking-widest uppercase text-xs font-['Montserrat'] hover:bg-[#2A77C9] transition-colors rounded-sm"
                  >
                    <Navigation size={14} /> Cómo Llegar
                  </a>
                  <a
                    href={SITE.phones.primaryHref}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-bold tracking-widest uppercase text-xs font-['Montserrat'] hover:bg-white/8 transition-colors rounded-sm"
                  >
                    <Phone size={14} /> Llamar Ahora
                  </a>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  { icon: Store, title: "Nuestra Sucursal", lines: ["Multi Plaza Izcalli , Dr. J. Jiménez Cantú Mz. C-24-C Lt. S-24", SITE.address.display] },
                  { icon: CalendarDays, title: "Horario de Atención", lines: ["Lunes a Viernes: 10: – 18:30 hrs", "Sábado: 10:00 – 14:00 hrs"] },
                  { icon: Phone, title: "Contáctanos", lines: [SITE.phones.primary, SITE.email.contact] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4 p-4 sm:p-5 bg-white/5 border border-white/8 rounded-sm hover:bg-white/8 transition-colors">
                    <div className="w-9 h-9 bg-[#338FF2]/15 border border-[#338FF2]/20 flex items-center justify-center flex-shrink-0 rounded-sm">
                      <Icon size={16} className="text-[#338FF2]" />
                    </div>
                    <div>
                      <p className="text-white/45 text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-1">{title}</p>
                      {lines.map((line) => (
                        <p key={line} className="text-white font-['Montserrat'] text-sm font-medium">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUs() {
  const ref = useRef(null);
  const inView = useInViewport(ref);

  const reasons = [
    { icon: Award, title: "40 Años de Trayectoria", description: "Experiencia comprobada en miles de instalaciones residenciales, comerciales y corporativas en México." },
    { icon: Shield, title: "Técnicos Certificados", description: "Certificaciones vigentes de Hikvision, Dahua, Axis y Hanwha para garantizar instalaciones de calidad." },
    { icon: Clock, title: "Respuesta Garantizada", description: "Tiempo de respuesta máximo de 4 horas para fallas críticas. Soporte disponible los 365 días del año." },
    { icon: Star, title: "Garantía de Servicio", description: "Todos nuestros trabajos tienen garantía escrita. Si algo falla, regresamos sin costo adicional." },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=700&h=875&fit=crop&auto=format"
                alt="Técnico instalando sistema de videovigilancia"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112F4F]/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur p-4 rounded-sm shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#205B9C]/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <Award size={20} className="text-[#205B9C]" />
                  </div>
                  <div>
                    <p className="text-[#112F4F] font-['Montserrat'] font-bold text-sm uppercase tracking-wide">Instaladores Certificados</p>
                    <p className="text-slate-500 text-xs font-['Lora']">Hikvision · Syscom · Axis · Hanwha</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-[#205B9C]/25" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-[#205B9C]/25" />
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[#205B9C] text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-4"
            >
              — Por Qué Elegirnos
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-['Montserrat'] font-black uppercase text-[#112F4F] leading-none mb-10"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              Calidad que <span className="text-[#205B9C]">Respalda</span> Cada Proyecto
            </motion.h2>

            <div className="space-y-6">
              {reasons.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 bg-[#205B9C]/8 border border-[#205B9C]/15 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-sm">
                    <Icon size={18} className="text-[#205B9C]" />
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] font-bold text-[#112F4F] text-sm uppercase tracking-wide mb-1">{title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-['Lora']">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

function Contact() {
  const ref = useRef(null);
  const inView = useInViewport(ref);
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", phone: "", service: "", message: "" });
  const [submittedForm, setSubmittedForm] = useState<ContactFormData | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo enviar la solicitud. Intenta de nuevo más tarde.");
      }

      setSent(true);
      setSubmittedForm(form);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error inesperado en el envío.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Teléfono", value: SITE.phones.primary, href: SITE.phones.primaryHref },
    { icon: Mail, label: "Correo", value: SITE.email.display, href: `mailto:${SITE.email.contact}` },
    { icon: MapPin, label: "Ubicación", value: SITE.address.display, href: SITE.address.mapUrl },
    { icon: Clock, label: "Horario", value: "Lun–Vie 8:00–18:00 · Sáb 9:00–14:00", href: "#" },
  ];

  return (
    <section id="contacto" aria-labelledby="contact-heading" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[#205B9C] text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] mb-4"
            >
              — Hablemos
            </motion.p>
            <motion.h2
              id="contact-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-['Montserrat'] font-black uppercase text-[#112F4F] leading-none mb-7"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              Solicita Tu <span className="text-[#205B9C]">Cotización</span> Gratuita
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="text-slate-500 text-base font-['Lora'] leading-relaxed mb-10"
            >
              Nuestro equipo técnico analizará tus necesidades y te presentará la mejor solución dentro de tu presupuesto. Sin compromiso, sin letra chica.
            </motion.p>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-[#205B9C]/8 border border-[#205B9C]/12 flex items-center justify-center group-hover:bg-[#205B9C]/14 transition-colors rounded-sm flex-shrink-0">
                    <Icon size={16} className="text-[#205B9C]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase font-['Montserrat']">{label}</p>
                    <p className="text-[#112F4F] font-['Montserrat'] font-semibold text-sm">{value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-3">Síguenos</p>
              <SocialButtons />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-2">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-[#112F4F] font-['Montserrat'] text-sm focus:outline-none focus:border-[#205B9C] transition-colors rounded-sm placeholder-slate-300"
                    placeholder="Juan García"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-2">Teléfono</label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-[#112F4F] font-['Montserrat'] text-sm focus:outline-none focus:border-[#205B9C] transition-colors rounded-sm placeholder-slate-300"
                    placeholder="+52 (81) 0000-0000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-2">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-[#112F4F] font-['Montserrat'] text-sm focus:outline-none focus:border-[#205B9C] transition-colors rounded-sm placeholder-slate-300"
                  placeholder="juan@empresa.com"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-2">Tipo de Servicio</label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-[#112F4F] font-['Montserrat'] text-sm focus:outline-none focus:border-[#205B9C] transition-colors rounded-sm"
                >
                  <option value="">Selecciona un servicio</option>
                  <option>Instalación CCTV · Hogar</option>
                  <option>Instalación CCTV · Empresa</option>
                  <option>Instalación CCTV · Corporativo</option>
                  <option>Mantenimiento Preventivo</option>
                  <option>Reparación y Soporte</option>
                  <option>Control de Acceso</option>
                  <option>Monitoreo Remoto</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-[10px] font-bold tracking-widest uppercase font-['Montserrat'] text-slate-500 mb-2">Mensaje</label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-[#112F4F] font-['Montserrat'] text-sm focus:outline-none focus:border-[#205B9C] transition-colors resize-none rounded-sm placeholder-slate-300"
                  placeholder="Cuéntanos sobre tu proyecto: número de cámaras, área a cubrir..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold tracking-widest uppercase text-xs font-['Montserrat'] transition-all duration-200 flex items-center justify-center gap-2 rounded-sm ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#205B9C] hover:bg-[#194778] hover:shadow-lg hover:shadow-[#205B9C]/20'}`}
              >
                {loading ? <>Enviando...</> : sent ? <><CheckCircle size={16} /> Mensaje Enviado — Gracias</> : <>Solicitar Cotización <ArrowRight size={14} /></>}
              </button>
              {errorMessage ? (
                <p role="alert" aria-live="assertive" className="text-sm text-rose-600 font-['Montserrat']">{errorMessage}</p>
              ) : null}
              {sent && submittedForm ? (
                <div role="status" aria-live="polite" className="mt-4 rounded-sm border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 font-['Montserrat']">
                  <p className="font-semibold">Solicitud enviada</p>
                  <p>En breve nos comunicaremos con el cliente.</p>
                  <p className="mt-2">También puedes confirmar el envío por WhatsApp:</p>
                  <a
                    href={getWhatsAppLink(
                      `Hola Intelcom, acabo de enviar una solicitud de cotización de ${submittedForm.name} para el servicio ${submittedForm.service || 'no especificado'}. Mi teléfono es ${submittedForm.phone || 'no proporcionado'}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-sm"
                  >
                    Enviar WhatsApp de confirmación
                  </a>
                </div>
              ) : null}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0d2540] border-t border-white/5 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ImageWithFallback src={logoAltImg} alt="Intelcom logo blanco" className="h-13 w-auto object-contain" />
        </div>

        <div className="text-slate-400 text-sm font-['Montserrat'] space-y-2">
          <p className="flex items-center gap-2">
            <Phone size={14} className="text-[#338FF2] flex-shrink-0" />
            <a href={SITE.phones.footerHref} className="hover:text-white">{SITE.phones.footer}</a>
          </p>
          <p className="flex items-center gap-2">
            <Mail size={14} className="text-[#338FF2] flex-shrink-0" />
            <a href={`mailto:${SITE.email.contact}`} className="hover:text-white">{SITE.email.display}</a>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} className="text-[#338FF2] flex-shrink-0" />
            <a href={SITE.address.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{SITE.address.display}</a>
          </p>
        </div>

        <div className="w-full sm:w-auto text-slate-300 text-xs font-['Montserrat'] mt-4 sm:mt-0">
          © {new Date().getFullYear()} {SITE.companyName}
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-white text-foreground font-['Montserrat'] overflow-x-hidden">
      <style>{globalStyles}</style>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <Stats />
        <About />
        <Services />
        <StoreBanner />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
