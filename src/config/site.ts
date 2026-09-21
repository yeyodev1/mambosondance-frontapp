/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan. La voz sale del Manual de Marca 2025
 * (golden circle, manifiesto, tono y discurso): no inventar frases fuera de ese tono.
 */
export const site = {
  name: 'MamboSon',
  legalName: 'MamboSon Dance Corp',
  descriptor: 'Academia de salsa',
  tagline: 'Vibrando sin prisa, dibujando cada paso.',
  description:
    'Academia, comunidad y familia. Clases de salsa para todos los niveles, clases online, talleres especiales y eventos sociales.',
  url: 'https://mambosondance.com',
  email: 'team@mambosondance.com',
  // Solo dígitos con código de país, ej: 593984934039. Si el admin lo define en
  // Ajustes, ese valor manda sobre este.
  whatsapp: '',
  city: '',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Academia', to: '/academia' },
    { label: 'Clases online', to: '/clases' },
    { label: 'Eventos', to: '/eventos' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Profesores', to: '/profesores' },
  ],
  logos: {
    horizontal: '/brand/logo-horizontal.svg',
    horizontalWhite: '/brand/logo-horizontal-blanco.svg',
    vertical: '/brand/logo-vertical.svg',
    verticalWhite: '/brand/logo-vertical-blanco.svg',
    iso: '/brand/isotipo.svg',
    isoWhite: '/brand/isotipo-blanco.svg',
  },
  // Fotografías provisionales tomadas del manual de marca. Se reemplazan por las
  // fotos reales de la academia cuando el cliente entregue el material.
  photos: {
    hero: '/img/foto-1.jpg',
    social: '/img/foto-2.jpg',
    steps: '/img/foto-3.jpg',
    couple: '/img/foto-4.jpg',
    community: '/img/foto-5.jpg',
    expression: '/img/foto-6.jpg',
    studio: '/img/foto-7.jpg',
  },
  home: {
    hero: {
      eyebrow: 'Academia de salsa',
      title: 'El ritmo se escucha, se vive y',
      script: 'se siente',
      text: 'MamboSon es academia, comunidad y familia, donde el bienestar se baila sin prisa, dibujando cada paso.',
      primaryCta: { label: 'Empieza a bailar', to: '/clases' },
      secondaryCta: { label: 'Conoce la academia', to: '/academia' },
    },
    quote: {
      text: 'El ritmo es aquella energía interna que vibra cuando estás en sintonía contigo y con los demás.',
    },
    pillars: [
      {
        key: 'Por qué',
        title: 'Bienestar que se baila',
        text: 'En todo lo que hacemos buscamos mejorar tu bienestar físico y mental, impulsándote a salir de tu zona de confort y formar vínculos en un espacio que fomenta el autoconocimiento, la expresión y la autenticidad.',
      },
      {
        key: 'Cómo',
        title: 'Cercanía y calidez',
        text: 'Enseñando con profesionalismo, cercanía y calidez, en un ambiente seguro donde cada clase es una experiencia para soltar, conectar energías y disfrutar en comunidad.',
      },
      {
        key: 'Qué',
        title: 'Salsa para todos los niveles',
        text: 'Clases de salsa para todos los niveles, talleres especiales y eventos sociales.',
      },
    ],
    online: {
      eyebrow: 'Clases online',
      title: 'Aprende desde casa,',
      script: 'a tu ritmo',
      text: 'Si el tiempo o la distancia no te dejan llegar a la academia, llevamos la clase hasta ti: sesiones grabadas por niveles, para repetir cada paso las veces que necesites.',
      cta: { label: 'Ver clases online', to: '/clases' },
    },
    events: {
      eyebrow: 'Eventos',
      title: 'Sociales, congresos y festivales',
      text: 'La pista es donde todo cobra sentido. Entérate de lo que viene y asegura tu entrada.',
      cta: { label: 'Ver todos los eventos', to: '/eventos' },
      empty: 'Estamos preparando las próximas fechas. Muy pronto las verás aquí.',
    },
    shop: {
      eyebrow: 'Tienda',
      title: 'Lleva el ritmo puesto',
      text: 'Camisetas, zapatos, termos, pulseras y más: la marca MamboSon fuera de la pista.',
      cta: { label: 'Ir a la tienda', to: '/tienda' },
    },
    loyalty: {
      eyebrow: 'Tarjeta MamboSon',
      title: 'Tu constancia',
      script: 'tiene premio',
      text: 'Cada clase suma un sello en tu tarjeta digital. Cuando la completas, la siguiente va por nuestra cuenta.',
      cta: { label: 'Ver mi tarjeta', to: '/cuenta?tab=fidelidad' },
    },
  },
  academy: {
    eyebrow: 'La academia',
    title: 'Academia, comunidad y',
    script: 'familia',
    manifesto: [
      'MamboSon es academia, comunidad y familia, donde el bienestar se baila sin prisa, dibujando cada paso.',
      'Cada sesión es una invitación a conectar, expresar y volver a ti.',
      'Aquí, el ritmo se escucha, se vive y se siente. Es esa energía interna que despierta cuando estás en sintonía contigo, con los demás, con la música y su historia.',
    ],
    concept: {
      title: 'Vibrando sin prisa, dibujando cada paso',
      text: 'El baile, así como la vida, no se trata de llegar rápido, sino de mantener el ritmo, sentir cada momento, vivir cada paso.',
    },
    roots: {
      title: 'Dos ritmos, un nombre',
      items: [
        {
          name: 'Son',
          tag: 'La base',
          text: 'Nace a finales del siglo XIX, de ritmos africanos y melodías españolas. Es la raíz de los ritmos latinos: la semilla de donde nace todo.',
        },
        {
          name: 'Mambo',
          tag: 'La evolución',
          text: 'Años 40: el Son se encuentra con el jazz y la big band. Rápido, sincopado y dinámico; más show, fiesta y espectáculo.',
        },
      ],
      closing:
        'El Mambo es energético y festivo; el Son, fluido y suave. Dos estilos con identidad propia que juntos se complementan: eso es MamboSon.',
    },
    values: ['Ritmo', 'Conexión', 'Sinergia', 'Sincronía', 'Expresión'],
    // La reseña del fundador la entrega el cliente; mientras tanto no se inventa.
    founderPending: true,
  },
  phrases: [
    'Mantén el ritmo, siente cada momento, vive cada paso.',
    'Dibujar la música es dejar que tu cuerpo y tu ser se fundan con su ritmo, historia y emoción.',
    'En sintonía contigo, con los demás, con la música y su historia.',
  ],
  levels: {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    todos: 'Todos los niveles',
  },
  eventCategories: {
    social: 'Social',
    congreso: 'Congreso',
    festival: 'Festival',
    taller: 'Taller',
    academia: 'Academia',
  },
  // 404: en la salsa se cuenta 1, 2, 3 — pausa — 5, 6, 7 — pausa. El 4 no se pisa.
  notFound: {
    eyebrow: 'Error 404',
    title: 'En la salsa, el 4',
    script: 'es una pausa',
    text: 'Se cuenta uno, dos, tres… y el cuatro no se pisa: se respira. Esta página tampoco existe, así que tómate la pausa y volvamos al ritmo.',
    countLabel: 'El conteo de la salsa: los tiempos 4 y 8 son pausas',
    pause: 'Pausa',
    primaryCta: { label: 'Volver al inicio', to: '/' },
    links: [
      { label: 'Clases online', to: '/clases', icon: 'fa-circle-play' },
      { label: 'Eventos', to: '/eventos', icon: 'fa-calendar-days' },
      { label: 'Tienda', to: '/tienda', icon: 'fa-bag-shopping' },
      { label: 'Contacto', to: '/contacto', icon: 'fa-envelope' },
    ],
    linksTitle: 'O retoma el paso por aquí',
  },
  footer: {
    text: 'Academia de salsa. Dibujando música en cada paso.',
    credit: 'Hecho por Bakano',
    creditUrl: 'https://bakano.ec',
  },
} as const

export function whatsappLink(
  message = 'Hola MamboSon, quiero más información',
  phone?: string,
): string {
  const number = (phone || site.whatsapp).replace(/\D/g, '')
  if (!number) return '#'
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
