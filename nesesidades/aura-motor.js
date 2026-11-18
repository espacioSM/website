/* ============================================================
   espacioSM · Motor de Diagnóstico · v2
   Uso interno del despacho.
   Las preguntas, los textos de Aura y los consejos viven en
   este archivo. El HTML solo es la envoltura.
   ============================================================ */

const CONFIG = {
  endpoint: "https://script.google.com/macros/s/AKfycbwYQLOOu1RxfbB2rFpXhSNoN2pj8rxAPYSq51VO7kD8lna3iHEr38mTCTjf7A39sv1HuQ/exec",
  token: "aura-sm-2026",
  storage: "espaciosm_motor_v2",
  minutosPorPregunta: 0.45
};

const BLOQUES = [
  { n: 1, titulo: "Quién eres", intro: "Lo básico para abrir el expediente. Nada de esto sale del despacho." },
  { n: 2, titulo: "El proyecto", intro: "El punto de partida: dónde, qué y para qué." },
  { n: 3, titulo: "Quiénes lo habitan", intro: "La casa se diseña para las personas, no al revés." },
  { n: 4, titulo: "Movilidad y mascotas", intro: "Cómo entras, cómo sales y con quién vives." },
  { n: 5, titulo: "Programa arquitectónico", intro: "El corazón del diagnóstico: qué espacios necesitas." },
  { n: 6, titulo: "Estética y sitio", intro: "Cómo quieres que se sienta y qué hay que respetar del lugar." },
  { n: 7, titulo: "Tecnología y cierre", intro: "Lo que hace la casa eficiente y lo que falta preguntar." }
];

const PREGUNTAS = [
  { id: "Email", bloque: 1, tipo: "email", titulo: "¿A qué correo te envío tu programa?",
    ayuda: "Ahí llega el documento y la confirmación de la junta.",
    porQue: "Es el canal por el que te hacemos llegar el programa y cualquier ajuste.",
    ejemplo: "nombre@dominio.com", requerido: true },

  { id: "Cliente", bloque: 1, tipo: "texto", titulo: "¿Cómo te llamas?",
    ayuda: "Nombre y apellido, como quieres que aparezca en el expediente.",
    porQue: "Para dirigirnos a ti y nombrar el proyecto.",
    ejemplo: "María Fernanda Ruiz", requerido: true },

  { id: "Familia", bloque: 1, tipo: "parrafo", titulo: "¿Cómo está formada tu familia hoy?",
    ayuda: "Incluye edades y mascotas. No hace falta el nombre de cada quien.",
    porQue: "Define cuántos espacios privados y de convivencia necesitas.",
    ejemplo: "Pareja, dos hijos de 8 y 12 años, un perro mediano." },

  { id: "Ocupacion", bloque: 1, tipo: "texto", titulo: "¿A qué te dedicas?",
    ayuda: "Si trabajas desde casa, dilo: cambia el programa.",
    porQue: "Hay oficios que piden un espacio de trabajo dentro de la casa.",
    ejemplo: "Arquitecta; trabajo desde casa tres días a la semana." },

  { id: "Ubicacion_Maps", bloque: 2, tipo: "texto", titulo: "¿Dónde está el inmueble?",
    ayuda: "Pega el enlace de Google Maps. Si no lo tienes, escribe colonia y calle.",
    porQue: "La zona define clima, orientación, reglamento y criterios de costo.",
    ejemplo: "https://maps.app.goo.gl/…" },

  { id: "Licencia", bloque: 2, tipo: "opcion", titulo: "¿Ya tienes licencia de construcción?",
    porQue: "El trámite fija el calendario y evita una clausura a medio camino.",
    ejemplo: "Si no la tienes, no pasa nada: queda como pendiente.",
    opciones: ["Sí", "No, la voy a tramitar", "Necesito asesoría"] },

  { id: "Tipo_Trabajo", bloque: 2, tipo: "opcion", titulo: "¿Qué vas a hacer?",
    porQue: "Cambia el alcance, los permisos y los tiempos.",
    ejemplo: "Una remodelación integral no se planea igual que una ampliación.",
    opciones: ["Obra nueva", "Remodelación", "Ampliación"] },

  { id: "Diagnostico_Necesidades", bloque: 2, tipo: "parrafo", titulo: "¿Qué te gustaría resolver con este proyecto?",
    ayuda: "Qué falta, qué estorba, qué te obliga a moverte raro hoy.",
    porQue: "Aquí empieza el programa: de la molestia concreta al espacio necesario.",
    ejemplo: "La cocina no se conecta con la sala y no tengo dónde trabajar." },

  { id: "Prioridad_Inversion", bloque: 2, tipo: "opcion", titulo: "Si tuvieras que elegir una sola cosa, ¿qué prefieres?",
    porQue: "Orienta dónde concentramos el esfuerzo de diseño.",
    ejemplo: "No es una pregunta de dinero: es de prioridad.",
    opciones: ["Aprovechar mejor los metros", "Equilibrio entre diseño y costo", "Acabados de alta gama", "Eficiencia y bajo consumo"] },

  { id: "Num_Usuarios", bloque: 3, tipo: "opcion", titulo: "¿Cuántas personas van a vivir ahí?",
    porQue: "Dimensiona baños, cocina e instalaciones.",
    opciones: ["1", "2", "3", "4", "5", "6+"] },

  { id: "Perfil_Habitantes", bloque: 3, tipo: "multiple", titulo: "¿Qué edades habrá en casa?",
    ayuda: "Selecciona todas las que apliquen.",
    porQue: "Cada etapa de vida pide algo distinto: alturas, seguridad, accesibilidad.",
    ejemplo: "Un niño de 6 y un adulto mayor cambian los baños y los pasillos.",
    opciones: ["Infante (0-5 años)", "Niño (6-12 años)", "Adolescente (13-17 años)", "Adulto (18-59 años)", "Adulto mayor (60+ años)"] },

  { id: "Vida_Social", bloque: 3, tipo: "opcion", titulo: "¿Qué tan seguido recibes visitas?",
    porQue: "Define si necesitas baño de visitas y una sala que aguante gente.",
    opciones: ["Frecuente (varias veces por semana)", "Regular (fines de semana)", "Ocasional (eventos especiales)", "Casi nunca"] },

  { id: "Vision_Sensacion", bloque: 3, tipo: "opcion", titulo: "¿Cómo quieres sentirte en tu casa?",
    porQue: "La sensación guía la luz, los materiales y la distribución.",
    opciones: ["Refugio y calma (espacios íntimos)", "Social y abierta (para reuniones)", "Productiva y creativa (home office)", "Conectada con el exterior"] },

  { id: "Num_Vehiculos", bloque: 4, tipo: "opcion", titulo: "¿Cuántos vehículos tienen hoy?",
    porQue: "Dimensiona la cochera y el acceso.",
    opciones: ["0", "1", "2", "3", "4+"] },

  { id: "Tipo_Vehiculos", bloque: 4, tipo: "multiple", titulo: "¿Qué tipo de vehículos?",
    ayuda: "Selecciona todos los que apliquen.",
    porQue: "Una SUV o una pick up piden más altura y radio de giro.",
    opciones: ["Sedán", "SUV", "Pick up", "Motocicleta", "Bicicleta", "Otro"] },

  { id: "Proyeccion_Vehiculos", bloque: 4, tipo: "parrafo", titulo: "¿Van a tener más vehículos en los próximos años?",
    porQue: "Es más barato preverlo ahora que romper después.",
    ejemplo: "En dos años queremos cambiar a una camioneta." },

  { id: "Mascotas", bloque: 4, tipo: "parrafo", titulo: "¿Tienes o vas a tener mascotas?",
    porQue: "Define acabados resistentes y un lugar para lavarles.",
    ejemplo: "Dos perros medianos y un gato." },

  { id: "Habitaciones", bloque: 5, tipo: "opcion", titulo: "¿Cuántas recámaras necesitas?",
    porQue: "Es la base del cuadro de áreas.",
    opciones: ["1", "2", "3", "4", "5+"] },

  { id: "Accesibilidad", bloque: 5, tipo: "multiple", titulo: "¿Necesitas accesibilidad?",
    ayuda: "Marca las que apliquen o elige 'Ninguna'.",
    porQue: "Una casa que envejece con la familia no se remodela dos veces.",
    opciones: ["Rampas", "Puertas de 80 cm o más", "Baño adaptado", "Elevador", "Ninguna", "Otro"] },

  { id: "Privacidad_Confort", bloque: 5, tipo: "parrafo", titulo: "¿Qué necesita cada recámara para ser cómoda?",
    porQue: "Personaliza la experiencia diaria y define áreas privadas.",
    ejemplo: "Vestidor, baño propio y salida a terraza." },

  { id: "Muebles_Especiales", bloque: 5, tipo: "parrafo", titulo: "¿Tienes muebles u objetos pesados o grandes?",
    porQue: "Un piano pesa más de 300 kg y pide refuerzo de losa.",
    ejemplo: "Piano de cola, acuario de 300 litros, equipo de gimnasio." },

  { id: "Zonas_Permanencia", bloque: 5, tipo: "multiple", titulo: "¿Dónde pasas más tiempo?",
    ayuda: "Selecciona hasta tres.",
    porQue: "Donde más vives merece más esfuerzo de diseño.",
    opciones: ["Dormitorio", "Cocina", "Comedor", "Sala", "Estudio/Home Office", "Terraza/Patio"] },

  { id: "Pasatiempos", bloque: 5, tipo: "parrafo", titulo: "¿Qué haces en tu tiempo libre?",
    porQue: "Los pasatiempos piden espacio, aunque no lo parezca.",
    ejemplo: "Cocinar, leer, tocar guitarra, jardinería." },

  { id: "Puntos_Dolor", bloque: 5, tipo: "parrafo", titulo: "¿Qué te molesta hoy de donde vives?",
    ayuda: "No busques la palabra técnica: describe el momento.",
    porQue: "Los problemas de hoy son el brief de mañana.",
    ejemplo: "La cocina se llena de humo y no puedo platicar con quien cocina." },

  { id: "Paleta_Cromatica", bloque: 6, tipo: "visual", titulo: "¿Qué paleta te atrae?", columnas: 2,
    ayuda: "Elige la que más se acerque; se puede ajustar después.",
    porQue: "Define la atmósfera del espacio.",
    opciones: [
      { nombre: "Neutras (blanco, gris, beige)", img: "paleta_neutras-sm.jpg" },
      { nombre: "Oscuras (negro, gris oscuro)", img: "paleta_oscuras-sm.jpg" },
      { nombre: "Tierra (terracota, ocre, café)", img: "paleta_tierra-sm.jpg" },
      { nombre: "Tendencia (colores de moda)", img: "paleta_tendencia-sm.jpg" }
    ] },

  { id: "Texturas_Pisos", bloque: 6, tipo: "multiple", titulo: "¿Qué materiales te gustan para el piso?",
    porQue: "Impacta el mantenimiento y la sensación térmica.",
    opciones: ["Loseta cerámica", "Madera natural", "Mármol", "Concreto aparente", "Laminado", "Porcelanato", "Otro"] },

  { id: "Conciencia_Sitio", bloque: 6, tipo: "parrafo", titulo: "¿Qué hay en el terreno que valga la pena conservar?",
    porQue: "Integrar lo que ya existe suele salir mejor que borrarlo.",
    ejemplo: "Un jacaranda, la vista al poniente, la pendiente natural." },

  { id: "Estilo_Arquitectonico", bloque: 6, tipo: "visual", titulo: "¿Con qué estilo te identificas?",
    porQue: "Define la materialidad y la firma estética del proyecto.",
    opciones: [
      { nombre: "Brutalista (acabados simples, material expuesto)", img: "brutalistasm-sm.jpg" },
      { nombre: "Moderno (líneas puras, funcional)", img: "modernosm-sm.jpg" },
      { nombre: "Contemporáneo (actual, versátil)", img: "contemporanea-sm.jpg" },
      { nombre: "Minimalista (menos es más)", img: "minimalistasm-sm.jpg" },
      { nombre: "Mexicano (colores, texturas)", img: "mexicanosm-sm.jpg" },
      { nombre: "Rústico (piedra, madera)", img: "rusticosm-sm.jpg" }
    ] },

  { id: "Link_Referencias", bloque: 6, tipo: "texto", titulo: "¿Tienes referencias visuales?",
    ayuda: "Un enlace de Pinterest o Instagram basta.",
    porQue: "Ayudan a entender el gusto con precisión, sin adivinar.",
    ejemplo: "pinterest.com/tablón/casa" },

  { id: "Sostenibilidad", bloque: 7, tipo: "multiple", titulo: "¿Qué ecotecnologías te interesan?",
    porQue: "Reducen el costo de operación de la casa.",
    opciones: ["Paneles solares", "Captación pluvial", "Biodigestor", "Calentador solar", "Riego automatizado", "Otro"] },

  { id: "Involucramiento", bloque: 7, tipo: "opcion", titulo: "¿Cómo quieres trabajar con nosotros?",
    porQue: "Define la dinámica de revisiones y decisiones.",
    opciones: ["Delegación total (llave en mano)", "Colaboración guiada (revisión semanal)", "Involucramiento activo (en cada decisión)"] },

  { id: "Proposito_Patrimonial", bloque: 7, tipo: "opcion", titulo: "¿Cuál es el propósito del proyecto?",
    porQue: "Define la durabilidad y el nivel de acabado que conviene.",
    opciones: ["Residencia definitiva", "Inversión y venta", "Segunda residencia", "Renta temporal"] },

  { id: "Comentario_Aura_Final", bloque: 7, tipo: "parrafo", titulo: "¿Qué no te pregunté y debería saber?",
    ayuda: "Aquí suelen salir las cosas importantes.",
    porQue: "El diagnóstico se cierra con lo que el cliente trae en la cabeza y no ha dicho.",
    ejemplo: "Hay humedad en el muro del patio y quiero resolverla en la obra." }
];

const HEADERS = [
  "Fecha", "Email", "Cliente", "Familia", "Ocupacion", "Ubicacion_Maps", "Licencia",
  "Tipo_Trabajo", "Diagnostico_Necesidades", "Prioridad_Inversion", "Num_Usuarios",
  "Perfil_Habitantes", "Vida_Social", "Vision_Sensacion", "Num_Vehiculos", "Tipo_Vehiculos",
  "Proyeccion_Vehiculos", "Mascotas", "Habitaciones", "Accesibilidad", "Privacidad_Confort",
  "Muebles_Especiales", "Zonas_Permanencia", "Pasatiempos", "Puntos_Dolor", "Paleta_Cromatica",
  "Texturas_Pisos", "Conciencia_Sitio", "Estilo_Arquitectonico", "Link_Referencias",
  "Sostenibilidad", "Involucramiento", "Proposito_Patrimonial", "Comentario_Aura_Final"
];

const PENDIENTE = "PENDIENTE — se revisa en la junta";

const $ = (sel, ctx) => (ctx || document).querySelector(sel);

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ESC[c]);

function numFrom(v) {
  if (!v) return 0;
  const m = String(v).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function lista(v) {
  if (Array.isArray(v)) return v.slice();
  return v ? String(v).split(/,\s*/).map(s => s.trim()).filter(Boolean) : [];
}

function fechaLocal() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear() + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

function minutosRestantes(i) {
  return Math.max(1, Math.round((PREGUNTAS.length - i) * CONFIG.minutosPorPregunta));
}

function estadoInicial() {
  return { i: 0, r: {}, pend: {}, dudas: [], chat: [], iniciado: false, terminado: false, sincronizado: false, fecha: null };
}

function cargarEstado() {
  try {
    const raw = localStorage.getItem(CONFIG.storage);
    if (!raw) return estadoInicial();
    return Object.assign(estadoInicial(), JSON.parse(raw));
  } catch (e) {
    return estadoInicial();
  }
}

let estado = cargarEstado();
let altIdx = 0;

function persistir() {
  try { localStorage.setItem(CONFIG.storage, JSON.stringify(estado)); } catch (e) { }
}

function mostrar(vista) {
  ["inicio", "pregunta", "programa"].forEach(v => {
    const el = $("#vista-" + v);
    if (el) el.hidden = (v !== vista);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  if (!estado.iniciado) { renderInicio(); mostrar("inicio"); return; }
  if (estado.terminado) { renderPrograma(); mostrar("programa"); return; }
  if (estado.i >= PREGUNTAS.length) { finalizar(); return; }
  renderPregunta(PREGUNTAS[estado.i]);
  mostrar("pregunta");
}

function renderInicio() {
  const hayAvance = estado.i > 0 && Object.keys(estado.r).length > 0;
  $("#inicio-continuar").hidden = !hayAvance;
  $("#inicio-continuar-texto").textContent = hayAvance
    ? "Tienes un diagnóstico a medias: vas en la pregunta " + (estado.i + 1) + " de " + PREGUNTAS.length + "."
    : "";
}

function empezar(desdeCero) {
  if (desdeCero) {
    estado = estadoInicial();
    persistir();
  }
  estado.iniciado = true;
  persistir();
  render();
}

function renderPregunta(q) {
  $("#etiqueta-bloque").textContent = "Bloque " + q.bloque + " de 7 · " + BLOQUES[q.bloque - 1].titulo;
  $("#titulo").textContent = q.titulo;
  $("#ayuda").textContent = q.ayuda || "";
  $("#ayuda").hidden = !q.ayuda;
  $("#meta").textContent = "Pregunta " + (estado.i + 1) + " de " + PREGUNTAS.length + " · faltan ≈ " + minutosRestantes(estado.i) + " min";
  $("#error").textContent = "";
  $("#btn-atras").disabled = estado.i === 0;
  pintarPuntos(q.bloque);
  renderCampo(q);
  pintarAura(q);
}

function pintarPuntos(bloqueActual) {
  const cont = $("#puntos");
  cont.innerHTML = "";
  for (let n = 1; n <= 7; n++) {
    const d = document.createElement("div");
    d.className = "punto" + (n < bloqueActual ? " hecho" : "") + (n === bloqueActual ? " actual" : "");
    d.textContent = n;
    cont.appendChild(d);
  }
}

function renderCampo(q) {
  const cont = $("#campo");
  cont.innerHTML = "";
  const valor = estado.r[q.id];

  if (q.tipo === "texto" || q.tipo === "email") {
    const input = document.createElement("input");
    input.type = q.tipo === "email" ? "email" : "text";
    input.className = "entrada";
    input.placeholder = q.ejemplo || "";
    input.value = valor || "";
    input.autocomplete = "off";
    input.addEventListener("input", () => {
      estado.r[q.id] = input.value;
      delete estado.pend[q.id];
      persistir();
    });
    cont.appendChild(input);
    setTimeout(() => input.focus(), 50);
    return;
  }

  if (q.tipo === "parrafo") {
    const ta = document.createElement("textarea");
    ta.className = "entrada entrada-parrafo";
    ta.placeholder = q.ejemplo || "";
    ta.value = valor || "";
    ta.rows = 4;
    ta.addEventListener("input", () => {
      estado.r[q.id] = ta.value;
      delete estado.pend[q.id];
      persistir();
    });
    cont.appendChild(ta);
    setTimeout(() => ta.focus(), 50);
    return;
  }

  if (q.tipo === "opcion") {
    const grid = document.createElement("div");
    grid.className = "opciones";
    q.opciones.forEach(op => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcion" + (valor === op ? " activa" : "");
      b.textContent = op;
      b.addEventListener("click", () => {
        estado.r[q.id] = op;
        delete estado.pend[q.id];
        persistir();
        renderCampo(q);
      });
      grid.appendChild(b);
    });
    cont.appendChild(grid);
    return;
  }

  if (q.tipo === "multiple") {
    const actuales = lista(valor).slice();
    const grid = document.createElement("div");
    grid.className = "opciones";
    q.opciones.forEach(op => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcion" + (actuales.indexOf(op) > -1 ? " activa" : "");
      b.textContent = op;
      b.addEventListener("click", () => {
        const idx = actuales.indexOf(op);
        if (idx > -1) actuales.splice(idx, 1); else actuales.push(op);
        estado.r[q.id] = actuales.slice();
        delete estado.pend[q.id];
        persistir();
        renderCampo(q);
      });
      grid.appendChild(b);
    });
    cont.appendChild(grid);
    return;
  }

  if (q.tipo === "visual") {
    const grid = document.createElement("div");
    grid.className = "visuales";
    if (q.columnas) grid.style.gridTemplateColumns = "repeat(" + q.columnas + ", 1fr)";
    q.opciones.forEach(op => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "visual" + (valor === op.nombre ? " activa" : "");
      const img = document.createElement("img");
      img.src = op.img;
      img.alt = op.nombre;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        img.remove();
        b.style.minHeight = "84px";
        b.style.background = "#ececec";
      });
      const span = document.createElement("span");
      span.textContent = op.nombre;
      b.appendChild(img);
      b.appendChild(span);
      b.addEventListener("click", () => {
        estado.r[q.id] = op.nombre;
        delete estado.pend[q.id];
        persistir();
        renderCampo(q);
      });
      grid.appendChild(b);
    });
    cont.appendChild(grid);
  }
}

function pintarAura(q) {
  $("#aura-porque").textContent = q.porQue || "";
  $("#aura-ejemplo").textContent = q.ejemplo || "";
  $("#aura-alt").textContent = "";
  $("#btn-reformular").hidden = !(q.alternativas && q.alternativas.length);
  altIdx = 0;
}

function avanzar() {
  estado.i += 1;
  persistir();
  if (estado.i >= PREGUNTAS.length) { finalizar(); return; }
  render();
}

function atras() {
  if (estado.i > 0) {
    estado.i -= 1;
    persistir();
    render();
  }
}

function noLoSe() {
  const q = PREGUNTAS[estado.i];
  estado.pend[q.id] = true;
  delete estado.r[q.id];
  persistir();
  avanzar();
}

function siguiente() {
  const q = PREGUNTAS[estado.i];
  const crudo = estado.r[q.id];
  const valor = (Array.isArray(crudo) ? crudo.join(", ") : (crudo || "")).trim();

  if (q.tipo === "email" && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    $("#error").textContent = "Ese correo no parece válido. Revísalo o usa “No lo sé”.";
    return;
  }
  if (q.requerido && !valor) {
    $("#error").textContent = "Este dato es necesario para abrir el expediente.";
    return;
  }
  if (!valor) {
    estado.pend[q.id] = true;
    delete estado.r[q.id];
  }
  avanzar();
}

function reformular() {
  const q = PREGUNTAS[estado.i];
  if (!q.alternativas || !q.alternativas.length) return;
  $("#aura-alt").textContent = q.alternativas[altIdx % q.alternativas.length];
  altIdx += 1;
}

function construirPayload() {
  const p = {};
  const r = estado.r;
  HEADERS.forEach(h => {
    if (h === "Fecha") { p[h] = fechaLocal(); return; }
    if (h === "Comentario_Aura_Final") {
      let c = (r[h] || "").trim();
      if (estado.dudas.length) {
        c += (c ? " | " : "") + "Dudas planteadas a Aura: " + estado.dudas.join(" / ");
      }
      p[h] = c;
      return;
    }
    const v = r[h];
    p[h] = estado.pend[h] ? PENDIENTE : (Array.isArray(v) ? v.join(", ") : (v || ""));
  });
  p.Token = CONFIG.token;
  return p;
}

async function enviar() {
  const aviso = $("#estado-guardado");
  aviso.className = "aviso";
  aviso.textContent = "Guardando en la hoja del despacho…";

  try {
    const cuerpo = new URLSearchParams(construirPayload()).toString();
    const res = await fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: cuerpo
    });
    const texto = await res.text();

    if (texto.trim().indexOf("OK") === 0) {
      estado.sincronizado = true;
      persistir();
      aviso.className = "aviso ok";
      aviso.textContent = "Guardado en la hoja del despacho.";
    } else {
      throw new Error(texto.trim());
    }
  } catch (err) {
    estado.sincronizado = false;
    persistir();
    aviso.className = "aviso error";
    aviso.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "No se pudo guardar: " + (err.message || err);
    const b = document.createElement("button");
    b.className = "btn-mini";
    b.textContent = "Reintentar";
    b.addEventListener("click", enviar);
    aviso.appendChild(p);
    aviso.appendChild(b);
  }
}

function construirPrograma() {
  const r = estado.r;
  const nRec = Math.max(1, numFrom(r.Habitaciones) || 2);
  const nVeh = numFrom(r.Num_Vehiculos);
  const usuarios = Math.max(1, numFrom(r.Num_Usuarios) || 2);
  const zonas = lista(r.Zonas_Permanencia);
  const acc = lista(r.Accesibilidad);
  const texturas = lista(r.Texturas_Pisos);
  const habitantes = lista(r.Perfil_Habitantes);
  const familia = (r.Familia || "").toLowerCase();
  const dolor = (r.Puntos_Dolor || "").toLowerCase();
  const confort = (r.Privacidad_Confort || "").toLowerCase();
  const sitio = (r.Conciencia_Sitio || "").toLowerCase();
  const vision = r.Vision_Sensacion || "";
  const social = r.Vida_Social || "";

  const estudio = zonas.indexOf("Estudio/Home Office") > -1 || /productiv/i.test(vision);
  const terraza = zonas.indexOf("Terraza/Patio") > -1 || /terraza|jard[ií]n|vista/i.test(sitio + " " + confort);
  const servicio = /servicio|empleada|nana/i.test(familia) || nRec >= 4;
  const vestidor = /vestidor/i.test(confort);
  const frecuente = /frecuente/i.test(social);
  const nBanos = Math.max(2, Math.ceil(nRec / 2) + (frecuente ? 1 : 0));

  const areas = [];
  areas.push({ nombre: "Recámara principal", m2: 18 });
  if (nRec > 1) areas.push({ nombre: "Recámaras secundarias (" + (nRec - 1) + ")", m2: (nRec - 1) * 12 });
  areas.push({ nombre: "Baños (" + nBanos + ")", m2: nBanos * 6 });
  areas.push({ nombre: "Cocina", m2: 14 });
  areas.push({ nombre: "Comedor", m2: 14 });
  areas.push({ nombre: "Estancia", m2: 26 });
  if (estudio) areas.push({ nombre: "Estudio / home office", m2: 10 });
  if (vestidor) areas.push({ nombre: "Vestidor", m2: 6 });
  areas.push({ nombre: "Lavandería", m2: 6 });
  if (servicio) areas.push({ nombre: "Cuarto de servicio", m2: 8 });
  if (nVeh > 0) areas.push({ nombre: "Cochera (" + nVeh + ")", m2: nVeh * 15 });
  if (terraza) areas.push({ nombre: "Terraza / exterior", m2: 12 });

  const suma = areas.reduce((t, a) => t + a.m2, 0);
  const total = Math.round((suma * 1.25) / 5) * 5;

  const tensiones = [];
  if (nVeh >= 3) tensiones.push("Tres vehículos o más: la cochera cambia el frente y la fachada. Conviene resolverla antes que la estética.");
  if (habitantes.some(h => /Adulto mayor/.test(h)) && !acc.some(a => /Rampa|Baño adaptado|Elevador/.test(a))) {
    tensiones.push("Hay un adulto mayor en casa y no marcaste accesibilidad: hace falta baño completo en planta baja y rampa.");
  }
  if (texturas.some(t => /Madera/i.test(t)) && /perro|gato|mascota/i.test(r.Mascotas || "")) {
    tensiones.push("Madera natural con mascotas: se castiga rápido. Conviene porcelanato en zonas de paso y madera solo en recámaras.");
  }
  if (/refugio/i.test(vision) && frecuente) {
    tensiones.push("Pides refugio y a la vez visitas frecuentes: la casa necesita dos zonas que no se estorben.");
  }
  if (nRec >= 5) {
    tensiones.push("Cinco recámaras o más: el programa crece por encima de 220 m² construidos. Si el terreno no los tiene, habrá que priorizar.");
  }
  if (dolor && /cocina/i.test(dolor)) {
    tensiones.push("La cocina aparece en tus puntos de dolor: hay que resolver ventilación y conexión con la estancia, no solo el mobiliario.");
  }

  const criterios = [];
  if (r.Tipo_Trabajo) criterios.push("Intervención: " + r.Tipo_Trabajo);
  if (r.Ubicacion_Maps) criterios.push("Ubicación: " + r.Ubicacion_Maps);
  if (r.Num_Usuarios) criterios.push("Usuarios: " + r.Num_Usuarios);
  if (r.Habitaciones) criterios.push("Recámaras: " + r.Habitaciones);
  if (r.Vida_Social) criterios.push("Vida social: " + r.Vida_Social);
  if (r.Vision_Sensacion) criterios.push("Sensación buscada: " + r.Vision_Sensacion);
  if (r.Estilo_Arquitectonico) criterios.push("Estilo: " + r.Estilo_Arquitectonico);
  const txt = v => Array.isArray(v) ? v.join(", ") : (v || "");
  if (r.Paleta_Cromatica) criterios.push("Paleta: " + txt(r.Paleta_Cromatica));
  if (r.Texturas_Pisos) criterios.push("Pisos: " + txt(r.Texturas_Pisos));
  if (r.Sostenibilidad) criterios.push("Ecotecnologías: " + txt(r.Sostenibilidad));
  if (r.Accesibilidad) criterios.push("Accesibilidad: " + txt(r.Accesibilidad));

  const consejos = [];
  if (r.Licencia && /no/i.test(r.Licencia)) consejos.push("Antes de comprar material, resuelve la licencia: el trámite define el calendario de la obra.");
  if (/perro|gato|mascota/i.test(r.Mascotas || "")) consejos.push("En zonas de paso, elige porcelanato o loseta; deja la madera para recámaras.");
  if (habitantes.some(h => /Adulto mayor/.test(h))) consejos.push("Incluye un baño completo en planta baja: es la mejora que más se agradece con los años.");
  if (/humedad/i.test(dolor + " " + sitio)) consejos.push("Atiende la humedad desde la impermeabilización y el drenaje, no con pintura.");
  if (/ruido/i.test(dolor)) consejos.push("Si el ruido es un problema, el aislamiento va en muros y ventanas antes que en decoración.");
  if (consejos.length < 3) consejos.push("Define la distribución antes de los acabados: es lo que no se puede cambiar después.");
  if (consejos.length < 3) consejos.push("Pide el levantamiento con medidas antes del anteproyecto: evita rediseños costosos.");
  if (consejos.length < 3) consejos.push("Deja por escrito quién decide cada cosa; ahorra juntas y malentendidos.");

  const pendientes = PREGUNTAS.filter(q => estado.pend[q.id]).map(q => q.titulo);

  return {
    cliente: r.Cliente || "Sin nombre",
    email: r.Email || "",
    fecha: fechaLocal(),
    areas: areas,
    total: total,
    criterios: criterios,
    tensiones: tensiones,
    consejos: consejos.slice(0, 3),
    pendientes: pendientes,
    dudas: estado.dudas.slice(),
    nRec: nRec,
    usuarios: usuarios
  };
}

function textoPrograma(p) {
  const lineas = [];
  lineas.push("PROGRAMA DE NECESIDADES · espacioSM");
  lineas.push(p.cliente + " · " + p.fecha);
  lineas.push("");
  lineas.push("Área estimada: ≈ " + p.total + " m² construidos");
  lineas.push("");
  lineas.push("CUADRO DE ÁREAS");
  p.areas.forEach(a => lineas.push("- " + a.nombre + ": " + a.m2 + " m²"));
  lineas.push("");
  if (p.criterios.length) {
    lineas.push("CRITERIOS");
    p.criterios.forEach(c => lineas.push("- " + c));
    lineas.push("");
  }
  if (p.tensiones.length) {
    lineas.push("TENSIONES A REVISAR");
    p.tensiones.forEach(t => lineas.push("- " + t));
    lineas.push("");
  }
  if (p.consejos.length) {
    lineas.push("CONSEJOS");
    p.consejos.forEach(c => lineas.push("- " + c));
    lineas.push("");
  }
  if (p.pendientes.length) {
    lineas.push("PENDIENTES PARA LA JUNTA");
    p.pendientes.forEach(t => lineas.push("- " + t));
    lineas.push("");
  }
  return lineas.join("\n");
}

function renderPrograma() {
  const p = construirPrograma();
  const cont = $("#programa-cuerpo");

  let html = "";
  html += "<div class='programa-cabecera'>";
  html += "<p class='etiqueta'>espacioSM · uso interno</p>";
  html += "<h1>Programa de Necesidades</h1>";
  html += "<p class='programa-meta'>" + esc(p.cliente) + " · " + esc(p.fecha) + "</p>";
  html += "</div>";

  html += "<div class='programa-resumen'>";
  html += "<div><span>Área estimada</span><strong>≈ " + p.total + " m²</strong></div>";
  html += "<div><span>Recámaras</span><strong>" + p.nRec + "</strong></div>";
  html += "<div><span>Usuarios</span><strong>" + p.usuarios + "</strong></div>";
  html += "<div><span>Estado</span><strong>" + (estado.sincronizado ? "Guardado" : "Sin guardar") + "</strong></div>";
  html += "</div>";

  html += "<h2>Cuadro de áreas</h2><table class='tabla'><tbody>";
  p.areas.forEach(a => {
    html += "<tr><td>" + esc(a.nombre) + "</td><td class='num'>" + a.m2 + " m²</td></tr>";
  });
  html += "<tr class='total'><td>Subtotal</td><td class='num'>" + p.areas.reduce((t, a) => t + a.m2, 0) + " m²</td></tr>";
  html += "<tr class='total'><td>Con muros y circulación (×1.25)</td><td class='num'>≈ " + p.total + " m²</td></tr>";
  html += "</tbody></table>";

  if (p.criterios.length) {
    html += "<h2>Criterios del proyecto</h2><ul class='lista'>";
    p.criterios.forEach(c => { html += "<li>" + esc(c) + "</li>"; });
    html += "</ul>";
  }

  if (p.tensiones.length) {
    html += "<h2>Tensiones a revisar</h2><ul class='lista alerta'>";
    p.tensiones.forEach(t => { html += "<li>" + esc(t) + "</li>"; });
    html += "</ul>";
  }

  html += "<h2>Consejos</h2><ul class='lista'>";
  p.consejos.forEach(c => { html += "<li>" + esc(c) + "</li>"; });
  html += "</ul>";

  if (p.pendientes.length) {
    html += "<h2>Pendientes para la junta</h2><ul class='lista'>";
    p.pendientes.forEach(t => { html += "<li>" + esc(t) + "</li>"; });
    html += "</ul>";
  }

  if (p.dudas.length) {
    html += "<h2>Dudas que planteó el cliente</h2><ul class='lista'>";
    p.dudas.forEach(d => { html += "<li>" + esc(d) + "</li>"; });
    html += "</ul>";
  }

  html += "<h2>Siguientes pasos</h2><ol class='lista'>";
  html += "<li>Junta de revisión del programa con el Arq. San Miguel (45 min).</li>";
  html += "<li>Levantamiento del inmueble y verificación de medidas.</li>";
  html += "<li>Anteproyecto y ajuste del programa.</li>";
  html += "</ol>";

  cont.innerHTML = html;

  const aviso = $("#estado-guardado");
  if (aviso && !aviso.textContent.trim()) {
    aviso.className = "aviso " + (estado.sincronizado ? "ok" : "");
    aviso.textContent = estado.sincronizado ? "Guardado en la hoja del despacho." : "Sin guardar todavía.";
  }
}

const REGLAS_AURA = [
  [/^(hola|buenas|qu[eé] tal|hey)\b/i,
    "Hola. Pregúntame lo que necesites: puedo explicarte una pregunta, darte un ejemplo o anotar una duda para el Arq."],
  [/precio|costo|cu[aá]nto (cuesta|sale|vale)|presupuesto|dinero|pesos|mxn/i,
    "Aquí no manejamos cifras ni cotizaciones. El Arq. revisa el rango contigo en la junta; por eso el diagnóstico no da precios."],
  [/licencia|permiso|tr[aá]mite|predial|alcald[ií]a/i,
    "La licencia se tramita en la alcaldía. Si no la tienes, la dejamos como pendiente y el Arq. te dice qué documentos necesitas."],
  [/cu[aá]nto (tarda|dura)|tiempo|plazo|cu[aá]ndo/i,
    "El diagnóstico toma unos 15 minutos. Los tiempos de obra se definen en la junta, no aquí."],
  [/render|3d|imagen|visualizaci[oó]n/i,
    "Los renders son un entregable del proyecto y se definen después del anteproyecto."],
  [/no s[eé]|qu[eé] pongo|no entiendo|c[oó]mo respondo|qu[eé] escribo/i,
    "Responde como puedas. Si no estás seguro, usa “No lo sé” y queda como pendiente para la junta."],
  [/m2|metros|superficie|medidas/i,
    "Si no sabes los metros exactos, no pasa nada: anótalo como pendiente y lo medimos en el levantamiento."],
  [/gracias|ok|va|perfecto/i,
    "Con gusto. Si te surge otra duda, aquí estoy."]
];

function abrirChat() {
  $("#chat").hidden = false;
  pintarChat();
  setTimeout(() => $("#chat-input").focus(), 50);
}

function cerrarChat() {
  $("#chat").hidden = true;
}

function pintarChat() {
  const cont = $("#chat-mensajes");
  cont.innerHTML = "";
  if (!estado.chat.length) {
    const saludo = document.createElement("div");
    saludo.className = "burbuja aura";
    saludo.textContent = "Soy Aura. Te acompaño durante el diagnóstico: puedo explicarte la pregunta, darte un ejemplo o anotar una duda para el Arq. No cotizo ni propongo diseño.";
    cont.appendChild(saludo);
  }
  estado.chat.forEach(m => {
    const b = document.createElement("div");
    b.className = "burbuja " + (m.de === "cliente" ? "cliente" : "aura");
    b.textContent = m.texto;
    cont.appendChild(b);
  });
  cont.scrollTop = cont.scrollHeight;
}

function responderAura(texto) {
  for (let i = 0; i < REGLAS_AURA.length; i++) {
    if (REGLAS_AURA[i][0].test(texto)) return { texto: REGLAS_AURA[i][1], duda: false };
  }
  estado.dudas.push(texto);
  persistir();
  return {
    texto: "No tengo una respuesta preparada para eso. La anoto para que el Arq. la revise contigo en la junta.",
    duda: true
  };
}

function enviarChat(texto) {
  const limpio = texto.trim();
  if (!limpio) return;
  estado.chat.push({ de: "cliente", texto: limpio });
  const r = responderAura(limpio);
  estado.chat.push({ de: "aura", texto: r.texto });
  if (estado.chat.length > 40) estado.chat = estado.chat.slice(-40);
  persistir();
  pintarChat();
}

async function finalizar() {
  estado.terminado = true;
  estado.fecha = fechaLocal();
  persistir();
  renderPrograma();
  mostrar("programa");
  await enviar();
}

function reiniciar() {
  if (!confirm("¿Empezar un diagnóstico nuevo? Se borra el avance de este equipo.")) return;
  estado = estadoInicial();
  persistir();
  render();
}

function conectar() {
  $("#btn-empezar").addEventListener("click", () => {
    if (!$("#consentimiento").checked) {
      $("#inicio-aviso").textContent = "Marca la casilla para continuar.";
      return;
    }
    empezar(true);
  });

  $("#btn-continuar-avance").addEventListener("click", () => empezar(false));

  $("#btn-siguiente").addEventListener("click", siguiente);
  $("#btn-atras").addEventListener("click", atras);
  $("#btn-nose").addEventListener("click", noLoSe);
  $("#btn-reformular").addEventListener("click", reformular);
  $("#btn-duda").addEventListener("click", abrirChat);

  $("#chat-cerrar").addEventListener("click", cerrarChat);
  $("#chat").addEventListener("click", e => { if (e.target.id === "chat") cerrarChat(); });
  $("#chat-form").addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#chat-input");
    enviarChat(input.value);
    input.value = "";
  });

  $("#btn-reiniciar").addEventListener("click", reiniciar);
  $("#btn-imprimir").addEventListener("click", () => window.print());
  $("#btn-copiar").addEventListener("click", async () => {
    const p = construirPrograma();
    try {
      await navigator.clipboard.writeText(textoPrograma(p));
      $("#btn-copiar").textContent = "Copiado";
      setTimeout(() => { $("#btn-copiar").textContent = "Copiar resumen"; }, 2000);
    } catch (e) {
      $("#btn-copiar").textContent = "No se pudo copiar";
    }
  });
  $("#btn-volver-editar").addEventListener("click", () => {
    estado.terminado = false;
    estado.i = PREGUNTAS.length - 1;
    persistir();
    render();
  });
}

function modoPrueba() {
  estado = estadoInicial();
  estado.iniciado = true;
  estado.r = {
    Email: "prueba@espaciosm.art",
    Cliente: "PRUEBA — borrar esta fila",
    Familia: "Pareja y dos hijos de 8 y 12 años",
    Ocupacion: "Arquitecta",
    Ubicacion_Maps: "https://maps.app.goo.gl/prueba",
    Licencia: "No, la voy a tramitar",
    Tipo_Trabajo: "Remodelación",
    Diagnostico_Necesidades: "La cocina no se conecta con la sala",
    Prioridad_Inversion: "Aprovechar mejor los metros",
    Num_Usuarios: "4",
    Perfil_Habitantes: ["Niño (6-12 años)", "Adulto (18-59 años)"],
    Vida_Social: "Frecuente (varias veces por semana)",
    Vision_Sensacion: "Conectada con el exterior",
    Num_Vehiculos: "2",
    Tipo_Vehiculos: ["SUV", "Bicicleta"],
    Proyeccion_Vehiculos: "Una camioneta en dos años",
    Mascotas: "Un perro mediano",
    Habitaciones: "3",
    Accesibilidad: ["Rampas"],
    Privacidad_Confort: "Vestidor y baño propio",
    Muebles_Especiales: "Piano vertical",
    Zonas_Permanencia: ["Cocina", "Sala", "Terraza/Patio"],
    Pasatiempos: "Cocinar y leer",
    Puntos_Dolor: "La cocina se llena de humo",
    Paleta_Cromatica: "Neutras (blanco, gris, beige)",
    Texturas_Pisos: ["Madera natural", "Porcelanato"],
    Conciencia_Sitio: "Un jacaranda y la vista al poniente",
    Estilo_Arquitectonico: "Contemporáneo (actual, versátil)",
    Link_Referencias: "pinterest.com/prueba",
    Sostenibilidad: ["Paneles solares", "Captación pluvial"],
    Involucramiento: "Colaboración guiada (revisión semanal)",
    Proposito_Patrimonial: "Residencia definitiva",
    Comentario_Aura_Final: "Fila generada por el modo prueba."
  };
  estado.i = PREGUNTAS.length;
  persistir();
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  conectar();

  const salto = location.search.match(/pregunta=(\d+)/);
  if (salto) {
    estado.iniciado = true;
    estado.i = Math.min(Math.max(parseInt(salto[1], 10) - 1, 0), PREGUNTAS.length - 1);
    persistir();
    render();
    return;
  }

  if (location.search.indexOf("prueba") > -1) { modoPrueba(); return; }
  renderInicio();
  render();
});

const ALTERNATIVAS = {
  Licencia: ["Dicho de otro modo: ¿el permiso ya está en la mano o hay que tramitarlo?", "¿Sabes si el predio ya cuenta con licencia vigente?"],
  Tipo_Trabajo: ["¿Vas a construir de cero, transformar lo que existe o agregar metros?", "Si tuvieras que describirlo en una palabra: ¿nueva, remodelación o ampliación?"],
  Diagnostico_Necesidades: ["Piensa en el momento del día que más te molesta de tu casa. ¿Qué pasa ahí?", "¿Qué te obliga a salir de casa para hacer algo que deberías poder hacer adentro?"],
  Vida_Social: ["¿Cuántas veces al mes se llena tu casa de gente?", "¿Tienes reuniones seguidas o solo en fechas especiales?"],
  Vision_Sensacion: ["Cierra los ojos: ¿qué es lo primero que quieres sentir al entrar?", "¿Prefieres llegar y desconectarte, o llegar y que haya gente?"],
  Habitaciones: ["¿Cuántas camas necesitas, contando la tuya y las de visitas?", "¿Cada quién necesita su cuarto o hay quienes pueden compartir?"],
  Puntos_Dolor: ["Describe el momento exacto en que tu casa te estorba.", "¿Qué has intentado arreglar y no ha funcionado?"],
  Estilo_Arquitectonico: ["¿Qué casa de tu infancia o de una revista recuerdas como 'así quiero'?", "Si tuvieras que elegir una foto para tu fachada, ¿cuál sería?"],
  Sostenibilidad: ["¿Te interesa bajar el recibo de luz o captar agua de lluvia?", "¿Qué te gustaría que la casa hiciera sola?"]
};

PREGUNTAS.forEach(q => {
  if (ALTERNATIVAS[q.id]) q.alternativas = ALTERNATIVAS[q.id];
});
