export const rooms = [
  {
    id: 'r1',
    name: 'Habitación de 20m²',
    price: null,
    individualPrice: null,
    image: '/habitacion 20m.jpg',
    amenities: [
      { name: 'Cama King Size', icon: 'BedDouble' },
      { name: 'TV 43 Smart Cable', icon: 'Tv' },
      { name: 'Baño en Habitación', icon: 'ShowerHead' },
      { name: 'Aire Acondicionado', icon: 'Wind' },
      { name: 'Wifi', icon: 'Wifi' }
    ]
  },
  {
    id: 'r2',
    name: 'Habitación de 15m²',
    price: null,
    individualPrice: null,
    image: '/habitacion 15m.jpg',
    amenities: [
      { name: 'Cama King Size', icon: 'BedDouble' },
      { name: 'TV 43 Smart Cable', icon: 'Tv' },
      { name: 'Baño en Habitación', icon: 'ShowerHead' },
      { name: 'Aire Acondicionado', icon: 'Wind' },
      { name: 'Wifi', icon: 'Wifi' }
    ]
  },
  {
    id: 'r3',
    name: 'Habitación de 12m²',
    price: null,
    individualPrice: null,
    image: '/habitacion 12m.jpg',
    amenities: [
      { name: 'Cama King Size', icon: 'BedDouble' },
      { name: 'TV 43 Smart Cable', icon: 'Tv' },
      { name: 'Baño en Habitación', icon: 'ShowerHead' },
      { name: 'Aire Acondicionado', icon: 'Wind' },
      { name: 'Wifi', icon: 'Wifi' }
    ]
  },
  {
    id: 'r4',
    name: 'Habitación Decorada',
    price: null,
    individualPrice: null,
    image: '/cuarto decorado.jpg',
    amenities: [
      { name: 'Cama King Size', icon: 'BedDouble' },
      { name: 'TV 43 Smart Cable', icon: 'Tv' },
      { name: 'Baño en Habitación', icon: 'ShowerHead' },
      { name: 'Aire Acondicionado', icon: 'Wind' },
      { name: 'Wifi', icon: 'Wifi' }
    ]
  },
  {
    id: 'r5',
    name: 'Piscina',
    price: null,
    individualPrice: null,
    image: '/piscina.jpg',
    amenities: [
      { name: 'Acceso a Piscina', icon: 'Waves' },
      { name: 'Zona Familiar y de Descanso', icon: 'Users' },
      { name: 'Duchas y Cambiadores', icon: 'ShowerHead' },
      { name: 'Bebidas y Snacks', icon: 'Utensils' },
      { name: 'Ambiente ideal para relajarse', icon: 'Sun' }
    ]
  }
];

export const menu = [
  { id: 'm50', name: 'Juane (con plátano frito)', category: 'Comidas', price: 20, pricePrefix: '', image: '', desc: '' },
  { id: 'm51', name: 'Plato Mixto (Juane, Tacacho, Cecina, Patacones, Yuca frita y Ají de cocona)', category: 'Comidas', price: 35, pricePrefix: '', image: '', desc: '' },
  { id: 'm52', name: 'Tacacho con Cecina y Chorizo', category: 'Comidas', price: 40, pricePrefix: '', image: '', desc: '' },
  { id: 'm53', name: 'Ceviche de Paiche', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },
  { id: 'm54', name: 'Sudado de Pescado', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },
  { id: 'm55', name: 'Chicharrón de Pescado', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },
  { id: 'm56', name: 'Piqueo Tocachino', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },
  { id: 'm57', name: 'Juane de Gallina', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },
  { id: 'm58', name: 'Tacacho con Cecinas', category: 'Comidas', price: 40, pricePrefix: 'Desde ', image: '', desc: '' },

  { id: 'm5', name: 'INKA COLA', category: 'Bebidas', price: 3, image: '/camucamu.png', desc: '' },
  { id: 'm6', name: 'AGUA SIN GAS - CON GAS', category: 'Bebidas', price: 4, image: '/camucamu.png', desc: '' },
  { id: 'm7', name: 'SPORADE - POWERADE', category: 'Bebidas', price: 4, image: '/camucamu.png', desc: '' },
  { id: 'm8', name: 'VOLT', category: 'Bebidas', price: 0, image: '/camucamu.png', desc: '' },
  { id: 'm9', name: 'JARRA DE REFRESCO', category: 'Bebidas', price: 16, image: '/camucamu.png', desc: '' },
  { id: 'm10', name: 'CERVEZA CRISTAL 850 ML', category: 'Bebidas', price: 0, image: '/camucamu.png', desc: '' },
  { id: 'm11', name: 'CORONA - HEINEKEN - STELLA ARTOIS', category: 'Bebidas', price: 10, image: '/camucamu.png', desc: '' },
  { id: 'm12', name: 'RED BULL', category: 'Bebidas', price: 10, image: '/camucamu.png', desc: '' },
  { id: 'm13', name: 'CUSQUEÑA 620 ML', category: 'Bebidas', price: 12, image: '/camucamu.png', desc: '' },
  { id: 'm14', name: 'CUSQUEÑA 310 ML', category: 'Bebidas', price: 7, image: '/camucamu.png', desc: '' },
  { id: 'm38', name: 'CAMU CAMU FROZEN', category: 'Bebidas', price: 25, image: '/camucamu.png', desc: '' },
  { id: 'm39', name: 'MARACUYÁ FROZEN', category: 'Bebidas', price: 25, image: '/camucamu.png', desc: '' },
  { id: 'm40', name: 'LIMONADA FROZEN', category: 'Bebidas', price: 25, image: '/camucamu.png', desc: '' },
  { id: 'm41', name: 'CHICHA FROZEN', category: 'Bebidas', price: 25, image: '/camucamu.png', desc: '' },
  { id: 'm42', name: 'LIMONADA (Hierba Buena o Acerezada)', category: 'Bebidas', price: 25, image: '/camucamu.png', desc: '' },
  
  { id: 'm15', name: 'CHILCANO CLÁSICO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm16', name: 'CHILCANO DE MARACUYÁ', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm17', name: 'CHILCANO DE CAMU CAMU', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm18', name: 'PISCO SOUR CLÁSICO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm19', name: 'MARACUYÁ SOUR', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm20', name: 'CAMU CAMU SOUR', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm21', name: 'ALGARROBINA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm22', name: 'MACHU PICCHU', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm23', name: 'SACSAYHUAMAN', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm24', name: 'MOJITO CLÁSICO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm25', name: 'MOJITO DE COCO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm26', name: 'DAIKIRI DE DURAZNO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm27', name: 'DAIKIRI DE FRESA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm28', name: 'CUBA LIBRE', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm29', name: 'CHAPITO', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm30', name: 'PIÑA COLADA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm31', name: 'PANTERA ROSA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm32', name: 'VASO DE RON (Capitan Morgan)', category: 'Cócteles', price: 18, image: '/camucamu.png', desc: '' },
  { id: 'm33', name: 'VASO DE RON (Etiqueta Negra)', category: 'Cócteles', price: 25, image: '/camucamu.png', desc: '' },
  { id: 'm34', name: 'TEQUILA SUNRISE', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm35', name: 'MARGARITA CLÁSICA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm36', name: 'MARGARITA BLUE', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  { id: 'm37', name: 'MICHELADA MEXICANA', category: 'Cócteles', price: 15, image: '/camucamu.png', desc: '' },
  
  { id: 'm43', name: 'COMBO MORGAN - CHAPITO', category: 'Cócteles', price: 120, image: '/camucamu.png', desc: '3 Coca Colas de 500 ml + 1 Jugo de Naranja + 1 Bolsa de Hielo + 1 Capitan Morgan' },
  { id: 'm44', name: 'COMBO ETIQUETA ROJA', category: 'Cócteles', price: 120, image: '/camucamu.png', desc: '2 Agua Mineral con gas + 1 red bull + 1 Jonny Walker etiqueta roja' },
  { id: 'm45', name: 'COMBO CHIVAS', category: 'Cócteles', price: 180, image: '/camucamu.png', desc: '2 Agua Mineral con gas + 1 red bull + 1 Bolsa de Hielo + 1 Whiskey Chivas Regal' },
  { id: 'm46', name: 'CHIVAS JONNY WALKER BLACK', category: 'Cócteles', price: 220, image: '/camucamu.png', desc: '2 Agua Mineral con gas + 1 red bull + 1 Jonny Walker etiqueta negra' },
  { id: 'm47', name: 'TABERNERO BORGOÑA SEMI SECO - BOTELLA', category: 'Cócteles', price: 45, image: '/camucamu.png', desc: '' },
  { id: 'm48', name: 'COPA DE VINO', category: 'Cócteles', price: 10, image: '/camucamu.png', desc: '' },
  { id: 'm49', name: 'CASILLERO DEL DIABLO - BOTELLA', category: 'Cócteles', price: 75, image: '/camucamu.png', desc: '' },
];

export const categories = ['Habitaciones', 'Comidas', 'Bebidas', 'Cócteles'];
