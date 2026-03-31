/**
 * Analizador onírico basado en reglas (sin IA).
 * Usa diccionarios de palabras clave en español para extraer variables
 * espaciales, sensoriales y perceptivas de relatos de sueños.
 */

import type {
  OniricCase,
  EstructuraEspacial,
  Luz,
  Corporalidad,
  Recorrido,
  TraduccionEspacial,
} from "@/types";

// ─── Utilidades ──────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countMatches(text: string, words: string[]): number {
  const n = normalize(text);
  return words.filter((w) => n.includes(normalize(w))).length;
}

function anyMatch(text: string, words: string[]): boolean {
  return countMatches(text, words) > 0;
}

function matchedWords(text: string, words: string[]): string[] {
  const n = normalize(text);
  return words.filter((w) => n.includes(normalize(w)));
}

// ─── Diccionarios de palabras clave ──────────────────────────────────────────

const KW = {
  // Estructura espacial – tipo
  interior: [
    "dentro", "adentro", "interior", "habitacion", "cuarto", "sala", "casa",
    "edificio", "tunel", "pasillo", "corredor", "cueva", "sotano", "atico",
    "cocina", "bano", "dormitorio", "recinto", "camara", "lobby", "hall",
    "piso", "techo", "pared", "ventana", "puerta", "escalera", "bodega",
    "closet", "armario", "comedor", "biblioteca", "oficina", "taller",
  ],
  exterior: [
    "fuera", "afuera", "exterior", "calle", "cielo", "campo", "bosque",
    "jardin", "plaza", "montana", "playa", "mar", "lago", "rio", "horizonte",
    "parque", "ciudad", "desierto", "oceano", "pradera", "selva", "callejon",
    "camino", "sendero", "carretera", "puente", "valle", "orilla", "costa",
  ],

  // Estructura espacial – naturaleza
  real: [
    "conocido", "familiar", "como siempre", "normal", "reconoci", "mi casa",
    "mi cuarto", "mi colegio", "mi trabajo", "barrio", "vecindario",
  ],
  transformado: [
    "diferente", "distinto", "cambiado", "transformado", "pero era",
    "aunque parecia", "extrano", "raro", "familiar pero", "como si fuera",
    "se convirtio", "se transformo", "muto",
  ],
  abstracto: [
    "abstracto", "sin forma", "formas geometricas", "colores", "figuras",
    "indefinido", "sin color", "blanco", "negro", "gris", "solo luz",
  ],
  imposible: [
    "imposible", "definia la fisica", "flotaba en el aire", "sin gravedad",
    "estructuras invertidas", "el suelo era el techo", "infinitamente",
    "no podia existir", "se abria hacia adentro", "paredes curvas infinitas",
  ],

  // Estructura espacial – límites
  limites_definidos: [
    "pared", "techo", "suelo", "limite", "frontera", "borde", "fondo",
    "esquina", "cerrado", "delimitado", "encerrado",
  ],
  limites_difusos: [
    "sin limite", "infinito", "se disuelve", "niebla", "difuso", "nebuloso",
    "no se veia el fin", "se perdia", "sin fin", "bordes", "desdibujado",
  ],

  // Estructura espacial – escala
  escala_alterada: [
    "enorme", "gigante", "inmenso", "grandisimo", "muy grande", "diminuto",
    "pequenisimo", "minusculo", "muy pequeno", "cambiaba de tamano",
    "se agrandaba", "se achicaba",
  ],
  escala_infinita: [
    "infinito", "sin fin", "interminable", "eterno", "no tenia fin",
    "enorme sin limite", "vastedad",
  ],
  escala_comprimida: [
    "estrecho", "apretado", "claustrofobico", "angosto", "comprimido",
    "no cabia", "sin espacio", "muy reducido", "aplastado",
  ],

  // Dinámicas
  expansion: [
    "se expande", "se abria", "crecia", "mas grande", "se ampliaba",
    "creciendo", "expandia", "ensanchaba",
  ],
  compresion: [
    "se comprime", "se achica", "se angosta", "se apretaba", "comprimia",
    "achicaba", "se cerraba",
  ],
  fragmentacion: [
    "fragmentos", "pedazos", "roto", "separado", "partido", "astillas",
    "fragmentado", "en partes", "trozo",
  ],
  disolucion: [
    "se disuelve", "desaparece", "se deshace", "se desvanece", "se evapora",
    "se funde", "se borra", "desaparecia",
  ],
  superposicion: [
    "superpuesto", "encima", "sobre", "fusion", "mezclado", "combinado",
    "al mismo tiempo", "dos lugares", "dos espacios",
  ],
  repeticion: [
    "repite", "de nuevo", "otra vez", "ciclo", "otra vuelta", "de regreso",
    "volvio a", "siempre igual", "en bucle",
  ],
  transicion: [
    "de repente", "cambia a", "transicion", "paso a", "apareci en",
    "salto a", "sin transicion", "de un momento", "cambie de lugar",
  ],
  deformacion: [
    "deforma", "se distorsiona", "torcido", "retorcido", "curvo", "oblicuo",
    "doblado", "contorsionado", "distorsionado",
  ],
  elevacion: [
    "sube", "asciende", "eleva", "vuela", "flota hacia arriba", "ascendia",
    "subia", "elevacion", "hacia arriba",
  ],
  descenso: [
    "baja", "desciende", "cae", "hunde", "bajando", "descendia", "cayendo",
    "hacia abajo", "profundidad",
  ],
  inestabilidad: [
    "inestable", "tiembla", "oscila", "tambalea", "se mueve", "vibraba",
    "sacudia", "no era firme", "cambiante",
  ],

  // Luz – intensidad
  luz_baja: [
    "oscuro", "penumbra", "sombra", "tenue", "poca luz", "casi sin luz",
    "apenas", "oscuridad", "negro", "noche", "tinieblas",
  ],
  luz_alta: [
    "brillante", "luminoso", "deslumbrante", "enceguece", "muy claro",
    "intenso", "radiante", "resplandeciente", "cegador",
  ],

  // Luz – tipo
  luz_difusa: [
    "difusa", "suave", "uniforme", "pareja", "blanda", "envolvente",
    "sin sombras", "difuminada",
  ],
  luz_puntual: [
    "foco", "destello", "punto de luz", "linterna", "rayo", "haz de luz",
    "spot", "faro",
  ],
  luz_envolvente: [
    "envolvente", "por todos lados", "rodeaba", "todo iluminado",
    "omnipresente", "bañado de luz",
  ],

  // Luz – temperatura
  luz_calida: [
    "calida", "dorada", "naranja", "ambar", "rojiza", "sol", "atardecer",
    "vela", "fuego", "llama", "caramelo",
  ],
  luz_fria: [
    "fria", "azul", "blanquecina", "fluorescente", "lunar", "plata",
    "plateada", "frio", "neon", "electrica", "palida",
  ],

  // Luz – origen
  luz_origen_definido: [
    "sol", "luna", "lampara", "linterna", "vela", "foco", "ventana",
    "fogata", "antorcha", "pantalla", "faro",
  ],
  luz_origen_indefinido: [
    "no se de donde", "aparecia", "sin fuente", "surgir de la nada",
    "brillo sin origen", "luz sin fuente", "venia de todas partes",
  ],

  // Materialidad
  mat_niebla: [
    "niebla", "neblina", "bruma", "humo", "vapor", "nebuloso", "nublado",
    "difuminado", "velo de humo",
  ],
  mat_agua: [
    "agua", "humedo", "mojado", "rio", "lluvia", "lago", "mar", "charco",
    "lluvia", "cascada", "gotea", "inundado", "mojaba",
  ],
  mat_vidrio: [
    "vidrio", "transparente", "cristal", "traslucido", "translucido",
    "se veia a traves", "claro como agua", "transparencia",
  ],
  mat_textil: [
    "tela", "seda", "suave", "blando", "velo", "cortina", "algodon",
    "terciopelo", "gasas", "sabana", "felpa", "tejido",
  ],
  mat_solido: [
    "piedra", "cemento", "metal", "hierro", "pesado", "duro", "concreto",
    "marmol", "madera", "ladrillo", "granito", "acero",
  ],
  mat_vacio: [
    "vacio", "nada", "aire", "inmaterial", "sin materia", "eterico",
    "intangible", "no habia nada",
  ],
  mat_reflectividad: [
    "espejo", "reflejo", "brilla", "reluce", "se refleja", "espejado",
    "reflexion", "como un espejo",
  ],
  mat_rugosidad: [
    "rugoso", "aspero", "pegajoso", "viscoso", "liso", "textura", "tacto",
    "granulado", "poroso",
  ],

  // Corporalidad – estado
  corp_activo: [
    "corro", "salto", "camino", "me muevo", "activo", "corria", "saltaba",
    "caminaba", "movia", "moviendome",
  ],
  corp_pasivo: [
    "estoy parado", "observo", "pasivo", "miraba", "estaba quieto",
    "solo observaba", "sin moverme", "inmovil",
  ],
  corp_suspendido: [
    "floto", "levito", "suspendido", "sin gravedad", "en el aire",
    "flotando", "levitando", "suspendida",
  ],

  // Corporalidad – gravedad
  grav_alterada: [
    "floto", "vuelo", "levito", "sin peso", "levedad", "flotaba",
    "volaba", "sin gravedad", "cai lentamente", "pluma",
  ],

  // Corporalidad – sensación
  corp_peso: [
    "pesado", "no puedo mover", "cargado", "como plomo", "hundido",
    "aplastado", "sin fuerzas", "muy pesado",
  ],
  corp_ligereza: [
    "liviano", "ligero", "floto", "vuelo", "sin peso", "como pluma",
    "ligereza", "levedad",
  ],

  // Corporalidad – control
  ctrl_libre: [
    "puedo", "libremente", "sin restriccion", "a mi voluntad", "controlaba",
    "decidi", "elegi", "libre",
  ],
  ctrl_restringido: [
    "no puedo", "paralizado", "atado", "bloqueado", "restriccion",
    "no me movia", "imposible mover", "pegado", "congelado", "no respondia",
  ],

  // Corporalidad – presencia
  pres_definida: [
    "mi cuerpo", "mis manos", "mis pies", "me veia", "cuerpo completo",
    "era yo", "mi figura",
  ],
  pres_difusa: [
    "sin cuerpo", "no me veia", "difuso", "como un punto de vista",
    "sin forma fisica", "presencia", "solo conciencia",
  ],

  // Emoción
  emo_calma: [
    "calma", "tranquilo", "paz", "sereno", "tranquilidad", "calmado",
    "relajado", "sosiego", "apacible",
  ],
  emo_tension: [
    "tenso", "tension", "nervioso", "alerta", "inquieto", "agitado",
    "estresado", "angustia leve",
  ],
  emo_extraneza: [
    "extrano", "raro", "peculiar", "desconcertante", "surreal", "absurdo",
    "incongruente", "no tenia sentido",
  ],
  emo_ansiedad: [
    "ansioso", "ansiedad", "angustia", "miedo", "terror", "panico",
    "desesperado", "aterrado", "asustado", "horror",
  ],
  emo_fascinacion: [
    "fascinado", "asombrado", "maravillado", "curioso", "admirado",
    "impresionado", "asombro", "fascinante", "sorprendente",
  ],
  emo_tristeza: [
    "triste", "tristeza", "melancolico", "solo", "perdida", "nostalgia",
    "lloro", "llanto", "pena",
  ],
  emo_alegria: [
    "alegre", "feliz", "eufórico", "contento", "jubilo", "dicha",
    "entusiasmado", "gozoso",
  ],

  // Recorrido – tipo
  rec_lineal: [
    "fui de", "camine hacia", "directo", "recto", "en linea recta",
    "de un punto a otro", "avanzaba",
  ],
  rec_circular: [
    "circulo", "vuelta", "regrese", "alrededor", "daba vueltas",
    "rodee", "en torno", "rodaba",
  ],
  rec_espiral: [
    "espiral", "en espiral", "bajaba en espiral", "subia en espiral",
    "se enrollaba", "daba vueltas bajando",
  ],
  rec_erratico: [
    "perdido", "sin rumbo", "de un lado a otro", "no sabia hacia donde",
    "sin direccion", "erraba", "vagaba",
  ],
  rec_fragmentado: [
    "de repente", "salto", "apareci en", "sin transicion", "cambie de lugar",
    "ya estaba en otro", "escenas distintas",
  ],

  // Recorrido – dirección
  rec_ascendente: [
    "subia", "ascendia", "hacia arriba", "escaleras arriba", "planta alta",
    "monte", "cima",
  ],
  rec_descendente: [
    "bajaba", "descendia", "hacia abajo", "escaleras abajo", "profundidad",
    "subterraneo", "sotano",
  ],

  // Recorrido – lógica
  rec_guiado: [
    "algo me guiaba", "seguia", "me conducia", "era atraido", "sigo",
    "sentia que debia ir",
  ],
  rec_perdido: [
    "perdido", "no sabia", "sin rumbo", "desorientado", "no encontraba",
    "buscaba la salida",
  ],
  rec_repetitivo: [
    "repite", "de nuevo", "otra vez", "en bucle", "siempre igual",
    "volvio al mismo lugar",
  ],

  // Recorrido – continuidad
  rec_interrumpido: [
    "de repente", "se corto", "se detuvo", "cambio brusco", "sin aviso",
    "interrumpido", "ya no seguia",
  ],
};

// ─── Detectores por categoría ─────────────────────────────────────────────────

function detectEstructuraEspacial(text: string): EstructuraEspacial {
  const intCount = countMatches(text, KW.interior);
  const extCount = countMatches(text, KW.exterior);

  let tipo: EstructuraEspacial["tipo"];
  if (intCount > 0 && extCount > 0) tipo = "híbrido";
  else if (intCount > extCount) tipo = "interior";
  else if (extCount > intCount) tipo = "exterior";
  else tipo = "indefinido";

  let naturaleza: EstructuraEspacial["naturaleza"] = "real";
  if (anyMatch(text, KW.imposible)) naturaleza = "imposible";
  else if (anyMatch(text, KW.abstracto)) naturaleza = "abstracto";
  else if (anyMatch(text, KW.transformado)) naturaleza = "transformado";
  else if (anyMatch(text, KW.real)) naturaleza = "real";
  else naturaleza = "transformado"; // default when uncertain

  const limDefCount = countMatches(text, KW.limites_definidos);
  const limDifCount = countMatches(text, KW.limites_difusos);
  const limites: EstructuraEspacial["limites"] =
    limDifCount >= limDefCount ? "difusos" : "definidos";

  let escala: EstructuraEspacial["escala"] = "normal";
  if (anyMatch(text, KW.escala_infinita)) escala = "infinita";
  else if (anyMatch(text, KW.escala_comprimida)) escala = "comprimida";
  else if (anyMatch(text, KW.escala_alterada)) escala = "alterada";

  let organizacion: EstructuraEspacial["organizacion"] = "abierta";
  if (anyMatch(text, KW.fragmentacion)) organizacion = "fragmentada";
  else if (
    anyMatch(text, KW.limites_definidos) &&
    !anyMatch(text, KW.escala_infinita)
  ) {
    organizacion = "cerrada";
  }

  return { tipo, naturaleza, limites, escala, organizacion };
}

function detectDinamicas(text: string): string[] {
  const dynamicsMap: Array<[string[], string]> = [
    [KW.expansion, "expansión"],
    [KW.compresion, "compresión"],
    [KW.fragmentacion, "fragmentación"],
    [KW.disolucion, "disolución"],
    [KW.superposicion, "superposición"],
    [KW.repeticion, "repetición"],
    [KW.transicion, "transición"],
    [KW.deformacion, "deformación"],
    [KW.elevacion, "elevación"],
    [KW.descenso, "descenso"],
    [KW.inestabilidad, "inestabilidad"],
  ];

  const detected = dynamicsMap
    .filter(([words]) => anyMatch(text, words))
    .map(([, name]) => name);

  return detected.length > 0 ? detected : ["transición"];
}

function detectLuz(text: string): Luz {
  const lowCount = countMatches(text, KW.luz_baja);
  const highCount = countMatches(text, KW.luz_alta);

  let intensidad: Luz["intensidad"] = "media";
  if (highCount > lowCount) intensidad = "alta";
  else if (lowCount > highCount) intensidad = "baja";

  let tipo: Luz["tipo"] = "difusa";
  if (anyMatch(text, KW.luz_envolvente)) tipo = "envolvente";
  else if (anyMatch(text, KW.luz_puntual)) tipo = "puntual";
  else if (anyMatch(text, KW.luz_difusa)) tipo = "difusa";
  else if (lowCount > 2) tipo = "inexistente";

  const calCount = countMatches(text, KW.luz_calida);
  const friCount = countMatches(text, KW.luz_fria);
  let temperatura: Luz["temperatura"] = "neutra";
  if (calCount > friCount) temperatura = "cálida";
  else if (friCount > calCount) temperatura = "fría";

  const comportamiento: Luz["comportamiento"] = anyMatch(text, [
    ...KW.inestabilidad,
    "parpadeaba",
    "cambiaba",
    "oscilaba",
    "variaba",
  ])
    ? "cambiante"
    : "estable";

  const origen: Luz["origen"] = anyMatch(text, KW.luz_origen_indefinido)
    ? "indefinido"
    : anyMatch(text, KW.luz_origen_definido)
    ? "definido"
    : "indefinido";

  return { intensidad, tipo, temperatura, comportamiento, origen };
}

function detectMaterialidad(text: string): string[] {
  const matMap: Array<[string[], string]> = [
    [KW.mat_niebla, "niebla / humo"],
    [KW.mat_agua, "agua / humedad"],
    [KW.mat_vidrio, "vidrio / transparencia"],
    [KW.mat_textil, "textil / suavidad"],
    [KW.mat_solido, "sólido / pesado"],
    [KW.mat_vacio, "vacío"],
    [KW.mat_reflectividad, "reflectividad"],
    [KW.mat_rugosidad, "rugosidad / viscosidad"],
  ];

  const detected = matMap
    .filter(([words]) => anyMatch(text, words))
    .map(([, name]) => name);

  return detected.length > 0 ? detected : ["indefinido"];
}

function detectCorporalidad(text: string): Corporalidad {
  const activoCount = countMatches(text, KW.corp_activo);
  const pasivoCount = countMatches(text, KW.corp_pasivo);
  const suspCount = countMatches(text, KW.corp_suspendido);

  let estado: Corporalidad["estado"] = "activo";
  if (suspCount > 0) estado = "suspendido";
  else if (pasivoCount > activoCount) estado = "pasivo";

  const gravedad: Corporalidad["gravedad"] = anyMatch(text, KW.grav_alterada)
    ? "alterada"
    : "normal";

  const pesoCount = countMatches(text, KW.corp_peso);
  const ligerCount = countMatches(text, KW.corp_ligereza);
  const sensacion: Corporalidad["sensacion"] =
    ligerCount >= pesoCount ? "ligereza" : "peso";

  const control: Corporalidad["control"] = anyMatch(text, KW.ctrl_restringido)
    ? "restringido"
    : "libre";

  const presencia: Corporalidad["presencia"] = anyMatch(text, KW.pres_difusa)
    ? "difusa"
    : "definida";

  return { estado, gravedad, sensacion, control, presencia };
}

function detectEmocion(text: string): { principal: string; clima_afectivo: string } {
  const emoMap: Array<[string[], string, string]> = [
    [KW.emo_ansiedad, "ansiedad", "clima de tensión y miedo, atmósfera opresiva"],
    [KW.emo_fascinacion, "fascinación", "clima de asombro y exploración, atmósfera abierta"],
    [KW.emo_extraneza, "extrañeza", "clima de desconcierto y ambigüedad, atmósfera liminal"],
    [KW.emo_calma, "calma", "clima de serenidad y quietud, atmósfera receptiva"],
    [KW.emo_tension, "tensión", "clima de alerta y expectativa, atmósfera cargada"],
    [KW.emo_tristeza, "tristeza", "clima melancólico y contemplativo, atmósfera silenciosa"],
    [KW.emo_alegria, "alegría", "clima eufórico y expansivo, atmósfera luminosa"],
  ];

  let bestEmo = "extrañeza";
  let bestClima = "clima de ambigüedad perceptiva, atmósfera onírica sin categoría definida";
  let bestCount = 0;

  for (const [words, emo, clima] of emoMap) {
    const count = countMatches(text, words);
    if (count > bestCount) {
      bestCount = count;
      bestEmo = emo;
      bestClima = clima;
    }
  }

  return { principal: bestEmo, clima_afectivo: bestClima };
}

function detectRecorrido(text: string): Recorrido {
  const tipoMap: Array<[string[], Recorrido["tipo"]]> = [
    [KW.rec_espiral, "espiral"],
    [KW.rec_circular, "circular"],
    [KW.rec_erratico, "errático"],
    [KW.rec_fragmentado, "fragmentado"],
    [KW.rec_lineal, "lineal"],
  ];

  let tipo: Recorrido["tipo"] = "errático";
  for (const [words, t] of tipoMap) {
    if (anyMatch(text, words)) {
      tipo = t;
      break;
    }
  }

  const continuidad: Recorrido["continuidad"] = anyMatch(
    text,
    KW.rec_interrumpido
  )
    ? "interrumpido"
    : "continuo";

  let direccion: Recorrido["direccion"] = "sin dirección";
  if (anyMatch(text, KW.rec_ascendente)) direccion = "ascendente";
  else if (anyMatch(text, KW.rec_descendente)) direccion = "descendente";

  let logica: Recorrido["logica"] = "perdido";
  if (anyMatch(text, KW.rec_guiado)) logica = "guiado";
  else if (anyMatch(text, KW.rec_repetitivo)) logica = "repetitivo";
  else if (anyMatch(text, KW.rec_perdido)) logica = "perdido";

  return { tipo, continuidad, direccion, logica };
}

function detectElementosEspaciales(text: string): string[] {
  const elements: string[] = [];

  const spatialObjects = [
    "escalera", "puerta", "ventana", "pasillo", "corredor", "tunel",
    "puente", "torre", "espejo", "agua", "mar", "rio", "lago", "bosque",
    "habitacion", "cuarto", "techo", "suelo", "pared", "muro", "arco",
    "columna", "pilar", "jardin", "campo", "desierto", "laberinto",
    "cueva", "sotano", "atico", "azotea", "terraza",
  ];

  const n = normalize(text);
  for (const obj of spatialObjects) {
    if (n.includes(normalize(obj))) {
      elements.push(obj);
    }
  }

  return elements.slice(0, 8);
}

function detectKeywords(
  text: string,
  estructura: EstructuraEspacial,
  dinamicas: string[],
  emocion: { principal: string },
  materialidad: string[]
): string[] {
  const kws = new Set<string>();

  kws.add(estructura.tipo);
  kws.add(estructura.escala);
  kws.add(emocion.principal);

  if (dinamicas.length > 0) kws.add(dinamicas[0]);
  if (materialidad.length > 0 && materialidad[0] !== "indefinido") {
    kws.add(materialidad[0].split(" / ")[0]);
  }

  // Significant words from text (filter common words)
  const stopWords = new Set([
    "que", "de", "en", "el", "la", "los", "las", "un", "una", "y", "a",
    "me", "mi", "no", "lo", "se", "le", "es", "era", "fue", "con", "para",
    "por", "pero", "si", "mas", "muy", "tan", "como", "cuando", "donde",
    "habia", "tenia", "podia", "algo", "todo", "ese", "esta", "esto",
  ]);

  const words = normalize(text)
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;

  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  for (const w of topWords) kws.add(w);

  return Array.from(kws).filter(Boolean).slice(0, 8);
}

function buildTraduccionEspacial(
  estructura: EstructuraEspacial,
  dinamicas: string[],
  luz: Luz,
  materialidad: string[],
  corporalidad: Corporalidad,
  emocion: { principal: string; clima_afectivo: string }
): TraduccionEspacial {
  // Template-based spatial translation rules
  const cues: string[] = [];

  // Spatial type + scale
  if (estructura.tipo === "interior" && estructura.escala === "comprimida") {
    cues.push("pasillo estrecho con techos bajos");
  } else if (estructura.tipo === "exterior" && estructura.escala === "infinita") {
    cues.push("plano infinito sin bordes definidos");
  } else if (estructura.tipo === "híbrido") {
    cues.push("espacio umbral entre interior y exterior");
  }

  // Dynamics
  if (dinamicas.includes("compresión")) {
    cues.push("paredes que convergen / espacio que se cierra");
  }
  if (dinamicas.includes("expansión")) {
    cues.push("volumen que se abre y dilata");
  }
  if (dinamicas.includes("fragmentación")) {
    cues.push("planos discontinuos y fragmentados");
  }
  if (dinamicas.includes("disolución")) {
    cues.push("materiales translúcidos que se esfuman");
  }
  if (dinamicas.includes("elevación")) {
    cues.push("verticalidad ascendente y espacios en altura");
  }

  // Light
  if (luz.intensidad === "baja") {
    cues.push("iluminación tenue, penumbra controlada");
  } else if (luz.intensidad === "alta") {
    cues.push("luz de alta intensidad o sobreexposición");
  }
  if (luz.temperatura === "cálida") {
    cues.push("cromatismo cálido (ámbar, dorado)");
  } else if (luz.temperatura === "fría") {
    cues.push("cromatismo frío (azul, plateado)");
  }

  // Materiality
  if (materialidad.includes("niebla / humo")) {
    cues.push("materiales difusores de luz o neblina artificial");
  }
  if (materialidad.includes("agua / humedad")) {
    cues.push("superficies reflectantes o con agua");
  }
  if (materialidad.includes("vidrio / transparencia")) {
    cues.push("planos transparentes / celosías");
  }

  // Corporality
  if (corporalidad.gravedad === "alterada") {
    cues.push("suspensión o inversión gravitacional");
  }
  if (corporalidad.control === "restringido") {
    cues.push("recorrido canalizado o restringido");
  }

  const potencial =
    cues.length > 0
      ? cues.slice(0, 4).join(" + ") + " → espacio escenográfico"
      : `espacio ${estructura.tipo} de escala ${estructura.escala} con ${emocion.principal} como clima afectivo`;

  // Design strategies
  const estrategias = {
    luz:
      luz.intensidad === "baja"
        ? "Luz tenue y dirigida; evitar iluminación cenital uniforme"
        : luz.intensidad === "alta"
        ? "Luz de alta intensidad; jugar con sobreexposición y contraste"
        : "Luz difusa de media intensidad; gradientes suaves",
    materialidad:
      materialidad.length > 0 && materialidad[0] !== "indefinido"
        ? `Priorizar: ${materialidad.slice(0, 3).join(", ")}`
        : "Materiales neutros con bajo nivel de reflectividad",
    recorrido:
      corporalidad.control === "restringido"
        ? "Recorrido guiado y canalizado; limitar elecciones espaciales"
        : "Recorrido libre; múltiples bifurcaciones y perspectivas",
    escala:
      estructura.escala === "normal"
        ? "Escala humana estándar; proporciones 1:1"
        : estructura.escala === "comprimida"
        ? "Escala comprimida; techos bajos, pasillos angostos"
        : estructura.escala === "alterada"
        ? "Escala alterada; mezcla de proporciones inusuales"
        : "Escala monumentalizada; espacios de gran altura o profundidad",
    atmosfera: `Clima de ${emocion.principal}: ${emocion.clima_afectivo}`,
  };

  return { potencial, estrategias };
}

function buildResumen(text: string): string {
  // Extract first 2–3 meaningful sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (sentences.length === 0) return text.substring(0, 200);
  if (sentences.length === 1) return sentences[0];
  return sentences.slice(0, 3).join(". ") + ".";
}

// ─── Función principal ────────────────────────────────────────────────────────

export function analyzeOniricInputRules(
  relato: string
): Omit<OniricCase, "id" | "created_at" | "input"> {
  const estructura_espacial = detectEstructuraEspacial(relato);
  const dinamicas = detectDinamicas(relato);
  const luz = detectLuz(relato);
  const materialidad = detectMaterialidad(relato);
  const corporalidad = detectCorporalidad(relato);
  const emocion = detectEmocion(relato);
  const recorrido = detectRecorrido(relato);
  const elementos_espaciales = detectElementosEspaciales(relato);
  const keywords = detectKeywords(
    relato,
    estructura_espacial,
    dinamicas,
    emocion,
    materialidad
  );
  const traduccion_espacial = buildTraduccionEspacial(
    estructura_espacial,
    dinamicas,
    luz,
    materialidad,
    corporalidad,
    emocion
  );
  const resumen = buildResumen(relato);

  return {
    resumen,
    estructura_espacial,
    dinamicas,
    luz,
    materialidad,
    corporalidad,
    emocion,
    recorrido,
    elementos_espaciales,
    traduccion_espacial,
    keywords,
  };
}

// Aliases de los matchers exportados para uso en tests o UI
export { matchedWords, anyMatch, normalize };
