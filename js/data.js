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

  // Asientos y camas de los escenarios especiales
  asiento:    { emoji: '💺', name: 'Asiento',          un: 'un asiento',           ningun: 'ningún asiento',           block: false, on: ['sentado en un asiento', 'sentada en un asiento'] },
  butaca:     { emoji: '💺', name: 'Butaca',           un: 'una butaca',           ningun: 'ninguna butaca',           block: false, on: ['sentado en una butaca', 'sentada en una butaca'] },
  litera:     { emoji: '🛏️', name: 'Litera',           un: 'una litera',           ningun: 'ninguna litera',           block: false, on: ['tumbado en una litera', 'tumbada en una litera'] },
  capsula:    { emoji: '🛏️', name: 'Cápsula de sueño', un: 'una cápsula de sueño', ningun: 'ninguna cápsula de sueño', block: false, on: ['dentro de una cápsula de sueño', 'dentro de una cápsula de sueño'] },

  // Circo
  leon:       { emoji: '🦁', name: 'León',             un: 'un león',              ningun: 'ningún león',              block: true },
  tigre:      { emoji: '🐅', name: 'Tigre',            un: 'un tigre',             ningun: 'ningún tigre',             block: true },
  elefante:   { emoji: '🐘', name: 'Elefante',         un: 'un elefante',          ningun: 'ningún elefante',          block: true },
  tambor:     { emoji: '🥁', name: 'Tambor',           un: 'un tambor',            ningun: 'ningún tambor',            block: true },
  carrusel:   { emoji: '🎠', name: 'Carrusel',         un: 'un carrusel',          ningun: 'ningún carrusel',          block: true },
  palomitas:  { emoji: '🍿', name: 'Palomitas',        un: 'un carrito de palomitas', ningun: 'ningún carrito de palomitas', block: true },
  heno:       { emoji: '🌾', name: 'Heno',             un: 'una bala de heno',     ningun: 'ninguna bala de heno',     block: true },
  globos:     { emoji: '🎈', name: 'Globos',           un: 'unos globos',          ningun: 'ningún globo',             block: true },
  diana:      { emoji: '🎯', name: 'Diana',            un: 'una diana',            ningun: 'ninguna diana',            block: true },

  // Barco
  timon:      { emoji: '☸️', name: 'Timón',            un: 'el timón',             ningun: 'ningún timón',             block: true },
  ancla:      { emoji: '⚓', name: 'Ancla',            un: 'un ancla',             ningun: 'ningún ancla',             block: true },
  brujula:    { emoji: '🧭', name: 'Brújula',          un: 'una brújula',          ningun: 'ninguna brújula',          block: true },
  catalejo:   { emoji: '🔭', name: 'Catalejo',         un: 'un catalejo',          ningun: 'ningún catalejo',          block: true },
  cuerda:     { emoji: '🪢', name: 'Rollo de cuerda',  un: 'un rollo de cuerda',   ningun: 'ningún rollo de cuerda',   block: true },
  engranaje:  { emoji: '⚙️', name: 'Maquinaria',       un: 'la maquinaria',        ningun: 'ninguna máquina',          block: true },
  tragaperras:{ emoji: '🎰', name: 'Tragaperras',      un: 'una tragaperras',      ningun: 'ninguna tragaperras',      block: true },
  sombrilla:  { emoji: '⛱️', name: 'Sombrilla',        un: 'una sombrilla',        ningun: 'ninguna sombrilla',        block: true },

  // Teatro
  mascaras:   { emoji: '🎭', name: 'Máscaras',         un: 'unas máscaras',        ningun: 'ninguna máscara',          block: true },
  foco:       { emoji: '💡', name: 'Foco',             un: 'un foco',              ningun: 'ningún foco',              block: true },
  violin:     { emoji: '🎻', name: 'Violín',           un: 'un violín',            ningun: 'ningún violín',            block: true },
  trompeta:   { emoji: '🎺', name: 'Trompeta',         un: 'una trompeta',         ningun: 'ninguna trompeta',         block: true },
  perchero:   { emoji: '👗', name: 'Perchero',         un: 'un perchero de vestuario', ningun: 'ningún perchero',      block: true },
  calavera:   { emoji: '💀', name: 'Calavera de atrezo', un: 'una calavera de atrezo', ningun: 'ninguna calavera',     block: true },
  rosas:      { emoji: '🌹', name: 'Ramo de rosas',    un: 'un ramo de rosas',     ningun: 'ningún ramo de rosas',     block: true },

  // Estación espacial
  consola:    { emoji: '🖥️', name: 'Consola',          un: 'una consola',          ningun: 'ninguna consola',          block: true },
  robot:      { emoji: '🤖', name: 'Robot',            un: 'un robot de mantenimiento', ningun: 'ningún robot',        block: true },
  telescopio: { emoji: '🔭', name: 'Telescopio',       un: 'un telescopio',        ningun: 'ningún telescopio',        block: true },
  probetas:   { emoji: '🧪', name: 'Probetas',         un: 'unas probetas',        ningun: 'ninguna probeta',          block: true },
  satelite:   { emoji: '🛰️', name: 'Satélite',         un: 'un satélite',          ningun: 'ningún satélite',          block: true },
  lanzadera:  { emoji: '🚀', name: 'Lanzadera',        un: 'una lanzadera',        ningun: 'ninguna lanzadera',        block: true },
  especimen:  { emoji: '👽', name: 'Espécimen',        un: 'un espécimen alienígena', ningun: 'ningún espécimen',      block: true },
  bateria:    { emoji: '🔋', name: 'Batería',          un: 'una batería',          ningun: 'ninguna batería',          block: true },
  adn:        { emoji: '🧬', name: 'Muestra de ADN',   un: 'una muestra de ADN',   ningun: 'ninguna muestra de ADN',   block: true },

  // Tren
  maletas:    { emoji: '🧳', name: 'Maletas',          un: 'unas maletas',         ningun: 'ninguna maleta',           block: true },
  carbon:     { emoji: '🪨', name: 'Carbón',           un: 'un montón de carbón',  ningun: 'ningún montón de carbón',  block: true },
  champan:    { emoji: '🍾', name: 'Champán',          un: 'una cubitera de champán', ningun: 'ninguna cubitera',      block: true },
  mapa:       { emoji: '🗺️', name: 'Mapa',             un: 'un mapa',              ningun: 'ningún mapa',              block: true },

  // Más escenarios
  banco: { emoji: '🪑', name: 'Banco', un: 'un banco', ningun: 'ningún banco', block: false, on: ['sentado en un banco', 'sentada en un banco'] },
  trono: { emoji: '🪑', name: 'Trono', un: 'el trono', ningun: 'ningún trono', block: false, on: ['sentado en el trono', 'sentada en el trono'] },
  catre: { emoji: '🛏️', name: 'Catre', un: 'un catre', ningun: 'ningún catre', block: false, on: ['tumbado en un catre', 'tumbada en un catre'] },
  pupitre: { emoji: '🪑', name: 'Pupitre', un: 'un pupitre', ningun: 'ningún pupitre', block: false, on: ['sentado en un pupitre', 'sentada en un pupitre'] },
  silladirector: { emoji: '🪑', name: 'Silla de director', un: 'una silla de director', ningun: 'ninguna silla de director', block: false, on: ['sentado en una silla de director', 'sentada en una silla de director'] },
  taburete: { emoji: '🪑', name: 'Taburete', un: 'un taburete', ningun: 'ningún taburete', block: false, on: ['sentado en un taburete', 'sentada en un taburete'] },
  sarcofago: { emoji: '⚰️', name: 'Sarcófago', un: 'un sarcófago', ningun: 'ningún sarcófago', block: true },
  anfora: { emoji: '🏺', name: 'Ánfora', un: 'un ánfora', ningun: 'ningún ánfora', block: true },
  cuadro: { emoji: '🖼️', name: 'Cuadro', un: 'un cuadro', ningun: 'ningún cuadro', block: true },
  dinosaurio: { emoji: '🦖', name: 'Esqueleto de dinosaurio', un: 'un esqueleto de dinosaurio', ningun: 'ningún dinosaurio', block: true },
  huesos: { emoji: '🦴', name: 'Huesos', un: 'unos huesos fósiles', ningun: 'ningún hueso', block: true },
  joyas: { emoji: '💎', name: 'Vitrina de joyas', un: 'una vitrina de joyas', ningun: 'ninguna vitrina de joyas', block: true },
  corona: { emoji: '👑', name: 'Corona', un: 'una corona', ningun: 'ninguna corona', block: true },
  escalera: { emoji: '🪜', name: 'Escalera', un: 'una escalera de mano', ningun: 'ninguna escalera', block: true },
  escudo: { emoji: '🛡️', name: 'Escudo', un: 'un escudo', ningun: 'ningún escudo', block: true },
  espadas: { emoji: '⚔️', name: 'Espadas', un: 'unas espadas', ningun: 'ninguna espada', block: true },
  arco: { emoji: '🏹', name: 'Arco', un: 'un arco', ningun: 'ningún arco', block: true },
  cadenas: { emoji: '⛓️', name: 'Cadenas', un: 'unas cadenas', ningun: 'ninguna cadena', block: true },
  ratas: { emoji: '🐀', name: 'Ratas', un: 'unas ratas', ningun: 'ninguna rata', block: true },
  lechuza: { emoji: '🦉', name: 'Lechuza', un: 'una lechuza', ningun: 'ninguna lechuza', block: true },
  pergaminos: { emoji: '📜', name: 'Pergaminos', un: 'unos pergaminos', ningun: 'ningún pergamino', block: true },
  cirios: { emoji: '🕯️', name: 'Cirios', un: 'unos cirios', ningun: 'ningún cirio', block: true },
  campana: { emoji: '🔔', name: 'Campana', un: 'una campana', ningun: 'ninguna campana', block: true },
  asado: { emoji: '🍖', name: 'Asado', un: 'un asado', ningun: 'ningún asado', block: true },
  caballo: { emoji: '🐴', name: 'Caballo', un: 'un caballo', ningun: 'ningún caballo', block: true },
  polvora: { emoji: '💣', name: 'Pólvora', un: 'un barril de pólvora', ningun: 'ningún barril de pólvora', block: true },
  cofre: { emoji: '💰', name: 'Cofre del tesoro', un: 'un cofre del tesoro', ningun: 'ningún cofre', block: true },
  loro: { emoji: '🦜', name: 'Loro', un: 'un loro', ningun: 'ningún loro', block: true },
  botellas: { emoji: '🥃', name: 'Botellas', un: 'unas botellas de whisky', ningun: 'ninguna botella', block: true },
  cajafuerte: { emoji: '🔐', name: 'Caja fuerte', un: 'una caja fuerte', ningun: 'ninguna caja fuerte', block: true },
  hacha: { emoji: '🪓', name: 'Hacha', un: 'un hacha', ningun: 'ningún hacha', block: true },
  picos: { emoji: '⛏️', name: 'Pico', un: 'un pico de minero', ningun: 'ningún pico', block: true },
  estetoscopio: { emoji: '🩺', name: 'Estetoscopio', un: 'un estetoscopio', ningun: 'ningún estetoscopio', block: true },
  jeringas: { emoji: '💉', name: 'Jeringuillas', un: 'unas jeringuillas', ningun: 'ninguna jeringuilla', block: true },
  flores: { emoji: '💐', name: 'Ramo de flores', un: 'un ramo de flores', ningun: 'ningún ramo de flores', block: true },
  pastillas: { emoji: '💊', name: 'Pastillas', un: 'unos frascos de pastillas', ningun: 'ningún frasco de pastillas', block: true },
  microscopio: { emoji: '🔬', name: 'Microscopio', un: 'un microscopio', ningun: 'ningún microscopio', block: true },
  frigorifico: { emoji: '🧊', name: 'Cámara frigorífica', un: 'una cámara frigorífica', ningun: 'ninguna cámara frigorífica', block: true },
  cafetera: { emoji: '☕', name: 'Cafetera', un: 'una cafetera', ningun: 'ninguna cafetera', block: true },
  camara: { emoji: '🎥', name: 'Cámara', un: 'una cámara de cine', ningun: 'ninguna cámara', block: true },
  claqueta: { emoji: '🎬', name: 'Claqueta', un: 'una claqueta', ningun: 'ninguna claqueta', block: true },
  bobinas: { emoji: '🎞️', name: 'Bobinas', un: 'unas bobinas de película', ningun: 'ninguna bobina', block: true },
  chimenea: { emoji: '🔥', name: 'Chimenea', un: 'la chimenea', ningun: 'ninguna chimenea', block: true },
  esquis: { emoji: '🎿', name: 'Esquís', un: 'unos esquís', ningun: 'ningún esquí', block: true },
  lena: { emoji: '🪵', name: 'Leña', un: 'un montón de leña', ningun: 'ningún montón de leña', block: true },
  muneconieve: { emoji: '⛄', name: 'Muñeco de nieve', un: 'un muñeco de nieve', ningun: 'ningún muñeco de nieve', block: true },
  abeto: { emoji: '🌲', name: 'Abeto', un: 'un abeto', ningun: 'ningún abeto', block: true },
  quesos: { emoji: '🧀', name: 'Quesos', un: 'unos quesos', ningun: 'ningún queso', block: true },
  ajedrez: { emoji: '♟️', name: 'Ajedrez', un: 'un tablero de ajedrez', ningun: 'ningún tablero de ajedrez', block: true },
  tienda: { emoji: '⛺', name: 'Tienda de campaña', un: 'una tienda de campaña', ningun: 'ninguna tienda de campaña', block: true },
  telarana: { emoji: '🕸️', name: 'Telaraña', un: 'una telaraña', ningun: 'ninguna telaraña', block: true },
  serpiente: { emoji: '🐍', name: 'Serpiente', un: 'una serpiente', ningun: 'ninguna serpiente', block: true },
  escorpion: { emoji: '🦂', name: 'Escorpión', un: 'un escorpión', ningun: 'ningún escorpión', block: true },
  palmera: { emoji: '🌴', name: 'Palmera', un: 'una palmera', ningun: 'ninguna palmera', block: true },
  camello: { emoji: '🐪', name: 'Camello', un: 'un camello', ningun: 'ningún camello', block: true },
  balones: { emoji: '🏀', name: 'Balones', un: 'unos balones', ningun: 'ningún balón', block: true },
  porteria: { emoji: '🥅', name: 'Portería', un: 'una portería', ningun: 'ninguna portería', block: true },
  copas: { emoji: '🏆', name: 'Trofeos', un: 'unos trofeos', ningun: 'ningún trofeo', block: true },
  arbol: { emoji: '🌳', name: 'Árbol', un: 'un árbol', ningun: 'ningún árbol', block: true },
  dados: { emoji: '🎲', name: 'Mesa de dados', un: 'una mesa de dados', ningun: 'ninguna mesa de dados', block: true },
  cartas: { emoji: '🃏', name: 'Mesa de póker', un: 'una mesa de póker', ningun: 'ninguna mesa de póker', block: true },
  coctelera: { emoji: '🍸', name: 'Coctelera', un: 'una coctelera', ningun: 'ninguna coctelera', block: true },
  billetes: { emoji: '💵', name: 'Fajos de billetes', un: 'unos fajos de billetes', ningun: 'ningún fajo de billetes', block: true },
  periodicos: { emoji: '📰', name: 'Periódicos', un: 'unos periódicos', ningun: 'ningún periódico', block: true },
  pizarra: { emoji: '📋', name: 'Pizarra', un: 'una pizarra', ningun: 'ninguna pizarra', block: true },
  lavadora: { emoji: '🧺', name: 'Cesto de ropa', un: 'un cesto de ropa', ningun: 'ningún cesto de ropa', block: true },
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
// Tono 0: emojis sin piel humana (payaso, robot…).
export const withTone = (emoji, t) => {
  if (!t) return emoji;
  const [first, ...rest] = [...emoji];
  if (rest[0] === '\uFE0F') rest.shift();
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
