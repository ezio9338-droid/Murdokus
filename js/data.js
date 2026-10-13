// Catálogo de objetos, habitaciones, personajes y ambientación.

// block: nadie puede estar en esa casilla.
// on: frase cuando alguien está encima [masculino, femenino].
export const OBJECTS = {
  silla:      { emoji: '🪑', name: 'Silla',          un: 'una silla',          ningun: 'ninguna silla',          block: false, on: ['sentado en una silla', 'sentada en una silla'] },
  sofa:       { emoji: '🛋️', name: 'Sofá',           un: 'un sofá',            ningun: 'ningún sofá',            block: false, on: ['sentado en un sofá', 'sentada en un sofá'] },
  cama:       { emoji: '🛏️', name: 'Cama',           un: 'una cama',           ningun: 'ninguna cama',           block: false, on: ['tumbado en una cama', 'tumbada en una cama'] },
  alfombra:   { emoji: '',   name: 'Alfombra',       un: 'una alfombra',       ningun: 'ninguna alfombra',       block: false, rug: true, on: ['de pie sobre una alfombra', 'de pie sobre una alfombra'] },
  planta:     { emoji: '🪴', name: 'Planta',         un: 'una planta',         ningun: 'ninguna planta',         block: true },
  estanteria: { emoji: '📚', name: 'Estantería',     un: 'una estantería',     ningun: 'ninguna estantería',     block: true },
  mesa:       { emoji: '🍽️', name: 'Mesa',           un: 'una mesa',           ningun: 'ninguna mesa',           block: true },
  piano:      { emoji: '🎹', name: 'Piano',          un: 'un piano',           ningun: 'ningún piano',           block: true },
  reloj:      { emoji: '🕰️', name: 'Reloj de pie',   un: 'un reloj de pie',    ningun: 'ningún reloj',           block: true },
  barril:     { emoji: '🛢️', name: 'Barril',         un: 'un barril',          ningun: 'ningún barril',          block: true },
  banera:     { emoji: '🛁', name: 'Bañera',         un: 'una bañera',         ningun: 'ninguna bañera',         block: true },
  estatua:    { emoji: '🗿', name: 'Estatua',        un: 'una estatua',        ningun: 'ninguna estatua',        block: true },
  cactus:     { emoji: '🌵', name: 'Cactus',         un: 'un cactus',          ningun: 'ningún cactus',          block: true },
  fogones:    { emoji: '🍳', name: 'Fogones',        un: 'unos fogones',       ningun: 'ningún fogón',           block: true },
  espejo:     { emoji: '🪞', name: 'Espejo',         un: 'un espejo',          ningun: 'ningún espejo',          block: true },
  cajas:      { emoji: '📦', name: 'Cajas',          un: 'unas cajas',         ningun: 'ninguna caja',           block: true },
  telefono:   { emoji: '☎️', name: 'Teléfono',       un: 'el teléfono',        ningun: 'ningún teléfono',        block: true },
  globo:      { emoji: '🌍', name: 'Globo terráqueo', un: 'un globo terráqueo', ningun: 'ningún globo terráqueo', block: true },
  billar:     { emoji: '🎱', name: 'Mesa de billar', un: 'una mesa de billar', ningun: 'ninguna mesa de billar', block: true },
  archivador: { emoji: '🗄️', name: 'Archivador',     un: 'un archivador',      ningun: 'ningún archivador',      block: true },
};

export const ROOM_TYPES = [
  { name: 'Cocina',         art: 'la cocina',         objs: ['fogones', 'mesa', 'silla', 'silla', 'barril', 'planta'] },
  { name: 'Salón',          art: 'el salón',          objs: ['sofa', 'sofa', 'alfombra', 'piano', 'reloj', 'planta', 'silla'] },
  { name: 'Biblioteca',     art: 'la biblioteca',     objs: ['estanteria', 'estanteria', 'silla', 'alfombra', 'globo'] },
  { name: 'Dormitorio',     art: 'el dormitorio',     objs: ['cama', 'cama', 'espejo', 'alfombra', 'silla', 'planta'] },
  { name: 'Comedor',        art: 'el comedor',        objs: ['mesa', 'mesa', 'silla', 'silla', 'reloj', 'planta'] },
  { name: 'Baño',           art: 'el baño',           objs: ['banera', 'espejo', 'alfombra', 'planta'] },
  { name: 'Estudio',        art: 'el estudio',        objs: ['archivador', 'silla', 'silla', 'telefono', 'estanteria', 'alfombra'] },
  { name: 'Invernadero',    art: 'el invernadero',    objs: ['planta', 'planta', 'cactus', 'silla', 'estatua'] },
  { name: 'Bodega',         art: 'la bodega',         objs: ['barril', 'barril', 'cajas', 'silla'] },
  { name: 'Vestíbulo',      art: 'el vestíbulo',      objs: ['estatua', 'reloj', 'alfombra', 'alfombra', 'planta', 'sofa'] },
  { name: 'Sala de billar', art: 'la sala de billar', objs: ['billar', 'silla', 'sofa', 'alfombra', 'reloj'] },
  { name: 'Terraza',        art: 'la terraza',        objs: ['planta', 'cactus', 'silla', 'silla', 'estatua'] },
];

// [emoji, nombre español, nombre extranjero, papel, femenino, tono de piel]
// En cada caso todos los nombres son de la misma procedencia: o todos españoles o todos extranjeros.
// Tonos: 1 claro, 2 claro medio, 4 oscuro medio, 5 oscuro (el amarillo por defecto queda raro).
const TONES = { 1: '\u{1F3FB}', 2: '\u{1F3FC}', 4: '\u{1F3FE}', 5: '\u{1F3FF}' };
// El modificador va justo después del primer carácter (la persona), antes de cualquier unión ZWJ.
const withTone = (emoji, t) => {
  const [first, ...rest] = [...emoji];
  return first + TONES[t] + rest.join('');
};

export const PEOPLE = [
  ['🤵', 'Anselmo', 'Alfred', 'el mayordomo', 0, 1],
  ['👨‍🍳', 'Chef Ramírez', 'Chef Dubois', 'el chef', 0, 4],
  ['👩‍⚕️', 'Dra. Vidal', 'Dra. Harper', 'la médica de la familia', 1, 5],
  ['🧛', 'Conde Valdés', 'Lord Pembroke', 'el aristócrata', 0, 1],
  ['👵', 'Doña Remedios', 'Lady Ashworth', 'la viuda', 1, 1],
  ['💃', 'Carmen', 'Scarlett', 'la cantante', 1, 4],
  ['👨‍🎨', 'Don Bruno', 'Monsieur Blanc', 'el pintor', 0, 2],
  ['👩‍🔬', 'Prof. Ríos', 'Prof. Hartley', 'la científica', 1, 2],
  ['👨‍✈️', 'Capitán Rojas', 'Capitán Sterling', 'el aviador', 0, 5],
  ['👩‍🌾', 'Rosa', 'Daisy', 'la jardinera', 1, 4],
  ['👸', 'Marquesa Inés', 'Lady Penelope', 'la heredera', 1, 1],
  ['💂', 'Coronel Cruz', 'Coronel Whitmore', 'el coronel retirado', 0, 2],
  ['👩‍💼', 'Sra. Prado', 'Mrs. Bennett', 'la abogada', 1, 2],
  ['👨‍⚖️', 'Juez Navarro', 'Juez Holloway', 'el juez', 0, 5],
  ['👩‍🎤', 'Paloma', 'Ella Starr', 'la estrella del jazz', 1, 5],
  ['🧔', 'Tío Ernesto', 'Tío Archibald', 'el tío rico', 0, 1],
  ['👨‍💼', 'Don Julián', 'Mr. Rockwell', 'el banquero', 0, 4],
  ['👩‍🍳', 'Doña Pilar', 'Mrs. Higgins', 'la cocinera', 1, 1],
  ['👨‍🏫', 'Prof. Mora', 'Prof. Langley', 'el profesor', 0, 4],
  ['👩‍🦰', 'Marina Lago', 'Miss Marlow', 'la periodista', 1, 2],
].map(([emoji, es, en, role, f, t]) => ({ emoji: withTone(emoji, t), names: { es, en }, role, f }));

// Lugares del crimen, a juego con la procedencia de los nombres.
export const PLACES = {
  es: [
    'Villa Esperanza', 'el Castillo de Montenegro', 'el Palacete Altamira', 'la Hacienda La Niebla',
    'la Casa de los Cuervos', 'el Pazo de Valdeorras', 'el Cortijo El Olivar', 'el Gran Hotel Alcázar',
  ],
  en: [
    'la Mansión Blackwood', 'el Club Marlowe', 'la Residencia Ashford', 'el Gran Hotel Orient',
    'la Mansión Ravenscroft', 'la Abadía de Thornfield', 'el Hotel Gran Continental', 'Villa Windermere',
  ],
};

export const WEAPONS = [
  ['un candelabro', '🕯️'], ['veneno', '🧪'], ['una llave inglesa', '🔧'], ['una cuerda', '🪢'],
  ['un cuchillo de cocina', '🔪'], ['un abrecartas', '✉️'], ['un atizador', '🔥'], ['una estatuilla de bronce', '🏆'],
  ['un bastón', '🦯'], ['una botella de champán', '🍾'],
];
