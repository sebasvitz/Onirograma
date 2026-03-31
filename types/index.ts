export type InputType = "texto" | "audio" | "imagen" | "mixto";

export interface EstructuraEspacial {
  tipo: "interior" | "exterior" | "híbrido" | "indefinido";
  naturaleza: "real" | "transformado" | "abstracto" | "imposible";
  limites: "definidos" | "difusos";
  escala: "normal" | "alterada" | "infinita" | "comprimida";
  organizacion: "abierta" | "cerrada" | "fragmentada";
}

export interface Luz {
  intensidad: "baja" | "media" | "alta";
  tipo: "difusa" | "puntual" | "envolvente" | "inexistente";
  temperatura: "cálida" | "fría" | "neutra";
  comportamiento: "estable" | "cambiante";
  origen: "definido" | "indefinido";
}

export interface Corporalidad {
  estado: "activo" | "pasivo" | "suspendido";
  gravedad: "normal" | "alterada";
  sensacion: "peso" | "ligereza";
  control: "libre" | "restringido";
  presencia: "definida" | "difusa";
}

export interface Recorrido {
  tipo: "lineal" | "circular" | "espiral" | "errático" | "fragmentado";
  continuidad: "continuo" | "interrumpido";
  direccion: "ascendente" | "descendente" | "sin dirección";
  logica: "guiado" | "perdido" | "repetitivo";
}

export interface TraduccionEspacial {
  potencial: string;
  estrategias: {
    luz: string;
    materialidad: string;
    recorrido: string;
    escala: string;
    atmosfera: string;
  };
}

export interface OniricCase {
  id: string;
  created_at: string;
  input: {
    tipo: InputType;
    texto_original?: string;
    transcripcion?: string;
    referencias_visuales?: string[];
  };
  resumen: string;
  estructura_espacial: EstructuraEspacial;
  dinamicas: string[];
  luz: Luz;
  materialidad: string[];
  corporalidad: Corporalidad;
  emocion: {
    principal: string;
    clima_afectivo: string;
  };
  recorrido: Recorrido;
  elementos_espaciales: string[];
  traduccion_espacial: TraduccionEspacial;
  keywords: string[];
}

export interface AnalyzeInput {
  texto?: string;
  audioBlob?: Blob;
  imagenUrl?: string;
  imagenBase64?: string;
}
