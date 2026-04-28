import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Camera, Plus, Minus, X, ArrowRight, BedDouble, UtensilsCrossed } from 'lucide-react';
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
  const [showMenu, setShowMenu] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    if (!showMenu) return;

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
  }, [showMenu]);

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

  return (
    <div className="app-container">
      {/* SCROLLABLE CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* HEADER */}
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

        {/* HERO BANNER */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-glass bg-slate-200">
            <img src="/hero.png" alt="Barco Hotel" className="w-full h-auto block object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
              <h2 className="text-white font-title text-2xl sm:text-3xl leading-none">El Placer de<br/><span className="text-secondary">Vivir la Selva</span></h2>
            </div>
          </div>
        </motion.section>

        {/* ROOMS SECTION */}
        <section className="px-4 py-6">
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
                className="glass-panel p-2 cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              >
                <img src={room.image} alt={room.name} className="w-full aspect-square object-cover rounded-2xl mb-2 shadow-sm" />
                <div className="px-1">
                  <h3 className="font-bold text-sm leading-tight mb-1">{room.name}</h3>
                  <p className="text-xs text-primary font-bold">S/ {room.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CARTA DIGITAL SECTION */}
        <section className="px-4 py-6 bg-slate-50/50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] mt-4">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="text-secondary" />
            <h2 className="font-title text-xl text-slate-800">Carta Digital</h2>
          </div>

          {!showMenu ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMenu(true)}
              className="w-full p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <UtensilsCrossed size={30} />
              </div>
              <div className="text-center">
                <h3 className="font-title text-lg text-primary mb-1">¡Gastronomía a Bordo!</h3>
                <p className="font-slogan text-xs text-slate-500 font-bold uppercase tracking-wider">Dale click para ver nuestros platos</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 blur-2xl rounded-full pointer-events-none" />
            </motion.button>
          ) : (
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
          )}
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
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white flex items-center justify-center"
                >
                  <X size={20} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="p-6 pt-2">
                <h2 className="font-title text-2xl text-slate-800 mb-2">{selectedRoom.name}</h2>
                <p className="text-primary font-bold text-xl mb-4">S/ {selectedRoom.price} <span className="text-sm font-normal text-slate-400">/ noche</span></p>
                <p className="text-slate-600 mb-8 leading-relaxed">{selectedRoom.desc}</p>
                
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
