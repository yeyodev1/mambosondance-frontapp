export interface AdminNavItem {
  name: string
  label: string
  icon: string
  /** Texto corto para el acceso rápido del inicio. */
  hint?: string
}

export interface AdminNavGroup {
  title: string
  items: AdminNavItem[]
}

// Primero lo que se hace todos los días desde el celular; la configuración, al final.
export const adminNav: AdminNavGroup[] = [
  {
    title: 'Día a día',
    items: [
      { name: 'AdminDashboard', label: 'Inicio', icon: 'fa-solid fa-house' },
      {
        name: 'AdminAccess',
        label: 'Dar acceso',
        icon: 'fa-solid fa-key',
        hint: 'Abrirle una clase a un alumno',
      },
      {
        name: 'AdminLoyalty',
        label: 'Sellar tarjeta',
        icon: 'fa-solid fa-stamp',
        hint: 'Poner un sello o canjear un premio',
      },
      {
        name: 'AdminTickets',
        label: 'Verificar entrada',
        icon: 'fa-solid fa-ticket',
        hint: 'Revisar códigos en la puerta',
      },
      {
        name: 'AdminOrders',
        label: 'Pedidos',
        icon: 'fa-solid fa-receipt',
        hint: 'Ventas y envíos',
      },
      { name: 'AdminUsers', label: 'Alumnos', icon: 'fa-solid fa-users' },
    ],
  },
  {
    title: 'Contenido',
    items: [
      {
        name: 'AdminProducts',
        label: 'Clases y merch',
        icon: 'fa-solid fa-box-open',
        hint: 'Paquetes, precios y videos',
      },
      {
        name: 'AdminEvents',
        label: 'Eventos',
        icon: 'fa-solid fa-calendar-days',
        hint: 'Publicar eventos y preventas',
      },
      {
        name: 'AdminPromos',
        label: 'Promociones',
        icon: 'fa-solid fa-bullhorn',
        hint: 'Actualizar las promos del sitio',
      },
      { name: 'AdminTeachers', label: 'Profesores', icon: 'fa-solid fa-person-chalkboard' },
    ],
  },
  {
    title: 'Configuración',
    items: [{ name: 'AdminSettings', label: 'Ajustes', icon: 'fa-solid fa-gear' }],
  },
]

export const quickActions: AdminNavItem[] = adminNav
  .flatMap((group) => group.items)
  .filter((item) => item.hint)
