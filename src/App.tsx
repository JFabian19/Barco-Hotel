import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Minus, X, ArrowRight, BedDouble, UtensilsCrossed, ArrowDown, Tv, ShowerHead, Wind, Wifi, Waves, Users, Utensils, Sun } from 'lucide-react';
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
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

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
  }, []);

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



  const handleCategoryClick = (target: string) => {
    scrollToCategory(target);
  };

  return (
    <div className="app-container">
      {/* SCROLLABLE CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* HERO SECTION - Full image + green transition */}
        <section className="relative text-white flex flex-col overflow-hidden">
          {/* Top: Hero Image - full, no crop */}
          <div className="relative w-full shrink-0">
            <img src="/hero.png" alt="Barco Hotel" className="w-full h-auto block" />
            {/* Subtle top darken for hamburger readability */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
            {/* Gradient fade to green at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#14532d]" />

            {/* Hamburger Menu on image */}
            <div className="absolute top-4 left-4 z-10">
              <button className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] group">
                <span className="w-6 h-[2px] bg-white rounded-full group-hover:w-7 transition-all" />
                <span className="w-7 h-[2px] bg-white rounded-full" />
                <span className="w-5 h-[2px] bg-white rounded-full group-hover:w-7 transition-all" />
              </button>
            </div>
          </div>

          {/* Bottom: Green Content Area */}
          <div className="bg-[#14532d] px-6 pt-2 pb-8 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-36 h-36 mb-3 drop-shadow-2xl -mt-20 z-10">
              <img src="/logo.png" alt="Barco Hotel Logo" className="w-full h-full object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Title Block */}
            <h1 className="font-title text-3xl text-secondary leading-none tracking-wider mb-1 drop-shadow-lg">
              BARCOTEL
            </h1>
            <p className="font-slogan text-sm font-medium tracking-[0.3em] text-white/90 mb-5">
              iquitos nanay
            </p>

            {/* Address */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15 mb-8 max-w-[280px]">
              <p className="font-body text-[13px] text-white/85 leading-relaxed text-center">
                Comunidad Nativa Santo Tomas<br />
                Calle 5 de Enero<br />
                Espalda del Puerto Príncipe
              </p>
            </div>

            {/* Services & Social Row */}
            <div className="flex justify-between items-end gap-4 w-full">
              {/* Services List - Left */}
              <div className="flex flex-col gap-2">
                {['Habitaciones', 'Comidas', 'Bebidas', 'Cócteles'].map((service) => (
                  <button
                    key={service}
                    onClick={() => handleCategoryClick(service)}
                    className="text-left font-title text-lg text-white hover:text-secondary transition-colors drop-shadow-md leading-tight"
                  >
                    {service}
                  </button>
                ))}
              </div>

              {/* Social Links - Right (always brand colors) */}
              <div className="flex flex-col gap-2 items-end">
                <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] px-4 py-2 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="font-slogan font-bold text-sm text-white">WhatsApp</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-[#1877F2] px-4 py-2 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="font-slogan font-bold text-sm text-white">Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] px-4 py-2 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="font-slogan font-bold text-sm text-white">Instagram</span>
                </a>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center mt-6 animate-bounce text-white/50 text-xs font-slogan tracking-widest">
              <span>DESCUBRIR MÁS</span>
              <ArrowDown size={14} className="mt-1" />
            </div>
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

        {/* MAIN MENU SECTION - Unified single scroll */}
        <div className="px-4 py-6 bg-slate-50/50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] mt-4">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="text-secondary" />
            <h2 className="font-title text-xl text-slate-800">Nuestra Carta</h2>
          </div>

          <div className="sticky top-0 z-30 -mx-4 px-4 bg-slate-50/95 backdrop-blur-sm py-3 border-b border-slate-200/50">
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

          <div className="mt-6 space-y-12">
            {categories.map((cat) => (
              <div 
                key={cat} 
                id={cat} 
                ref={(el) => { categoryRefs.current[cat] = el; }}
                className="scroll-mt-24"
              >
                <h3 className="font-title text-base text-primary mb-4 uppercase tracking-wider flex items-center gap-2 border-l-4 border-secondary pl-2">
                  {cat}
                </h3>
                
                {cat === 'Habitaciones' ? (
                  <div className="space-y-8">
                    {rooms.map((room: any, i: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={room.id}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-glass border border-slate-100 flex flex-col"
                      >
                        {room.image ? (
                          <img src={room.image} alt={room.name} className="w-full aspect-[4/3] object-cover" />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-white border-b border-slate-50" />
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-title text-xl text-slate-800 leading-tight">{room.name}</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
                            {room.amenities.map((amenity: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 group">
                                <div className="text-slate-600">
                                  {amenity.icon === 'BedDouble' && <BedDouble size={18} />}
                                  {amenity.icon === 'Tv' && <Tv size={18} />}
                                  {amenity.icon === 'ShowerHead' && <ShowerHead size={18} />}
                                  {amenity.icon === 'Wind' && <Wind size={18} />}
                                  {amenity.icon === 'Wifi' && <Wifi size={18} />}
                                  {amenity.icon === 'Waves' && <Waves size={18} />}
                                  {amenity.icon === 'Users' && <Users size={18} />}
                                  {amenity.icon === 'Utensils' && <Utensils size={18} />}
                                  {amenity.icon === 'Sun' && <Sun size={18} />}
                                </div>
                                <span className="text-[11px] font-medium text-slate-600 tracking-tight">
                                  {amenity.name}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mb-8 border-y border-slate-100 py-6 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 font-slogan">Precio</p>
                            <p className="text-2xl font-title text-primary">Consultar</p>
                          </div>

                          <button 
                            onClick={() => sendRoomReservation(room.name)}
                            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                          >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WHATSAPP
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {menu.filter(m => m.category === cat).map((item: any, i) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        key={item.id}
                        className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 hover:-translate-y-1 transition-transform relative flex flex-col"
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-2xl mb-3 shadow-sm" />
                        ) : (
                          <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-3 shadow-sm border border-slate-100 flex items-center justify-center">
                            <UtensilsCrossed className="text-slate-200" size={32} />
                          </div>
                        )}
                        <div className="px-1 flex-1 flex flex-col">
                          <h4 className="font-bold text-[13px] leading-tight mb-1 flex-1">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 mb-2 line-clamp-2 leading-tight">{item.desc}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-bold text-primary text-[13px] leading-none">
                              {item.pricePrefix && <span className="text-[10px] block font-normal text-slate-400">{item.pricePrefix}</span>}
                              S/ {item.price}
                            </span>
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
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAP SECTION */}
        <section id="map-section" className="px-4 py-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-primary" />
            <h2 className="font-title text-xl text-slate-800">Nuestra Ubicación</h2>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-glass border border-white/50 h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4002.274534967391!2d-73.25619429999999!3d-3.6921000999999993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ea1bdeff08cd29%3A0x1cf37fd39b5a2b37!2sHostal%20Nanay!5e1!3m2!1ses!2spe!4v1777530455912!5m2!1ses!2spe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* FOOTER & MEDIOS DE PAGO */}
        <footer className="px-4 py-8 mt-6 bg-[#14532d] text-white rounded-t-[3rem] text-center border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="mb-6">
            <h3 className="font-title text-xl text-secondary mb-1">Medios de Pago</h3>
            <p className="text-xs text-white/70 font-slogan">Aceptamos todas las tarjetas y billeteras digitales</p>
          </div>
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-xl h-12 flex items-center justify-center w-16 shadow-md">
              <span className="text-[#6c157f] font-bold text-sm">YAPE</span>
            </div>
            <div className="bg-white p-2 rounded-xl h-12 flex items-center justify-center w-16 shadow-md">
              <span className="text-[#00c8e5] font-bold text-sm">PLIN</span>
            </div>
            <div className="bg-white p-2 rounded-xl h-12 flex items-center justify-center w-16 shadow-md">
              <span className="text-[#1a1f71] font-bold text-[11px]">VISA</span>
            </div>
            <div className="bg-white p-2 rounded-xl h-12 flex items-center justify-center w-16 shadow-md">
              <span className="text-[#eb001b] font-bold text-[10px] leading-none">MASTER<br/>CARD</span>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="w-16 h-16 mx-auto mb-3 opacity-50 grayscale">
              <img src="/logo.png" alt="Barco Hotel Logo" className="w-full h-full object-contain" />
            </div>
            <p className="text-[10px] font-slogan tracking-widest text-white/50 uppercase">
              © {new Date().getFullYear()} Barcotel.<br/>Todos los derechos reservados.
            </p>
          </div>
        </footer>
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
