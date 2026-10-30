// Vitrina 3D: carrusel circular con productos destacados. Arrastrar para girar, tocar para ver.
import * as THREE from 'three';
import { PRODUCTOS, DESTACADOS, precio } from './productos.js';

const canvas = document.getElementById('escenaVitrina');
const seccion = document.getElementById('vitrina');
const etiquetaNombre = document.getElementById('vitrinaNombre');
const etiquetaPrecio = document.getElementById('vitrinaPrecio');
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch {
  seccion.classList.add('vitrina--sin-webgl');
}
if (renderer) iniciar();

function iniciar() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.NoToneMapping;

  const productos = DESTACADOS.map((id) => PRODUCTOS.find((p) => p.id === id)).filter(Boolean);
  const N = productos.length;
  const PASO = (Math.PI * 2) / N;
  const RADIO = 6.2;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  escena.add(new THREE.HemisphereLight(0xffffff, 0xf7b6cf, 2.2));
  const luz = new THREE.DirectionalLight(0xffffff, 1.2);
  luz.position.set(2, 5, 8);
  escena.add(luz);

  /* ───── Tarjetas ───── */
  const rect = (w, h, r) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  };
  const geoTarjeta = new THREE.ExtrudeGeometry(rect(2.6, 3.1, 0.35), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 12 });
  geoTarjeta.translate(0, 0, -0.08);
  const matFrente = new THREE.MeshStandardMaterial({ color: 0xfff3f8, roughness: 0.7 });
  const matBorde = new THREE.MeshStandardMaterial({ color: 0xf28db5, roughness: 0.5 });
  const geoMarco = new THREE.ShapeGeometry(rect(2.36, 2.86, 0.26));
  const matMarco = new THREE.MeshBasicMaterial({ color: 0xfde3ee });

  // Etiqueta de precio dibujada en canvas (forma de corazón como en el catálogo)
  const texturaPrecio = (texto) => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const x = c.getContext('2d');
    x.translate(128, 136);
    x.fillStyle = '#ec6fa2';
    x.beginPath();
    x.moveTo(0, -50);
    x.bezierCurveTo(0, -95, -110, -100, -110, -20);
    x.bezierCurveTo(-110, 40, -40, 80, 0, 110);
    x.bezierCurveTo(40, 80, 110, 40, 110, -20);
    x.bezierCurveTo(110, -100, 0, -95, 0, -50);
    x.fill();
    x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke();
    x.fillStyle = '#fff';
    x.font = `700 ${texto.length > 6 ? 40 : 48}px Quicksand, sans-serif`;
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(texto, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };

  const carrusel = new THREE.Group();
  escena.add(carrusel);
  const cargador = new THREE.TextureLoader();
  const tarjetas = [];

  document.fonts.load('700 48px Quicksand').catch(() => {}).finally(() => {
    productos.forEach((p, i) => {
      const a = i * PASO;
      const pivote = new THREE.Group();
      pivote.position.set(Math.sin(a) * RADIO, 0, Math.cos(a) * RADIO);
      pivote.rotation.y = a;
      const tarjeta = new THREE.Group();
      pivote.add(tarjeta);

      tarjeta.add(new THREE.Mesh(geoTarjeta, [matFrente, matBorde]));
      const marco = new THREE.Mesh(geoMarco, matMarco);
      marco.position.z = 0.055; // el bisel deja la cara frontal en z = 0.05
      tarjeta.add(marco);

      const foto = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
      foto.position.set(0, 0.05, 0.07);
      tarjeta.add(foto);
      cargador.load(p.imgs[0], (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const { width, height } = tex.image;
        const max = 2.05;
        const k = max / Math.max(width, height);
        foto.scale.set(width * k, height * k, 1);
        foto.material.map = tex;
        foto.material.opacity = 1;
        foto.material.needsUpdate = true;
      });

      const etiqueta = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), new THREE.MeshBasicMaterial({ map: texturaPrecio(precio(p.precio).replace(' ', '')), transparent: true }));
      etiqueta.position.set(0.95, -1.28, 0.09);
      etiqueta.rotation.z = -0.15;
      tarjeta.add(etiqueta);

      tarjeta.userData = { id: p.id, i, escala: 1 };
      carrusel.add(pivote);
      tarjetas.push(tarjeta);
    });
  });

  // Piso: plataforma redonda con rayas rosas
  const texPiso = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d');
    for (let i = 0; i < 48; i++) {
      x.fillStyle = i % 2 ? '#fde6ef' : '#f9c9dc';
      x.beginPath(); x.moveTo(256, 256);
      x.arc(256, 256, 256, (i / 48) * Math.PI * 2, ((i + 1) / 48) * Math.PI * 2);
      x.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const piso = new THREE.Mesh(new THREE.CylinderGeometry(RADIO + 2, RADIO + 2.2, 0.35, 96), [
    new THREE.MeshStandardMaterial({ color: 0xec6fa2, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ map: texPiso, roughness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0xec6fa2 }),
  ]);
  piso.position.y = -2.05;
  escena.add(piso);
  const borde = new THREE.Mesh(new THREE.TorusGeometry(RADIO + 2.1, 0.12, 12, 120), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
  borde.rotation.x = Math.PI / 2;
  borde.position.y = -1.86;
  escena.add(borde);

  /* ───── Tamaño ───── */
  function ajustar() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    // En pantallas angostas alejamos la cámara para que quepa la tarjeta del frente
    const distancia = camara.aspect < 1 ? 7 + (1 - camara.aspect) * 7 : 7;
    camara.position.set(0, 1.3, RADIO + distancia);
    camara.lookAt(0, -0.75, RADIO * 0.35);
    camara.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(canvas);
  ajustar();

  /* ───── Arrastre e inercia ───── */
  let angulo = 0, velocidad = 0, arrastrando = false, ultimoX = 0, ultimoT = 0, movido = 0, ultimaAccion = -10;
  const reloj = new THREE.Clock();

  canvas.addEventListener('pointerdown', (e) => {
    arrastrando = true; movido = 0; ultimoX = e.clientX; ultimoT = performance.now(); velocidad = 0; objetivo = null;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('arrastrando');
  });
  canvas.addEventListener('pointermove', (e) => {
    actualizarHover(e);
    if (!arrastrando) return;
    const dx = e.clientX - ultimoX;
    ultimoX = e.clientX;
    movido += Math.abs(dx);
    const delta = (dx / canvas.clientWidth) * Math.PI * 1.4;
    angulo += delta;
    const ahora = performance.now();
    velocidad = (delta / Math.max((ahora - ultimoT) / 1000, 1 / 120)) * 0.4;
    ultimoT = ahora;
    ultimaAccion = reloj.elapsedTime;
  });
  const soltar = (e) => {
    if (!arrastrando) return;
    arrastrando = false;
    canvas.classList.remove('arrastrando');
    ultimaAccion = reloj.elapsedTime;
    if (movido < 6) tocar(e);
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', () => { arrastrando = false; canvas.classList.remove('arrastrando'); });

  const rayo = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  let hover = null;
  function tarjetaBajo(e) {
    const r = canvas.getBoundingClientRect();
    puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(puntero, camara);
    const hit = rayo.intersectObjects(tarjetas, true)[0];
    if (!hit) return null;
    let o = hit.object;
    while (!o.userData.id) o = o.parent;
    return o;
  }
  function actualizarHover(e) {
    if (arrastrando) return;
    hover = tarjetaBajo(e);
    canvas.style.cursor = hover ? 'pointer' : '';
  }
  canvas.addEventListener('pointerleave', () => { hover = null; });

  function tocar(e) {
    const t = tarjetaBajo(e);
    if (!t) return;
    const frente = indiceFrente();
    if (t.userData.i === frente) {
      dispatchEvent(new CustomEvent('abrir-producto', { detail: t.userData.id }));
    } else {
      // Primero la traemos al frente
      objetivo = -t.userData.i * PASO;
      const dif = ((objetivo - angulo) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      objetivo = angulo + dif;
      ultimaAccion = reloj.elapsedTime;
    }
  }
  let objetivo = null;

  const indiceFrente = () => ((Math.round(-angulo / PASO) % N) + N) % N;

  /* ───── Animación ───── */
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  let frenteMostrado = -1;

  renderer.setAnimationLoop(() => {
    const dt = Math.min(reloj.getDelta(), 0.05);
    if (!visible || document.hidden) return;
    const t = reloj.elapsedTime;

    if (!arrastrando) {
      if (objetivo !== null) {
        angulo += (objetivo - angulo) * Math.min(dt * 6, 1);
        if (Math.abs(objetivo - angulo) < 0.001) objetivo = null;
        velocidad = 0;
      } else if (Math.abs(velocidad) > 0.02) {
        angulo += velocidad * dt;
        velocidad *= Math.pow(0.04, dt);
      } else if (t - ultimaAccion > 3 && !reducirMovimiento) {
        angulo -= dt * 0.18; // giro automático suave
      } else {
        // se acomoda en la tarjeta más cercana
        const cerca = Math.round(angulo / PASO) * PASO;
        angulo += (cerca - angulo) * Math.min(dt * 4, 1);
      }
    }
    carrusel.rotation.y = angulo;

    const frente = indiceFrente();
    for (const tj of tarjetas) {
      const objetivoEscala = tj === hover ? 1.08 : tj.userData.i === frente ? 1.03 : 0.94;
      tj.userData.escala += (objetivoEscala - tj.userData.escala) * Math.min(dt * 8, 1);
      tj.scale.setScalar(tj.userData.escala);
      tj.position.y = Math.sin(t * 1.4 + tj.userData.i) * 0.08;
    }

    if (frente !== frenteMostrado && productos[frente]) {
      frenteMostrado = frente;
      const p = productos[frente];
      etiquetaNombre.textContent = p.nombre;
      etiquetaPrecio.textContent = precio(p.precio) + (p.porUnidad ? ' c/u' : '');
    }

    renderer.render(escena, camara);
  });
}
