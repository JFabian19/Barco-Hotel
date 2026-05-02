import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Minus, X, ArrowRight, BedDouble, UtensilsCrossed, ArrowDown, Tv, ShowerHead, Wind, Wifi, Waves, Users, Utensils, Sun } from 'lucide-react';
import { rooms as hardcodedRooms, menu as hardcodedMenu, categories as hardcodedCategories } from './data';
import { loadSheetData, type SheetRoom } from './sheets';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// UTILS
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Default icon set for rooms added from Google Sheets
const DEFAULT_ROOM_AMENITY_ICONS: Record<string, string> = {
  'cama': 'BedDouble',
  'tv': 'Tv',
  'televisor': 'Tv',
  'baño': 'ShowerHead',
  'ducha': 'ShowerHead',
  'aire': 'Wind',
  'ventilador': 'Wind',
  'wifi': 'Wifi',
  'internet': 'Wifi',
  'piscina': 'Waves',
  'familiar': 'Users',
  'comida': 'Utensils',
  'restaurante': 'Utensils',
  'sol': 'Sun',
  'terraza': 'Sun',
};

function getAmenityIcon(amenityName: string): string {
  const lower = amenityName.toLowerCase();
  for (const [keyword, icon] of Object.entries(DEFAULT_ROOM_AMENITY_ICONS)) {
    if (lower.includes(keyword)) return icon;
  }
  return 'Sun'; // default icon
}

interface Room {
  id: string;
  name: string;
  price: number | null;
  individualPrice: number | null;
  image: string;
  amenities: { name: string; icon: string; }[];
}

function convertSheetRoom(sr: SheetRoom): Room {
  const amenitiesList = sr.amenities
    ? sr.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  const priceNum = parseFloat(sr.price);

  return {
    id: sr.id,
    name: sr.name,
    price: isNaN(priceNum) || priceNum <= 0 ? null : priceNum,
    individualPrice: null,
    image: sr.image || '',
    amenities: amenitiesList.map(a => ({
      name: a,
      icon: getAmenityIcon(a),
    })),
  };
}

export default function App() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  // Dynamic data from Google Sheets (with fallback to hardcoded)
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(hardcodedCategories);
  const [dynamicMenu, setDynamicMenu] = useState<any[]>(hardcodedMenu);
  const [dynamicRooms, setDynamicRooms] = useState<Room[]>(hardcodedRooms as unknown as Room[]);
  const [activeCategory, setActiveCategory] = useState(hardcodedCategories[0]);

  // Load data from Google Sheets on mount
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const data = await loadSheetData();

        if (cancelled) return;

        if (data && (data.categories.length > 0 || data.menuItems.length > 0)) {
          // Build categories list and trim everything
          const sheetCats = data.categories.map(c => c.name.trim()).filter(Boolean);
          
          // Ensure unique categories and "Habitaciones" is first
          const uniqueCats = Array.from(new Set(['Habitaciones', ...sheetCats]));
          setDynamicCategories(uniqueCats);

          // Convert sheet menu items and trim categories
          if (data.menuItems.length > 0) {
            const menuItems = data.menuItems.map(item => {
              const name = item.name.trim();
              const fallback = hardcodedMenu.find(hm => hm.name.toLowerCase() === name.toLowerCase());
              let desc = (item.desc || '').trim() || (fallback ? fallback.desc : '');
              
              // Force "Imagen referencial" warning for specific combos if not present
              const warningItems = [
                'COMBO MORGAN - CHAPITO',
                'COMBO ETIQUETA ROJA',
                'COMBO CHIVAS',
                'CHIVAS JONNY WALKER BLACK'
              ];
              if (warningItems.includes(name.toUpperCase()) && !desc.toLowerCase().includes('referencial')) {
                desc = '*Imagen referencial*\n' + desc;
              }

              return {
                id: item.id,
                name: name,
                category: item.category.trim(),
                price: item.price,
                pricePrefix: (item.pricePrefix || '').trim(),
                image: (item.image || '').trim() || (fallback ? fallback.image : ''),
                desc: desc,
              };
            });
            setDynamicMenu(menuItems);
          }

          // Handle Rooms with fallback and merging
          let finalRooms: Room[] = [...hardcodedRooms] as unknown as Room[];
          if (data.extraRooms.length > 0) {
            data.extraRooms.forEach(sr => {
              const name = sr.name.trim();
              const existingIdx = finalRooms.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
              const converted = convertSheetRoom(sr);
              
              if (existingIdx !== -1) {
                // Override only if not empty in sheet
                const updatedRoom = { ...finalRooms[existingIdx] };
                if ((sr.image || '').trim()) updatedRoom.image = sr.image.trim();
                const p = parseFloat(sr.price);
                if (!isNaN(p) && p > 0) updatedRoom.price = p;
                if ((sr.amenities || '').trim()) updatedRoom.amenities = converted.amenities;
                
                finalRooms[existingIdx] = updatedRoom;
              } else {
                finalRooms.push(converted);
              }
            });
          }
          setDynamicRooms(finalRooms);
        } else {
          // No sheet data available - use hardcoded fallback
        }
      } catch (err) {
        console.error('Failed to load Google Sheets data:', err);
      } finally {
        // load finished
      }
    }

    loadData();

    return () => { cancelled = true; };
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const isManualScrolling = useRef(false);

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

  // ScrollSpy functionality - re-run when categories change
  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-90px 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return;

      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length > 0) {
        // Sort by how close they are to the top of the rootMargin
        const topIntersecting = intersecting.reduce((prev, curr) => 
          curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
        );
        setActiveCategory(topIntersecting.target.id);
      }
    }, observerOptions);

    const timer = setTimeout(() => {
      Object.values(categoryRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [dynamicCategories]);

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
    const target = categoryRefs.current[cat];
    if (target) {
      isManualScrolling.current = true;
      setActiveCategory(cat);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Re-enable observer after smooth scroll ends
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
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


          </div>

          {/* Bottom: Green Content Area */}
          <div className="bg-[#14532d] px-6 pt-2 pb-8 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-48 h-48 mb-3 drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)] -mt-24 z-10">
              <img src="/logo.png" alt="Barco Hotel Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            </div>



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
                {dynamicCategories.map((service) => (
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
              {dynamicCategories.map((cat) => (
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
            {dynamicCategories.map((cat) => (
              <div 
                key={cat} 
                id={cat} 
                ref={(el) => { categoryRefs.current[cat] = el; }}
                className="scroll-mt-28"
              >
                <h3 className="font-title text-base text-primary mb-4 uppercase tracking-wider flex items-center gap-2 border-l-4 border-secondary pl-2">
                  {cat}
                </h3>
                
                {cat === 'Habitaciones' ? (
                  <div className="space-y-6">
                    {dynamicRooms.map((room: any, i: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={room.id}
                        className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 flex flex-row gap-3 items-stretch"
                      >
                        {/* Left: Image */}
                        <div className="w-[45%] shrink-0 relative overflow-hidden rounded-[1.5rem]">
                          {room.image ? (
                            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full min-h-[160px] bg-slate-50 flex items-center justify-center">
                              <BedDouble className="text-slate-300" size={32} />
                            </div>
                          )}
                        </div>
                        
                        {/* Right: Content */}
                        <div className="flex-1 flex flex-col items-center justify-start py-2 pr-2">
                          <h4 className="font-title text-[18px] text-slate-800 leading-tight mb-2 text-center">{room.name}</h4>
                          
                          <div className="bg-[#e1251b] text-white px-3 py-0.5 rounded-lg mb-3">
                            <span className="font-bold text-lg tracking-wide">
                              {room.price && room.price > 0 ? `S/${room.price}` : 'Consultar'}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col justify-center w-full py-1">
                            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5">
                              {room.amenities.map((amenity: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-slate-800 leading-none">
                                    {amenity.name}
                                  </span>
                                  <div className="text-slate-600">
                                    {amenity.icon === 'BedDouble' && <BedDouble size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Tv' && <Tv size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'ShowerHead' && <ShowerHead size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Wind' && <Wind size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Wifi' && <Wifi size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Waves' && <Waves size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Users' && <Users size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Utensils' && <Utensils size={13} strokeWidth={2.5} />}
                                    {amenity.icon === 'Sun' && <Sun size={13} strokeWidth={2.5} />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="w-full pt-1">
                            <button 
                              onClick={() => sendRoomReservation(room.name)}
                              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-[12px] py-2.5 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              <span className="tracking-wide">WHATSAPP</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {dynamicMenu.filter(m => m.category === cat).map((item: any, i) => (
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
                          <div className="text-[10px] text-slate-400 mb-2 leading-tight min-h-[2.5rem]">
                            {item.desc.split('\n').map((line: string, idx: number) => (
                              <span key={idx} className={cn(line.includes('referencial') && "text-red-500 font-bold block mb-0.5")}>
                                {line}
                                {idx < item.desc.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
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
            <div className="bg-white p-1.5 rounded-xl h-12 w-12 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/yape.jpeg" alt="Yape" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white p-1.5 rounded-xl h-12 w-12 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/plin.jpeg" alt="Plin" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white p-1.5 rounded-xl h-12 w-12 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/visa.png" alt="Visa" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white p-1.5 rounded-xl h-12 w-12 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/mastercard.png" alt="Mastercard" className="w-full h-full object-contain" />
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
