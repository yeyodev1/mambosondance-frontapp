/**
 * Copy del checkout, el acceso y el área del alumno. Vive aparte de `site.ts`
 * para que el sitio público y esta zona no se pisen, pero sigue la misma regla:
 * los componentes pintan, los textos están acá.
 */
export const studentCopy = {
  auth: {
    login: {
      eyebrow: 'Acceso',
      title: 'Vuelve a la',
      script: 'pista',
      text: 'Ingresa para ver tus clases, tus entradas y tu tarjeta MamboSon.',
    },
    register: {
      eyebrow: 'Crear cuenta',
      title: 'Empieza a',
      script: 'bailar',
      text: 'Con tu cuenta compras clases y entradas, y llevas tu tarjeta de sellos siempre contigo.',
    },
    forgot: {
      eyebrow: 'Recuperar acceso',
      title: 'Recupera tu',
      script: 'ritmo',
      text: 'Escribe tu correo y te enviamos un enlace para crear una contraseña nueva.',
      sent: 'Si ese correo tiene una cuenta, en unos minutos llegará un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.',
    },
    reset: {
      eyebrow: 'Nueva contraseña',
      title: 'Nueva',
      script: 'contraseña',
      text: 'Elige una contraseña de al menos 8 caracteres.',
    },
    welcome: {
      eyebrow: 'Bienvenida',
      title: 'Define tu',
      script: 'contraseña',
      text: 'El equipo de MamboSon creó tu cuenta. Elige tu contraseña para entrar a tus clases.',
    },
  },
  cart: {
    eyebrow: 'Tu carrito',
    title: 'Lo que te',
    script: 'llevas',
    note: 'El total final se confirma al pagar.',
    emptyTitle: 'Tu carrito está vacío',
    emptyText: 'Elige una clase online o date una vuelta por la tienda.',
  },
  checkout: {
    eyebrow: 'Finalizar compra',
    title: 'Un paso y',
    script: 'a bailar',
    payTitle: 'Paga con tarjeta',
    payText: 'El pago se procesa con Payphone. MamboSon no guarda los datos de tu tarjeta.',
    expiredTitle: 'El formulario de pago venció',
    expiredText:
      'Por seguridad, cada intento de pago dura 10 minutos. Genera uno nuevo para continuar; no se te ha cobrado nada.',
    unavailableTitle: 'Los pagos en línea estarán disponibles muy pronto',
    unavailableText:
      'Estamos terminando de habilitar el pago con tarjeta. Mientras tanto, escríbenos y te ayudamos a completar tu compra.',
    whatsappMessage: 'Hola MamboSon, quiero completar una compra de la web',
  },
  payment: {
    confirmingTitle: 'Confirmando tu pago',
    confirmingText: 'No cierres esta página. Esto toma solo unos segundos.',
    paidTitle: 'Pago',
    paidScript: 'confirmado',
    paidText: 'Te enviamos el detalle de tu compra por correo.',
    canceledTitle: 'Pago cancelado',
    canceledText:
      'No se realizó ningún cobro. Tu carrito sigue intacto por si quieres intentarlo otra vez.',
    failedTitle: 'No pudimos procesar el pago',
    failedText:
      'El pago no fue aprobado y no se te cobró. Puedes intentarlo de nuevo con la misma tarjeta o con otra.',
    errorTitle: 'No pudimos confirmar tu pago',
    errorText:
      'Tu pago puede haberse realizado. Vuelve a intentar la confirmación ahora: si no se confirma en pocos minutos, Payphone devuelve el cobro automáticamente.',
  },
  account: {
    eyebrow: 'Mi cuenta',
    coursesEmpty:
      'Todavía no tienes clases. Cuando compres una, aparecerá aquí para siempre que la necesites.',
    ticketsEmpty: 'Aún no tienes entradas. Revisa los próximos eventos y asegura la tuya.',
    ordersEmpty: 'Todavía no has hecho ningún pedido.',
    loyaltyRedeem: 'Muéstrale esta pantalla al equipo para canjearlo.',
    loyaltyDisabled: 'La tarjeta MamboSon estará disponible muy pronto.',
  },
  player: {
    blockedTitle: 'Tu acceso a esta clase terminó',
    blockedText: 'Puedes volver a comprarla cuando quieras y retomar donde lo dejaste.',
    soon: 'Próximamente',
    empty: 'Las lecciones de esta clase estarán disponibles muy pronto.',
  },
} as const
