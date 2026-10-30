import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const pendiente = () => import('@/pages/PendientePage.vue')

const routes = [
  // 00 · Sitio público DENEC (HU-33)
  { path: '/', name: 'publico', component: () => import('@/pages/SitioPublicoPage.vue') },

  // 01 · Acceso y recuperación (HU-01, HU-02)
  { path: '/ingreso', name: 'ingreso', component: () => import('@/pages/LoginPage.vue') },
  {
    path: '/recuperar',
    name: 'recuperar',
    component: pendiente,
    props: { titulo: 'Recuperar contraseña', historias: 'HU-02' },
  },

  // 02–09 · Administración
  {
    path: '/app',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiereSesion: true },
    children: [
      { path: '', redirect: { name: 'resumen' } },
      { path: 'resumen', name: 'resumen', component: pendiente, props: { titulo: 'Resumen', historias: 'HU-32' } },
      { path: 'documentos', name: 'documentos', component: pendiente, props: { titulo: 'Documentos', historias: 'HU-05, 08, 23, 24, 29' } },
      { path: 'multimedia', name: 'multimedia', component: pendiente, props: { titulo: 'Multimedia', historias: 'HU-09' } },
      { path: 'credenciales', name: 'credenciales', component: pendiente, props: { titulo: 'Credenciales', historias: 'HU-14' } },
      { path: 'usuarios', name: 'usuarios', component: pendiente, meta: { soloAdmin: true }, props: { titulo: 'Usuarios', historias: 'HU-03, HU-04' } },
      { path: 'reportes', name: 'reportes', component: pendiente, meta: { soloAdmin: true }, props: { titulo: 'Reportes', historias: 'HU-17' } },
      { path: 'auditoria', name: 'auditoria', component: pendiente, meta: { soloAdmin: true }, props: { titulo: 'Auditoría y permisos', historias: 'HU-25, HU-27' } },
      { path: 'respaldos', name: 'respaldos', component: pendiente, meta: { soloAdmin: true }, props: { titulo: 'Respaldos', historias: 'HU-20, 21, 22' } },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección de rutas por sesión (Cognito) y por rol (grupo ADMINISTRADOR).
// La validación real de permisos se hace en el backend; esto solo ordena la navegación.
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.cargarSesion()

  if (to.matched.some((r) => r.meta.requiereSesion) && !auth.autenticado) {
    return { name: 'ingreso', query: { volver: to.fullPath } }
  }
  if (to.matched.some((r) => r.meta.soloAdmin) && !auth.esAdmin) {
    return { name: 'resumen' }
  }
  if (to.name === 'ingreso' && auth.autenticado) {
    return { name: 'resumen' }
  }
})

export default router
