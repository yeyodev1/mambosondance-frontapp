import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/academia',
    name: 'Academy',
    component: () => import('@/views/AcademiaView.vue'),
    meta: { title: 'La academia' },
  },
  {
    path: '/profesores',
    name: 'Teachers',
    component: () => import('@/views/ProfesoresView.vue'),
    meta: { title: 'Profesores' },
  },
  {
    path: '/clases',
    name: 'Courses',
    component: () => import('@/views/ClasesView.vue'),
    meta: { title: 'Clases online' },
  },
  {
    path: '/clases/:slug',
    name: 'CourseDetail',
    component: () => import('@/views/ClaseDetalleView.vue'),
    meta: { title: 'Clases online' },
  },
  {
    path: '/eventos',
    name: 'Events',
    component: () => import('@/views/EventosView.vue'),
    meta: { title: 'Eventos' },
  },
  {
    path: '/eventos/:slug',
    name: 'EventDetail',
    component: () => import('@/views/EventoDetalleView.vue'),
    meta: { title: 'Eventos' },
  },
  {
    path: '/tienda',
    name: 'Shop',
    component: () => import('@/views/TiendaView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/tienda/:slug',
    name: 'ShopProduct',
    component: () => import('@/views/ProductoDetalleView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: () => import('@/views/ContactoView.vue'),
    meta: { title: 'Contacto' },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('@/views/CarritoView.vue'),
    meta: { title: 'Tu carrito' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra', requiresAuth: true },
  },
  {
    // Payphone redirige acá con ?id=&clientTransactionId= — la URL está registrada
    // en Payphone Developer, no cambiarla sin actualizarla allá.
    path: '/pago/respuesta',
    name: 'PaymentResult',
    component: () => import('@/views/PagoRespuestaView.vue'),
    meta: { title: 'Resultado del pago', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar', guestOnly: true },
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/views/RegistroView.vue'),
    meta: { title: 'Crear cuenta', guestOnly: true },
  },
  {
    path: '/recuperar',
    name: 'ForgotPassword',
    component: () => import('@/views/RecuperarView.vue'),
    meta: { title: 'Recuperar contraseña', guestOnly: true },
  },
  {
    // Sirve tanto para restablecer como para definir la contraseña de una cuenta
    // creada por el equipo; por eso no es guestOnly.
    path: '/restablecer',
    name: 'ResetPassword',
    component: () => import('@/views/RestablecerView.vue'),
    meta: { title: 'Nueva contraseña' },
  },
  {
    path: '/cuenta',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { title: 'Mi cuenta', requiresAuth: true },
  },
  {
    path: '/mis-clases/:slug',
    name: 'CoursePlayer',
    component: () => import('@/views/CursoPlayerView.vue'),
    meta: { title: 'Mis clases', requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { title: 'Panel' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: 'Productos' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Producto' },
      },
      {
        path: 'productos/:id/contenido',
        name: 'AdminCourseContent',
        component: () => import('@/views/admin/AdminCourseContentView.vue'),
        meta: { title: 'Contenido del curso' },
      },
      {
        path: 'eventos',
        name: 'AdminEvents',
        component: () => import('@/views/admin/AdminEventsView.vue'),
        meta: { title: 'Eventos' },
      },
      {
        path: 'eventos/:id',
        name: 'AdminEventEdit',
        component: () => import('@/views/admin/AdminEventEditView.vue'),
        meta: { title: 'Evento' },
      },
      {
        path: 'entradas',
        name: 'AdminTickets',
        component: () => import('@/views/admin/AdminTicketsView.vue'),
        meta: { title: 'Entradas' },
      },
      {
        path: 'pedidos',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { title: 'Pedidos' },
      },
      {
        path: 'alumnos',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: { title: 'Alumnos' },
      },
      {
        path: 'alumnos/:id',
        name: 'AdminUserDetail',
        component: () => import('@/views/admin/AdminUserDetailView.vue'),
        meta: { title: 'Alumno' },
      },
      {
        path: 'accesos',
        name: 'AdminAccess',
        component: () => import('@/views/admin/AdminAccessView.vue'),
        meta: { title: 'Accesos' },
      },
      {
        path: 'fidelidad',
        name: 'AdminLoyalty',
        component: () => import('@/views/admin/AdminLoyaltyView.vue'),
        meta: { title: 'Fidelidad' },
      },
      {
        path: 'profesores',
        name: 'AdminTeachers',
        component: () => import('@/views/admin/AdminTeachersView.vue'),
        meta: { title: 'Profesores' },
      },
      {
        path: 'promos',
        name: 'AdminPromos',
        component: () => import('@/views/admin/AdminPromosView.vue'),
        meta: { title: 'Promociones' },
      },
      {
        path: 'ajustes',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Ajustes' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Account', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    // Si venía de intentar comprar, vuelve a donde iba.
    const next = typeof to.query.next === 'string' ? to.query.next : ''
    return next.startsWith('/')
      ? next
      : { name: userStore.isAdmin ? 'AdminDashboard' : 'Account', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
