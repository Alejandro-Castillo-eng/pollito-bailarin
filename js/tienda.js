import { TIENDA, CATEGORIAS, PRODUCTOS, VIDEOS, precio } from './productos.js';

const $ = (s, el = document) => el.querySelector(s);
const porId = Object.fromEntries(PRODUCTOS.map((p) => [p.id, p]));
const nombreCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.nombre]));

const urlWhatsapp = (texto) => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`;
const urlInstagram = `https://www.instagram.com/${TIENDA.instagram}/`;
const urlTiktok = `https://www.tiktok.com/@${TIENDA.tiktok}`;

/* ───────── Enlaces de contacto ───────── */
$('#heroWhatsapp').href = urlWhatsapp('¡Hola Pollito Bailarín! 🐣 Quisiera hacer un pedido.');
$('#contactoWhatsapp').href = urlWhatsapp('¡Hola Pollito Bailarín! 🐣');
$('#contactoInstagram').href = urlInstagram;
$('#contactoTiktok').href = urlTiktok;
$('#pieInstagram').href = urlInstagram;
$('#pieTiktok').href = urlTiktok;

/* ───────── Navegación ───────── */
const nav = $('#nav');
const menu = $('#menu');
const hamburguesa = $('#hamburguesa');
const alHacerScroll = () => nav.classList.toggle('nav--fija', scrollY > 30);
addEventListener('scroll', alHacerScroll, { passive: true });
alHacerScroll();
hamburguesa.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  hamburguesa.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) { menu.classList.remove('abierto'); hamburguesa.setAttribute('aria-expanded', 'false'); }
});

/* ───────── Aviso flotante ───────── */
let temporizadorAviso;
function avisar(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => el.classList.remove('visible'), 2400);
}

/* ───────── Insignias y precio ───────── */
function insigniasHTML(p) {
  const out = [];
  if (p.antes && p.estado !== 'agotado') out.push('<span class="insignia insignia--oferta">Oferta</span>');
  if (p.estado === 'pronto') out.push('<span class="insignia insignia--pronto">Pronto · separa con 50%</span>');
  if (p.estado === 'agotado') out.push('<span class="insignia insignia--agotado">Agotado</span>');
  return out.join('');
}
function precioHTML(p) {
  return `<div class="precio">
    <span class="precio__actual">${precio(p.precio)}${p.porUnidad ? ' <span class="precio__unidad">c/u</span>' : ''}</span>
    ${p.antes ? `<span class="precio__antes">Antes ${precio(p.antes)}</span>` : ''}
  </div>`;
}

/* ───────── Catálogo ───────── */
const filtro = { categoria: 'todos', ofertas: false, sinAgotados: false };
const contCategorias = $('#filtrosCategorias');

contCategorias.innerHTML = CATEGORIAS.map((c) =>
  `<button class="chip" role="tab" data-categoria="${c.id}" aria-selected="${c.id === 'todos'}">${c.nombre}</button>`).join('');
contCategorias.addEventListener('click', (e) => {
  const b = e.target.closest('[data-categoria]');
  if (!b) return;
  filtro.categoria = b.dataset.categoria;
  contCategorias.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-selected', c === b));
  pintarCatalogo();
});
$('#soloOfertas').addEventListener('change', (e) => { filtro.ofertas = e.target.checked; pintarCatalogo(); });
$('#ocultarAgotados').addEventListener('change', (e) => { filtro.sinAgotados = e.target.checked; pintarCatalogo(); });

function pintarCatalogo() {
  const lista = PRODUCTOS.filter((p) =>
    (filtro.categoria === 'todos' || p.categoria === filtro.categoria) &&
    (!filtro.ofertas || p.antes) &&
    (!filtro.sinAgotados || p.estado !== 'agotado'))
    .sort((a, b) => (a.estado === 'agotado') - (b.estado === 'agotado')); // agotados al final

  $('#grillaVacia').hidden = lista.length > 0;
  $('#grillaProductos').innerHTML = lista.map((p, i) => `
    <article class="tarjeta${p.estado === 'agotado' ? ' tarjeta--agotado' : ''}" style="animation-delay:${Math.min(i, 12) * 40}ms" data-id="${p.id}">
      <div class="insignias">${insigniasHTML(p)}</div>
      <button class="tarjeta__foto" data-ver="${p.id}" aria-label="Ver ${p.nombre}">
        <img src="${p.imgs[0]}" alt="${p.nombre}" loading="lazy" width="400" height="400">
        ${p.imgs.length > 1 ? `<span class="tarjeta__mas">+${p.imgs.length - 1} fotos</span>` : ''}
      </button>
      <div class="tarjeta__info">
        <h3 class="tarjeta__nombre">${p.nombre}</h3>
        ${p.nota ? `<p class="tarjeta__nota">${p.nota}</p>` : ''}
        <div class="tarjeta__pie">
          ${precioHTML(p)}
          <button class="btn-agregar" data-agregar="${p.id}" ${p.estado === 'agotado' ? 'disabled aria-label="Agotado"' : `aria-label="Agregar ${p.nombre} al pedido"`}>+</button>
        </div>
      </div>
    </article>`).join('');
}

$('#grillaProductos').addEventListener('click', (e) => {
  const ver = e.target.closest('[data-ver]');
  const agregar = e.target.closest('[data-agregar]');
  if (ver) abrirProducto(ver.dataset.ver);
  if (agregar) agregarAlPedido(agregar.dataset.agregar, 1);
});

// Inclinación 3D suave de las tarjetas al pasar el mouse
const grilla = $('#grillaProductos');
if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  grilla.addEventListener('pointermove', (e) => {
    const t = e.target.closest('.tarjeta');
    if (!t) return;
    const r = t.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    t.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  grilla.addEventListener('pointerout', (e) => {
    const t = e.target.closest('.tarjeta');
    if (t && !t.contains(e.relatedTarget)) t.style.transform = '';
  });
}

/* ───────── Modal de producto ───────── */
const modal = $('#modalProducto');
let productoModal = null;
let cantidadModal = 1;

function abrirProducto(id) {
  const p = porId[id];
  if (!p) return;
  productoModal = p;
  cantidadModal = 1;
  $('#modalCategoria').textContent = nombreCategoria[p.categoria];
  $('#modalNombre').textContent = p.nombre;
  $('#modalPrecio').innerHTML = precioHTML(p);
  $('#modalInsignias').innerHTML = insigniasHTML(p);
  $('#modalNota').textContent = p.nota || (p.estado === 'pronto' ? 'Llega pronto: puedes separarlo pagando el 50%.' : '');
  $('#modalCantidad').textContent = 1;
  mostrarFoto(0);
  $('#modalMiniaturas').innerHTML = p.imgs.length > 1
    ? p.imgs.map((src, i) => `<button data-foto="${i}" aria-label="Foto ${i + 1}" aria-current="${i === 0}"><img src="${src}" alt=""></button>`).join('')
    : '';
  const boton = $('#modalAgregar');
  boton.disabled = p.estado === 'agotado';
  boton.textContent = p.estado === 'agotado' ? 'Agotado por ahora' : p.estado === 'pronto' ? 'Separar en mi pedido' : 'Agregar al pedido';
  $('.modal__cantidad').hidden = p.estado === 'agotado';
  modal.showModal();
}
function mostrarFoto(i) {
  const img = $('#modalImagen');
  img.src = productoModal.imgs[i];
  img.alt = productoModal.nombre;
  $('#modalMiniaturas').querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-current', i === j));
}
$('#modalMiniaturas').addEventListener('click', (e) => {
  const b = e.target.closest('[data-foto]');
  if (b) mostrarFoto(+b.dataset.foto);
});
$('#modalMenos').addEventListener('click', () => { cantidadModal = Math.max(1, cantidadModal - 1); $('#modalCantidad').textContent = cantidadModal; });
$('#modalMas').addEventListener('click', () => { cantidadModal = Math.min(20, cantidadModal + 1); $('#modalCantidad').textContent = cantidadModal; });
$('#modalAgregar').addEventListener('click', () => { agregarAlPedido(productoModal.id, cantidadModal); modal.close(); });
modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-cerrar]')) modal.close(); });

// La vitrina 3D pide abrir productos con este evento
addEventListener('abrir-producto', (e) => abrirProducto(e.detail));

/* ───────── Pedido (carrito) ───────── */
const CLAVE = 'pollito-pedido';
let pedido = {};
try { pedido = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { pedido = {}; }
for (const id of Object.keys(pedido)) if (!porId[id] || porId[id].estado === 'agotado') delete pedido[id];

const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch { /* sin almacenamiento */ } };

function agregarAlPedido(id, cantidad) {
  const p = porId[id];
  if (!p || p.estado === 'agotado') return;
  pedido[id] = Math.min(20, (pedido[id] || 0) + cantidad);
  guardar();
  pintarPedido();
  const b = $('#abrirPedido');
  b.classList.remove('salto'); void b.offsetWidth; b.classList.add('salto');
  avisar(`🐣 ${p.nombre} ${p.estado === 'pronto' ? 'separado' : 'agregado'} a tu pedido`);
}

function pintarPedido() {
  const ids = Object.keys(pedido);
  const unidades = ids.reduce((s, id) => s + pedido[id], 0);
  const total = ids.reduce((s, id) => s + pedido[id] * porId[id].precio, 0);
  $('#contadorPedido').textContent = unidades;
  $('#pedidoVacio').hidden = ids.length > 0;
  $('#totalPedido').textContent = precio(Math.round(total * 100) / 100);
  $('#avisoSeparar').hidden = !ids.some((id) => porId[id].estado === 'pronto');

  $('#listaPedido').innerHTML = ids.map((id) => {
    const p = porId[id];
    return `<li class="pedido__item">
      <img src="${p.imgs[0]}" alt="">
      <div>
        <h4>${p.nombre}</h4>
        <small>${precio(p.precio)}${p.porUnidad ? ' c/u' : ''}${p.estado === 'pronto' ? ' · separar 50%' : ''}</small>
      </div>
      <div class="pedido__item-der">
        <strong>${precio(Math.round(p.precio * pedido[id] * 100) / 100)}</strong>
        <div class="contador">
          <button data-menos="${id}" aria-label="Quitar uno">−</button>
          <output>${pedido[id]}</output>
          <button data-mas="${id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
    </li>`;
  }).join('');

  const enviar = $('#enviarPedido');
  if (ids.length) {
    const lineas = ids.map((id) => {
      const p = porId[id];
      return `• ${pedido[id]} × ${p.nombre} (${precio(p.precio)}${p.porUnidad ? ' c/u' : ''})${p.estado === 'pronto' ? ' – separar con 50%' : ''}`;
    });
    enviar.href = urlWhatsapp(`¡Hola Pollito Bailarín! 🐣 Quisiera hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${$('#totalPedido').textContent}\n\n¿Me confirman disponibilidad y el envío? ¡Gracias!`);
    enviar.removeAttribute('aria-disabled');
  } else {
    enviar.href = '#';
    enviar.setAttribute('aria-disabled', 'true');
  }
}

$('#listaPedido').addEventListener('click', (e) => {
  const mas = e.target.closest('[data-mas]');
  const menos = e.target.closest('[data-menos]');
  if (mas) pedido[mas.dataset.mas] = Math.min(20, pedido[mas.dataset.mas] + 1);
  if (menos) { const id = menos.dataset.menos; pedido[id]--; if (pedido[id] <= 0) delete pedido[id]; }
  if (mas || menos) { guardar(); pintarPedido(); }
});
$('#vaciarPedido').addEventListener('click', () => { pedido = {}; guardar(); pintarPedido(); });

const panel = $('#panelPedido');
const abrirPanel = (abrir) => {
  panel.classList.toggle('abierto', abrir);
  panel.setAttribute('aria-hidden', !abrir);
  if (abrir) panel.querySelector('[data-cerrar-pedido].modal__cerrar').focus();
};
$('#abrirPedido').addEventListener('click', () => abrirPanel(true));
panel.addEventListener('click', (e) => { if (e.target.closest('[data-cerrar-pedido]')) abrirPanel(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('abierto')) abrirPanel(false); });

/* ───────── Videos (se cargan al hacer clic) ───────── */
$('#grillaVideos').innerHTML = VIDEOS.map((v) => `
  <article class="video">
    <div class="video__marco">
      <button class="video__boton" data-video="${v.id}" aria-label="Reproducir: ${v.titulo}">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
        <span class="video__play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16l14-8z" fill="currentColor"/></svg></span>
      </button>
    </div>
    <div class="video__info">
      <span class="video__tag">${v.tag}</span>
      <h3 class="video__titulo">${v.titulo}</h3>
      <p class="video__canal">${v.canal}</p>
    </div>
  </article>`).join('');

$('#grillaVideos').addEventListener('click', (e) => {
  const b = e.target.closest('[data-video]');
  if (!b) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0`;
  iframe.title = b.getAttribute('aria-label').replace('Reproducir: ', '');
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  b.replaceWith(iframe);
});

pintarCatalogo();
pintarPedido();
