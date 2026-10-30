import { defineStore } from 'pinia'
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from 'aws-amplify/auth'
import { amplifyConfigurado } from '@/amplify'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null, // { id, correo, nombre }
    grupos: [],
    cargado: false,
    vistaPrevia: false,
  }),

  getters: {
    autenticado: (state) => Boolean(state.usuario),
    esAdmin: (state) => state.grupos.includes('ADMINISTRADOR'),
    rolVisible: (state) =>
      state.grupos.includes('ADMINISTRADOR')
        ? 'Administrador'
        : state.grupos.includes('MIEMBRO')
          ? 'Miembro'
          : 'Sin rol asignado',
    iniciales: (state) =>
      (state.usuario?.nombre || state.usuario?.correo || '?')
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join(''),
  },

  actions: {
    /** Lee la sesión de Cognito (JWT) y los grupos del usuario. */
    async cargarSesion() {
      if (this.cargado || this.vistaPrevia) return
      this.cargado = true
      if (!amplifyConfigurado) return

      try {
        const { userId } = await getCurrentUser()
        const [sesion, atributos] = await Promise.all([fetchAuthSession(), fetchUserAttributes()])
        this.grupos = sesion.tokens?.accessToken?.payload['cognito:groups'] ?? []
        this.usuario = {
          id: userId,
          correo: atributos.email,
          nombre: atributos.name || atributos.email,
        }
      } catch {
        this.usuario = null
        this.grupos = []
      }
    },

    /** Devuelve el siguiente paso de Cognito (p. ej. cambio de contraseña obligatorio). */
    async iniciarSesion(correo, contrasena) {
      const { isSignedIn, nextStep } = await signIn({ username: correo, password: contrasena })
      if (isSignedIn) {
        this.cargado = false
        await this.cargarSesion()
      }
      return { isSignedIn, nextStep }
    },

    /** Solo para revisar las pantallas sin backend desplegado. */
    entrarVistaPrevia() {
      this.vistaPrevia = true
      this.cargado = true
      this.usuario = { id: 'demo', correo: 'demo@denec.org', nombre: 'María Quispe' }
      this.grupos = ['ADMINISTRADOR']
    },

    async cerrarSesion() {
      if (amplifyConfigurado && !this.vistaPrevia) await signOut()
      this.$reset()
    },
  },
})
