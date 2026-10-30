// Escena 3D del hero: el pollito bailarín con tutú, rodeado de botones, estrellas y corazones.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('escenaHero');
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch {
  canvas.remove(); // sin WebGL: el hero sigue funcionando con el fondo de rayas
}

if (renderer) iniciar();

function iniciar() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camara.position.set(0, 0, 14);

  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.85;
  escena.add(new THREE.HemisphereLight(0xfff4f8, 0xf7a8c8, 0.9));
  const sol = new THREE.DirectionalLight(0xffffff, 1.6);
  sol.position.set(3, 6, 8);
  escena.add(sol);

  /* ───── Formas compartidas ───── */
  const formaEstrella = (() => {
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.48 : 1;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return s;
  })();

  const formaCorazon = (() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.55);
    s.bezierCurveTo(0, 0.85, -0.45, 1.05, -0.75, 0.85);
    s.bezierCurveTo(-1.1, 0.6, -1.05, 0.1, -0.75, -0.2);
    s.bezierCurveTo(-0.5, -0.45, -0.15, -0.7, 0, -0.95);
    s.bezierCurveTo(0.15, -0.7, 0.5, -0.45, 0.75, -0.2);
    s.bezierCurveTo(1.05, 0.1, 1.1, 0.6, 0.75, 0.85);
    s.bezierCurveTo(0.45, 1.05, 0, 0.85, 0, 0.55);
    return s;
  })();

  const formaBoton = (() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 1, 0, Math.PI * 2, false);
    for (const [x, y] of [[-0.27, 0.27], [0.27, 0.27], [-0.27, -0.27], [0.27, -0.27]]) {
      const h = new THREE.Path();
      h.absarc(x, y, 0.12, 0, Math.PI * 2, true);
      s.holes.push(h);
    }
    return s;
  })();

  const extruir = (forma, prof, bisel) => {
    const g = new THREE.ExtrudeGeometry(forma, {
      depth: prof, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel * 0.8,
      bevelSegments: 5, curveSegments: 28,
    });
    g.center();
    return g;
  };
  const geoEstrella = extruir(formaEstrella, 0.25, 0.14);
  const geoCorazon = extruir(formaCorazon, 0.3, 0.16);
  const geoBoton = extruir(formaBoton, 0.22, 0.12);
  const geoBordeBoton = new THREE.TorusGeometry(0.74, 0.07, 12, 48);

  const mat = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3, ...extra });
  const materiales = {
    boton: mat(0xf59bbf),
    botonClaro: mat(0xfbc4d8),
    escarchaRosa: mat(0xe0307a, { metalness: 0.55, roughness: 0.3, clearcoat: 1 }),
    celeste: mat(0x8fd3ec),
    amarillo: mat(0xffdf6b),
    corazon: mat(0xff86b8),
    lila: mat(0xc6a3f0),
  };

  /* ───── El pollito ───── */
  const pollito = new THREE.Group();     // posición y escala en pantalla
  const baile = new THREE.Group();       // saltos, giros y balanceo
  const cuerpoG = new THREE.Group();     // aplastar y estirar
  pollito.add(baile);
  baile.add(cuerpoG);
  escena.add(pollito);

  const amarillo = new THREE.MeshPhysicalMaterial({ color: 0xffd640, roughness: 0.6, sheen: 1, sheenColor: new THREE.Color(0xfff3b0), sheenRoughness: 0.45 });
  const naranja = new THREE.MeshPhysicalMaterial({ color: 0xff9a3c, roughness: 0.4, clearcoat: 0.5 });
  const negro = new THREE.MeshPhysicalMaterial({ color: 0x2a1a22, roughness: 0.15, clearcoat: 1 });
  const blanco = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const rubor = new THREE.MeshBasicMaterial({ color: 0xff8fb3, transparent: true, opacity: 0.75 });
  const rosaLazo = new THREE.MeshPhysicalMaterial({ color: 0xff5f9e, roughness: 0.35, clearcoat: 0.8 });

  const malla = (geo, m, padre, pos, esc, rot) => {
    const o = new THREE.Mesh(geo, m);
    if (pos) o.position.set(...pos);
    if (esc) o.scale.set(...esc);
    if (rot) o.rotation.set(...rot);
    padre.add(o);
    return o;
  };
  const esfera = new THREE.SphereGeometry(1, 64, 48);

  const CENTRO = 1.12; // altura del centro del cuerpo (los pies están en y = 0)
  malla(esfera, amarillo, cuerpoG, [0, CENTRO, 0], [1, 1.02, 0.92]);

  // Copete
  for (const [x, rz, h] of [[-0.09, 0.45, 0.2], [0, 0, 0.28], [0.09, -0.45, 0.2]]) {
    malla(new THREE.CapsuleGeometry(0.055, h, 6, 12), amarillo, cuerpoG, [x, CENTRO + 1.08 + h / 2, 0], null, [0, 0, rz]);
  }

  // Ojos con brillo
  for (const s of [-1, 1]) {
    malla(esfera, negro, cuerpoG, [s * 0.33, CENTRO + 0.2, 0.84], [0.1, 0.13, 0.06]);
    malla(esfera, blanco, cuerpoG, [s * 0.33 + 0.035, CENTRO + 0.25, 0.9], [0.035, 0.035, 0.02]);
    malla(esfera, rubor, cuerpoG, [s * 0.58, CENTRO - 0.04, 0.72], [0.16, 0.1, 0.05], [0, s * 0.6, 0]);
  }

  // Piquito
  malla(new THREE.ConeGeometry(0.11, 0.2, 24), naranja, cuerpoG, [0, CENTRO + 0.05, 0.98], [1, 1, 0.8], [Math.PI / 2, 0, 0]);

  // Lazo en la cabeza
  const lazo = new THREE.Group();
  lazo.position.set(0.48, CENTRO + 0.85, 0.32);
  lazo.rotation.set(0.2, 0.3, -0.5);
  cuerpoG.add(lazo);
  malla(esfera, rosaLazo, lazo, [0, 0, 0], [0.09, 0.09, 0.09]);
  for (const s of [-1, 1]) malla(new THREE.ConeGeometry(0.16, 0.32, 24), rosaLazo, lazo, [s * 0.17, 0, 0], [1, 1, 0.55], [0, 0, s * Math.PI / 2]);

  // Alitas (con pivote para aletear)
  const alas = [-1, 1].map((s) => {
    const pivote = new THREE.Group();
    pivote.position.set(s * 0.9, CENTRO + 0.05, 0.05);
    malla(esfera, amarillo, pivote, [s * 0.1, -0.22, 0], [0.16, 0.36, 0.26], [0, 0, s * 0.25]);
    cuerpoG.add(pivote);
    return { pivote, s };
  });

  // Patitas
  for (const s of [-1, 1]) malla(esfera, naranja, baile, [s * 0.34, 0.07, 0.3], [0.2, 0.08, 0.27]);

  // Tutú de bailarina (dos capas de volantes)
  const crearTutu = (rArriba, rAbajo, alto, ondas, color, op) => {
    const g = new THREE.CylinderGeometry(rArriba, rAbajo, alto, 160, 3, true);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const a = Math.atan2(v.z, v.x);
      const k = (alto / 2 - v.y) / alto; // 0 arriba, 1 abajo
      const f = 1 + 0.07 * k * Math.sin(a * ondas);
      p.setXYZ(i, v.x * f, v.y + 0.04 * k * Math.cos(a * ondas), v.z * f);
    }
    g.computeVertexNormals();
    return new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({
      color, roughness: 0.7, sheen: 0.6, sheenColor: new THREE.Color(0xffc6de), side: THREE.DoubleSide, transparent: true, opacity: op,
    }));
  };
  const tutu = new THREE.Group();
  tutu.position.y = CENTRO - 0.42;
  const tutu1 = crearTutu(0.88, 1.5, 0.32, 18, 0xff6fa8, 0.95);
  const tutu2 = crearTutu(0.9, 1.3, 0.28, 13, 0xffa3c8, 0.9);
  tutu2.position.y = 0.1;
  tutu.add(tutu1, tutu2);
  cuerpoG.add(tutu);

  // Sombra suave en el piso
  const texSombra = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(150,40,90,.35)');
    gr.addColorStop(1, 'rgba(150,40,90,0)');
    x.fillStyle = gr;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const sombra = malla(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false }), pollito, [0, 0.01, 0], null, [-Math.PI / 2, 0, 0]);

  const piezasPollito = [];
  pollito.traverse((o) => { if (o.isMesh && o !== sombra) piezasPollito.push(o); });

  /* ───── Decoración flotante ───── */
  const decoracion = new THREE.Group();
  escena.add(decoracion);
  const tipos = [
    () => { const g = new THREE.Group(); g.add(new THREE.Mesh(geoBoton, materiales.boton)); const b = new THREE.Mesh(geoBordeBoton, materiales.boton); b.position.z = 0.24; g.add(b); return g; },
    () => { const g = new THREE.Group(); g.add(new THREE.Mesh(geoBoton, materiales.botonClaro)); const b = new THREE.Mesh(geoBordeBoton, materiales.botonClaro); b.position.z = 0.24; g.add(b); return g; },
    () => new THREE.Mesh(geoEstrella, materiales.escarchaRosa),
    () => new THREE.Mesh(geoEstrella, materiales.celeste),
    () => new THREE.Mesh(geoEstrella, materiales.amarillo),
    () => new THREE.Mesh(geoCorazon, materiales.corazon),
    () => new THREE.Mesh(geoCorazon, materiales.lila),
  ];
  const azar = (a, b) => a + Math.random() * (b - a);
  const objetos = [];
  const CANTIDAD = innerWidth < 720 ? 16 : 26;
  for (let i = 0; i < CANTIDAD; i++) {
    const o = tipos[i % tipos.length]();
    const esc = azar(0.28, 0.62);
    o.scale.setScalar(esc);
    o.rotation.set(azar(-0.6, 0.6), azar(-0.8, 0.8), azar(0, Math.PI * 2));
    o.userData = {
      base: new THREE.Vector3(),
      u: Math.random(), w: Math.random(), z: azar(-7, 2.5),
      fase: Math.random() * Math.PI * 2,
      vel: new THREE.Vector3(azar(-0.25, 0.25), azar(-0.35, 0.35), azar(-0.4, 0.4)),
      impulso: 0,
    };
    decoracion.add(o);
    objetos.push(o);
  }

  // Destellos
  const texDestello = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    x.translate(32, 32);
    x.fillStyle = '#fff';
    x.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 5 : 30;
      const a = (i / 8) * Math.PI * 2;
      x.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    x.fill();
    return new THREE.CanvasTexture(c);
  })();
  const nDestellos = 90;
  const posD = new Float32Array(nDestellos * 3);
  for (let i = 0; i < nDestellos; i++) posD.set([azar(-12, 12), azar(-7, 7), azar(-6, 3)], i * 3);
  const geoD = new THREE.BufferGeometry();
  geoD.setAttribute('position', new THREE.BufferAttribute(posD, 3));
  const destellos = new THREE.Points(geoD, new THREE.PointsMaterial({ map: texDestello, size: 0.32, transparent: true, depthWrite: false, color: 0xffffff }));
  escena.add(destellos);

  // Corazoncitos que salen al tocar al pollito
  const particulas = [];
  function lluviaDeCorazones() {
    const origen = new THREE.Vector3(0, CENTRO * 2, 0);
    pollito.localToWorld(origen);
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(geoCorazon, (i % 2 ? materiales.corazon : materiales.escarchaRosa).clone());
      m.material.transparent = true;
      m.position.copy(origen);
      m.scale.setScalar(0.18 * pollito.scale.x);
      const a = (i / 10) * Math.PI * 2;
      m.userData = { v: new THREE.Vector3(Math.cos(a) * 2.4, azar(2.5, 4.5), Math.sin(a) * 1.5).multiplyScalar(pollito.scale.x), vida: 0 };
      escena.add(m);
      particulas.push(m);
    }
  }

  /* ───── Tamaños ───── */
  let anchoVisible = 1, altoVisible = 1;
  function ajustar() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    altoVisible = 2 * Math.tan(THREE.MathUtils.degToRad(camara.fov / 2)) * camara.position.z;
    anchoVisible = altoVisible * camara.aspect;

    const movil = w < 720;
    const escala = movil ? altoVisible * 0.3 / 2.5 : Math.min(altoVisible * 0.5 / 2.5, anchoVisible * 0.3 / 2.5);
    pollito.scale.setScalar(escala);
    pollito.position.set(movil ? 0 : anchoVisible * 0.24, movil ? altoVisible * 0.06 : -altoVisible * 0.3, 0);

    for (const o of objetos) {
      const d = o.userData;
      const factor = (camara.position.z - d.z) / camara.position.z; // más lejos ⇒ más área
      d.base.set((d.u - 0.5) * anchoVisible * factor * 1.05, (d.w - 0.5) * altoVisible * factor * 1.05, d.z);
    }
  }
  new ResizeObserver(ajustar).observe(canvas);
  ajustar();

  /* ───── Interacción ───── */
  const mouse = new THREE.Vector2();
  const mouseSuave = new THREE.Vector2();
  addEventListener('pointermove', (e) => {
    mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  }, { passive: true });

  const giro = { activo: false, inicio: 0 };
  const rayo = new THREE.Raycaster();
  let ultimoGiro = 0;

  function pirueta(t) {
    if (giro.activo) return;
    giro.activo = true;
    giro.inicio = t;
    ultimoGiro = t;
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(p, camara);
    if (rayo.intersectObjects(piezasPollito, false).length) {
      pirueta(reloj.getElapsedTime());
      lluviaDeCorazones();
      canvas.style.cursor = 'pointer';
      return;
    }
    const tocado = rayo.intersectObjects(objetos, true)[0];
    if (tocado) {
      let o = tocado.object;
      while (o.parent !== decoracion) o = o.parent;
      o.userData.impulso = 14;
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(p, camara);
    canvas.style.cursor = rayo.intersectObjects(piezasPollito, false).length ? 'pointer' : 'grab';
  });

  /* ───── Animación ───── */
  const reloj = new THREE.Clock();
  const ritmo = reducirMovimiento ? 0.35 : 1;
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const suave = (k) => k * k * (3 - 2 * k);

  renderer.setAnimationLoop(() => {
    const dt = Math.min(reloj.getDelta(), 0.05);
    if (!visible || document.hidden) return;
    const t = reloj.getElapsedTime();
    const tt = t * ritmo;

    // Baile: saltitos al ritmo, balanceo y aleteo
    const p = tt * Math.PI * 1.9;
    const salto = Math.abs(Math.sin(p));
    const aplastar = Math.cos(2 * p);
    baile.position.y = salto * 0.32;
    cuerpoG.scale.set(1 + 0.05 * aplastar, 1 - 0.07 * aplastar, 1 + 0.05 * aplastar);
    baile.rotation.z = Math.sin(p) * 0.16;
    for (const { pivote, s } of alas) pivote.rotation.z = s * (0.35 + Math.sin(p * 2) * 0.45);
    tutu.rotation.y = tt * 0.8;
    tutu1.scale.setScalar(1 + 0.04 * aplastar);
    lazo.rotation.z = -0.5 + Math.sin(p * 2) * 0.12;

    // Pirueta (al tocar y cada cierto tiempo)
    if (!reducirMovimiento && !giro.activo && t - ultimoGiro > 7) pirueta(t);
    mouseSuave.lerp(mouse, 0.06);
    if (giro.activo) {
      const k = Math.min((t - giro.inicio) / 1.3, 1);
      baile.rotation.y = suave(k) * Math.PI * 2;
      baile.position.y += Math.sin(k * Math.PI) * 0.9;
      for (const { pivote, s } of alas) pivote.rotation.z = s * (1.3 + Math.sin(k * Math.PI * 6) * 0.2);
      if (k >= 1) { giro.activo = false; baile.rotation.y = 0; }
    } else {
      baile.rotation.y = THREE.MathUtils.lerp(baile.rotation.y, mouseSuave.x * 0.5, 0.1);
    }
    pollito.rotation.x = -mouseSuave.y * 0.12;
    const alto = baile.position.y;
    sombra.scale.setScalar(1 - Math.min(alto, 1) * 0.35);
    sombra.material.opacity = 1 - Math.min(alto, 1) * 0.5;

    // Decoración flotando
    for (const o of objetos) {
      const d = o.userData;
      d.impulso *= 0.95;
      o.position.set(
        d.base.x + Math.sin(tt * 0.5 + d.fase) * 0.35,
        d.base.y + Math.sin(tt * 0.8 + d.fase) * 0.45,
        d.base.z,
      );
      o.rotation.x += (d.vel.x * ritmo) * dt;
      o.rotation.y += (d.vel.y * ritmo + d.impulso) * dt;
      o.rotation.z += (d.vel.z * ritmo) * dt;
    }
    destellos.material.opacity = 0.55 + Math.sin(t * 2) * 0.3;
    destellos.rotation.z = tt * 0.01;

    // Corazones de la lluvia
    for (let i = particulas.length - 1; i >= 0; i--) {
      const m = particulas[i];
      const u = m.userData;
      u.vida += dt;
      u.v.y -= 6 * dt * pollito.scale.x;
      m.position.addScaledVector(u.v, dt);
      m.rotation.y += dt * 4;
      m.material.opacity = Math.max(0, 1 - u.vida / 1.4);
      if (u.vida > 1.4) { escena.remove(m); m.material.dispose(); particulas.splice(i, 1); }
    }

    // Paralaje de cámara
    camara.position.x = mouseSuave.x * 0.6;
    camara.position.y = mouseSuave.y * 0.4 - Math.min(scrollY / innerHeight, 1) * 1.5;
    camara.lookAt(0, camara.position.y * 0.5, 0);

    renderer.render(escena, camara);
  });
}
