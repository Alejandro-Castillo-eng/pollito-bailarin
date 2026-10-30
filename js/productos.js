// Datos del catálogo "Pollito Bailarín" (extraídos del PDF del catálogo).
// estado: 'disponible' | 'pronto' (se puede separar con el 50%) | 'agotado'

export const TIENDA = {
  nombre: 'Pollito Bailarín',
  telefono: '924943033',
  whatsapp: '51924943033',
  instagram: 'pollitobailarin.pe',
  tiktok: 'pollito.bailarinn',
};

export const CATEGORIAS = [
  { id: 'todos', nombre: 'Todo' },
  { id: 'sylvanian', nombre: 'Sylvanian Families' },
  { id: 'bolsos', nombre: 'Monederos, estuches y bolsos' },
  { id: 'peluches', nombre: 'Peluches y llaveros' },
  { id: 'blindbox', nombre: 'Blind Boxes' },
  { id: 'photocards', nombre: 'Photocards' },
  { id: 'papeleria', nombre: 'Papelería y juguetes' },
];

const img = (n) => `img/productos/${n}.webp`;

export const PRODUCTOS = [
  // 01 · Sylvanian Families
  { id: 'mini-forest', nombre: 'Mini Forest Costume Babies Series', categoria: 'sylvanian', precio: 26, estado: 'pronto', imgs: [img('mini-forest-babies')] },
  { id: 'ardilla-kinder', nombre: 'Ardilla Kinder Individual', categoria: 'sylvanian', precio: 30, estado: 'agotado', imgs: [img('ardilla-kinder')] },
  { id: 'ratoncito-bebe', nombre: 'Ratoncito bebé', categoria: 'sylvanian', precio: 40, estado: 'agotado', imgs: [img('ratoncito-bebe')] },

  // 02 · Monederos, estuches y bolsos
  { id: 'estuche-pompompurin', nombre: 'Estuche de peluche Pompompurin y Cinnamoroll', categoria: 'bolsos', precio: 20, porUnidad: true, estado: 'pronto', imgs: [img('estuche-pompompurin-cinnamoroll')] },
  { id: 'estuche-hello-kitty', nombre: 'Estuche de peluche Hello Kitty', categoria: 'bolsos', precio: 13, antes: 16, estado: 'disponible', imgs: [img('estuche-hello-kitty')] },
  { id: 'estuche-kuromi', nombre: 'Estuche de peluche Kuromi', categoria: 'bolsos', precio: 16, estado: 'disponible', imgs: [img('estuche-kuromi')] },
  { id: 'estuche-cinnamoroll', nombre: 'Estuche de peluche Cinnamoroll', categoria: 'bolsos', precio: 16, estado: 'disponible', imgs: [img('estuche-cinnamoroll')] },
  { id: 'estuche-my-sweet-piano', nombre: 'Estuche de peluche My Sweet Piano', categoria: 'bolsos', precio: 15, estado: 'disponible', imgs: [img('estuche-my-sweet-piano')] },
  { id: 'estuche-pastel', nombre: 'Estuche de peluche Pastel de cereza', categoria: 'bolsos', precio: 15, porUnidad: true, estado: 'disponible', imgs: [img('estuche-pastel-cereza-rosa'), img('estuche-pastel-cereza-celeste')] },
  { id: 'ita-bag', nombre: 'Ita Bag', categoria: 'bolsos', precio: 40, estado: 'pronto', nota: 'No incluye accesorios, solo incluye charm de perlas con lazo.', imgs: [img('ita-bag-rosa'), img('ita-bag-amarilla'), img('ita-bag-negra')] },
  { id: 'bolso-sanrio', nombre: 'Bolso Sanrio Cinnamoroll y My Melody', categoria: 'bolsos', precio: 25, estado: 'pronto', imgs: [img('bolso-my-melody'), img('bolso-cinnamoroll')] },
  { id: 'mochila-fresita', nombre: 'Mochila Fresita', categoria: 'bolsos', precio: 45, estado: 'pronto', imgs: [img('mochila-fresita')] },
  { id: 'monedero-sanrio', nombre: 'Monedero Sanrio', categoria: 'bolsos', precio: 6, antes: 8, porUnidad: true, estado: 'disponible', nota: 'Quedan pocos modelos, ¡pregunta por los disponibles!', imgs: [img('monedero-sanrio')] },
  { id: 'monedero-hello-kitty', nombre: 'Monedero Hello Kitty', categoria: 'bolsos', precio: 8, antes: 10, porUnidad: true, estado: 'agotado', nota: 'Medidas: 10 cm × 8 cm.', imgs: [img('monedero-hello-kitty')] },

  // 03 · Peluches y llaveros
  { id: 'peluche-perrito-rosa', nombre: 'Peluche Perrito rosado', categoria: 'peluches', precio: 11.5, estado: 'disponible', nota: 'Mide aprox. 15 cm.', imgs: [img('peluche-perrito-rosa')] },
  { id: 'peluche-perrito-gris', nombre: 'Peluche Perrito gris (llavero)', categoria: 'peluches', precio: 10, estado: 'disponible', imgs: [img('peluche-perrito-gris')] },
  { id: 'peluche-foca', nombre: 'Peluche Foca', categoria: 'peluches', precio: 16, estado: 'disponible', imgs: [img('peluche-foca'), img('peluche-foca-2')] },
  { id: 'llaveros-chiikawa', nombre: 'Llaveros Chiikawa', categoria: 'peluches', precio: 4, porUnidad: true, estado: 'disponible', nota: 'Algunos modelos agotados.', imgs: [img('llaveros-chiikawa')] },
  { id: 'llaveros-chiikawa-gyaru', nombre: 'Llaveros Chiikawa Gyaru', categoria: 'peluches', precio: 5, porUnidad: true, estado: 'disponible', nota: 'Un modelo agotado.', imgs: [img('llaveros-chiikawa-gyaru')] },

  // 04 · Blind Boxes
  { id: 'sonny-angel', nombre: 'Sonny Angel Hippers', categoria: 'blindbox', precio: 10, antes: 12, porUnidad: true, estado: 'disponible', imgs: [img('sonny-angel-hippers')] },
  { id: 'my-little-pony', nombre: 'My Little Pony', categoria: 'blindbox', precio: 12, antes: 15, porUnidad: true, estado: 'disponible', imgs: [img('my-little-pony')] },

  // 05 · Photocards
  { id: 'bolsas-llavero', nombre: 'Bolsas llavero Candy', categoria: 'photocards', precio: 4, antes: 5, porUnidad: true, estado: 'disponible', imgs: [img('bolsas-llavero')] },
  { id: 'binders-corazon', nombre: 'Binders corazón', categoria: 'photocards', precio: 12, porUnidad: true, estado: 'pronto', imgs: [img('binders-corazon')] },

  // 06 · Papelería y juguetes
  { id: 'squishy', nombre: 'Squishy de mantequilla y de fresa', categoria: 'papeleria', precio: 6, antes: 8, porUnidad: true, estado: 'disponible', nota: 'El de fresa está agotado.', imgs: [img('squishy-mantequilla-fresa')] },
  { id: 'cajitas-stickers', nombre: 'Cajitas de stickers (100 pcs)', categoria: 'papeleria', precio: 15, porUnidad: true, estado: 'disponible', imgs: [img('stickers-sanrio-caja'), img('stickers-cinnamon-caja')] },
  { id: 'stickers-chiikawa', nombre: 'Stickers Chiikawa', categoria: 'papeleria', precio: 4, porUnidad: true, estado: 'disponible', imgs: [img('stickers-chiikawa')] },
  { id: 'stickers-sanrio', nombre: 'Stickers Sanrio', categoria: 'papeleria', precio: 5, porUnidad: true, estado: 'pronto', imgs: [img('stickers-sanrio')] },
  { id: 'lapiceros-unicornio', nombre: 'Pack lapiceros Sanrio Unicornio', categoria: 'papeleria', precio: 13, estado: 'disponible', imgs: [img('lapiceros-sanrio-unicornio')] },
  { id: 'lapiceros-angel', nombre: 'Pack lapiceros Angel rosita', categoria: 'papeleria', precio: 14, estado: 'pronto', imgs: [img('lapiceros-angel-rosita')] },
  { id: 'juguete-ramen', nombre: 'Juguete Ramen', categoria: 'papeleria', precio: 16, estado: 'disponible', imgs: [img('juguete-ramen')] },
];

// Productos que giran en la vitrina 3D (fotos con fondo transparente)
export const DESTACADOS = [
  'estuche-hello-kitty', 'estuche-kuromi', 'mochila-fresita', 'sonny-angel', 'estuche-cinnamoroll',
  'juguete-ramen', 'bolso-sanrio', 'estuche-pastel', 'my-little-pony', 'peluche-foca', 'estuche-my-sweet-piano', 'lapiceros-unicornio',
];

export const VIDEOS = [
  { id: 'uvKs6j6No5c', titulo: 'Sylvanian Families · 40 aniversario', canal: 'Sylvanian Families Official', tag: 'Sylvanian' },
  { id: '7x0L3PrHKEg', titulo: 'Hello Kitty and Friends · Aventuras de verano', canal: 'Hello Kitty and Friends', tag: 'Sanrio' },
  { id: 'Qjnla_cosoo', titulo: 'Chiikawa · episodios completos', canal: 'Chiikawa Official', tag: 'Chiikawa' },
  { id: '8DyN-ctdFow', titulo: 'Los 5 mejores episodios de My Melody', canal: 'Hello Kitty and Friends', tag: 'Sanrio' },
  { id: 'jBzvE-IHCf8', titulo: 'Unboxing Sonny Angel Dreaming Hippers', canal: 'Sally Dicker', tag: 'Blind Box' },
  { id: 'wncB6LwnV_k', titulo: 'Kuromi, Cinnamoroll y amigos · Top 5', canal: 'Hello Kitty and Friends', tag: 'Sanrio' },
];

export const precio = (n) => 'S/ ' + (Number.isInteger(n) ? n : n.toFixed(2));
