import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Camera, Plus, Minus, X, ArrowRight, ArrowLeft, BedDouble, UtensilsCrossed, Clock, ArrowDown } from 'lucide-react';
import { rooms, menu, categories } from './data';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// UTILS
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedRoom, setSelectedRoom] = useState<typeof rooms[0] | null>(null);
  const [activeView, setActiveView] = useState<'main' | 'rooms' | 'menu'>('main');

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);



  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQ = i.quantity + delta;
          return newQ > 0 ? { ...i, quantity: newQ } : i;
        }
        return i;
      }).filter((i) => i.quantity > 0)
    );
    if (cartCount === 1 && delta === -1) setIsCartOpen(false); 
  };

  const sendOrderToWhatsApp = () => {
    const phone = "51999999999"; 
    const text = `¡Hola! Quiero hacer un pedido a Barco Hotel:\n\n${cart.map((i) => `- ${i.quantity}x ${i.name} (S/ ${i.price * i.quantity})`).join('\n')}\n\n*Total: S/ ${cartTotal}*`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sendRoomReservation = (roomName: string) => {
    const phone = "51999999999"; 
    const text = `¡Hola! Deseo información para reservar la ${roomName} en Barco Hotel.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ScrollSpy functionality
  useEffect(() => {
    if (activeView !== 'menu') return;

    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      Object.values(categoryRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeView]);

  // Center active tab in categories bar when activeCategory changes
  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeCategory]);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const target = categoryRefs.current[cat];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const triggerMapScroll = () => {
    const target = document.getElementById("map-section");
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categoryCards = [
    { id: 'habitaciones', name: 'Habitaciones', image: '/room.png', target: 'rooms-section' },
    { id: 'comidas', name: 'Comidas', image: '/tacacho.png', target: 'Comidas' },
    { id: 'bebidas', name: 'Bebidas', image: '/camucamu.png', target: 'Bebidas' },
    { id: 'cocteles', name: 'Cócteles', image: '/camucamu.png', target: 'Cócteles' },
  ];

  const handleCategoryClick = (target: string) => {
    if (target === 'rooms-section') {
      setActiveView('rooms');
    } else {
      setActiveView('menu');
      const menuCat = target === 'Cócteles' ? 'A Base de Pisco' : target;
      setActiveCategory(menuCat);
      setTimeout(() => {
        scrollToCategory(menuCat);
      }, 100);
    }
  };

  return (
    <div className="app-container">
      {/* SCROLLABLE CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* HEADER */}
        {activeView !== 'main' && (
          <header className="sticky top-0 z-40 px-4 py-3 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-title text-2xl text-primary leading-none tracking-tight">Barco Hotel</h1>
              <span className="font-slogan text-xs text-secondary font-bold uppercase tracking-wider">Hospedaje & Gastronomía</span>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary/80 hover:text-primary transition-colors">
                <Camera size={20} />
              </button>
              <button 
                onClick={triggerMapScroll}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary/80 hover:text-primary transition-colors"
              >
                <MapPin size={20} />
              </button>
              <button 
                onClick={() => cartCount > 0 && setIsCartOpen(true)}
                className="w-10 h-10 rounded-full bg-primary text-white shadow-md flex items-center justify-center relative hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </header>
        )}

        {activeView === 'main' && (
          <>
            {/* NEW HERO SECTION */}
            <section className="relative min-h-[90vh] bg-gradient-to-b from-primary to-[#0a2a16] text-white flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden">
              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-lg pointer-events-none" />

              {/* Logo */}
              <div className="w-48 h-48 mb-6 flex items-center justify-center drop-shadow-xl">
                <img src="/logo.png" alt="Barco Hotel Logo" className="w-full h-full object-contain animate-fade-in" />
              </div>

              {/* Title */}
              <h1 className="font-title text-4xl sm:text-5xl text-secondary leading-tight tracking-wide mb-4 drop-shadow-md">
                BARCO HOTEL
              </h1>

              {/* Slogan */}
              <p className="font-slogan font-bold text-base sm:text-lg uppercase tracking-widest mb-8 text-white/90 drop-shadow-sm">
                Hospedaje & Gastronomía Amazónica
              </p>

              {/* Info Items */}
              <div className="flex flex-col gap-3 mb-10 text-sm text-white/80 font-body">
                <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <MapPin size={16} className="text-secondary" />
                  <span>Iquitos, Perú</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Clock size={16} className="text-secondary" />
                  <span>Abierto 24 Horas</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                <a 
                  href="https://wa.me/51999999999" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.5-16.4-14.7-27.5-32.8-30.7-38.3-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.6 5.6-9.3 1.9-3.7.9-6.8-.5-9.6-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  <span>WhatsApp</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0h88a121.18,121.18,0,0,0,32.51,84.48,128.58,128.58,0,0,0,90.26,37.43Z"/></svg>
                  <span>TikTok</span>
                </a>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-6 flex flex-col items-center animate-bounce text-white/60 text-xs font-slogan tracking-widest">
                <span>SCROLL PARA DESCUBRIR</span>
                <ArrowDown size={16} className="mt-1" />
              </div>
            </section>

            {/* MARQUEE */}
            <div className="bg-secondary/10 overflow-hidden py-2 border-y border-secondary/20">
              <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="font-slogan font-bold text-secondary text-sm mx-4 uppercase tracking-widest flex items-center gap-2">
                    DESCANSO EN EL RÍO <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" /> SABORES AMAZÓNICOS <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  </span>
                ))}
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <section className="px-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                {categoryCards.map((cat, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.target)}
                    className="relative aspect-square rounded-[2rem] overflow-hidden shadow-glass cursor-pointer group"
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <h3 className="text-white font-title text-lg leading-none">{cat.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* MAP SECTION */}
            <section id="map-section" className="px-4 py-6 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary" />
                <h2 className="font-title text-xl text-slate-800">Nuestra Ubicación</h2>
              </div>
              <div className="rounded-[2rem] overflow-hidden shadow-glass border border-white/50 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127343.45440724312!2d-73.31637057955189!3d-3.7482929449430554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ea10b9e44a8585%3A0x8488b1877f9ab40!2sIquitos!5e0!3m2!1ses-419!2spe!4v1714285800000!5m2!1ses-419!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>
          </>
        )}

        {activeView === 'rooms' && (
          <div className="px-4 py-6">
            <button 
              onClick={() => setActiveView('main')}
              className="mb-6 flex items-center gap-2 text-primary font-bold font-slogan uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={16} /> Volver al menú
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="text-primary" />
              <h2 className="font-title text-xl text-slate-800">Habitaciones</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((room, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="glass-panel p-2 cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                >
                  <img src={room.image} alt={room.name} className="w-full aspect-square object-cover rounded-2xl mb-2 shadow-sm" />
                  <div className="px-1 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-sm leading-tight mb-1 text-slate-800">{room.name}</h4>
                    <p className="text-xs text-primary font-bold mt-1">
                      {room.price && room.price > 0 ? `S/ ${room.price}` : 'Consultar'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'menu' && (
          <div className="px-4 py-6 bg-slate-50/50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] mt-4">
            <button 
              onClick={() => setActiveView('main')}
              className="mb-6 flex items-center gap-2 text-primary font-bold font-slogan uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={16} /> Volver al menú
            </button>

            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="text-secondary" />
              <h2 className="font-title text-xl text-slate-800">Carta Digital</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="sticky top-[65px] z-30 -mx-4 px-4 bg-slate-50/95 backdrop-blur-sm py-3 border-b border-slate-200/50">
                <div className="flex overflow-x-auto no-scrollbar gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      ref={(el) => { tabRefs.current[cat] = el; }}
                      onClick={() => scrollToCategory(cat)}
                      className={cn(
                        "px-5 py-2 rounded-full font-slogan font-bold text-sm whitespace-nowrap transition-all shadow-sm",
                        activeCategory === cat 
                          ? "bg-primary text-white scale-105" 
                          : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-8">
                {categories.map((cat) => (
                  <div 
                    key={cat} 
                    id={cat} 
                    ref={(el) => { categoryRefs.current[cat] = el; }}
                    className="scroll-mt-24"
                  >
                    <h3 className="font-title text-base text-primary mb-3 uppercase tracking-wider flex items-center gap-2 border-l-4 border-secondary pl-2">
                      {cat}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {menu.filter(m => m.category === cat).map((item, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          key={item.id}
                          className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 hover:-translate-y-1 transition-transform relative flex flex-col"
                        >
                          <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-2xl mb-3 shadow-sm" />
                          <div className="px-1 flex-1 flex flex-col">
                            <h4 className="font-bold text-[13px] leading-tight mb-1 flex-1">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 mb-2 line-clamp-2 leading-tight">{item.desc}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-bold text-primary text-sm">S/ {item.price}</span>
                              <button 
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-colors shadow-sm"
                              >
                                <Plus size={16} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-4 right-4 z-30"
          >
            <div 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary/95 backdrop-blur-md p-4 rounded-[2rem] shadow-mobile text-white flex items-center justify-between cursor-pointer border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </div>
                <div>
                  <p className="text-sm font-slogan font-bold opacity-90">Ver pedido</p>
                  <p className="font-bold">S/ {cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <ArrowRight className="text-white/80" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ROOM MODAL */}
      <AnimatePresence>
        {selectedRoom && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"
            >
              <div className="relative">
                <img src={selectedRoom.image} className="w-full h-64 object-cover" alt={selectedRoom.name} />
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white flex items-center justify-center z-10"
                >
                  <X size={20} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="p-6 pt-2">
                <h2 className="font-title text-2xl text-slate-800 mb-2">{selectedRoom.name}</h2>
                <p className="text-primary font-bold text-xl mb-4">
                  {selectedRoom.price && selectedRoom.price > 0 ? `S/ ${selectedRoom.price}` : 'Precio a consultar'} 
                  {selectedRoom.price && selectedRoom.price > 0 && <span className="text-sm font-normal text-slate-400">/ noche</span>}
                </p>
                <p className="text-slate-600 mb-4 leading-relaxed">{selectedRoom.desc}</p>
                
                {((selectedRoom as any).amenities || (selectedRoom as any).attributes) && (
                  <div className="mb-8">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Características</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedRoom as any).amenities?.map((amenity: string, index: number) => (
                        <span key={`am-${index}`} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {amenity}
                        </span>
                      ))}
                      {(selectedRoom as any).attributes?.map((attr: string, index: number) => (
                        <span key={`at-${index}`} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => sendRoomReservation(selectedRoom.name)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  Reserva a WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CART MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] flex flex-col max-h-[85%] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"
            >
              <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-title text-2xl text-slate-800">Tu Pedido</h2>
                  <p className="text-slate-500 text-sm font-slogan">{cartCount} artículos</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-primary font-bold text-sm">S/ {item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-red-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 rounded-t-[2rem] border-t border-slate-100 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-bold">Total a pagar</span>
                  <span className="font-title text-2xl text-primary">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={sendOrderToWhatsApp}
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-bold text-lg shadow-lg shadow-secondary/30 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
                  </div>
                  Enviar pedido a WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
