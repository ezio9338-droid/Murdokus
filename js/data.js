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

// [emoji, nombre corto, papel, femenino]
export const PEOPLE = [
  ['🤵', 'Alfred', 'el mayordomo', 0],
  ['👨‍🍳', 'Ramírez', 'el chef', 0],
  ['👩‍⚕️', 'Dra. Vidal', 'la médica de la familia', 1],
  ['🧛', 'Conde Varga', 'el aristócrata', 0],
  ['👵', 'Lady Ashworth', 'la viuda', 1],
  ['💃', 'Carmen', 'la cantante', 1],
  ['👨‍🎨', 'Monsieur Blanc', 'el pintor', 0],
  ['👩‍🔬', 'Prof. Ríos', 'la científica', 1],
  ['👨‍✈️', 'Capitán Rojas', 'el aviador', 0],
  ['👩‍🌾', 'Rosa', 'la jardinera', 1],
  ['👸', 'Duquesa Imperia', 'la heredera', 1],
  ['🤠', 'Coronel Cruz', 'el coronel retirado', 0],
  ['👩‍💼', 'Sra. Prado', 'la abogada', 1],
  ['👨‍⚖️', 'Juez Navarro', 'el juez', 0],
  ['👩‍🎤', 'Lola Starr', 'la estrella del jazz', 1],
  ['🧔', 'Tío Ernesto', 'el tío rico', 0],
  ['👨‍💼', 'Don Julián', 'el banquero', 0],
  ['👩‍🍳', 'Doña Pilar', 'la cocinera', 1],
  ['👨‍🏫', 'Prof. Mora', 'el profesor', 0],
  ['👩‍🦰', 'Miss Marlow', 'la periodista', 1],
].map(([emoji, short, role, f]) => ({ emoji, short, role, f }));

export const PLACES = [
  'la Mansión Blackwood', 'Villa Esperanza', 'el Hotel Gran Continental', 'el Castillo de Montenegro',
  'el Club Marlowe', 'la Residencia Ashford', 'el Palacete Altamira', 'la Hacienda La Niebla',
  'el Gran Hotel Orient', 'la Casa de los Cuervos',
];

export const WEAPONS = [
  ['un candelabro', '🕯️'], ['veneno', '🧪'], ['una llave inglesa', '🔧'], ['una cuerda', '🪢'],
  ['un cuchillo de cocina', '🔪'], ['un abrecartas', '✉️'], ['un atizador', '🔥'], ['una estatuilla de bronce', '🏆'],
  ['un bastón', '🦯'], ['una botella de champán', '🍾'],
];
