<template>
  <div class="ingreso row">
    <!-- Panel institucional -->
    <section class="panel-verde col-12 col-md-5 column justify-between">
      <div class="row items-center no-wrap">
        <div class="logo"><q-icon name="o_account_balance" size="20px" /></div>
        <div class="q-ml-sm">
          <div class="titulo-serif marca">Resguardo</div>
          <div class="submarca">DENEC · ARCHIVO VIVO</div>
        </div>
      </div>

      <div class="q-my-xl">
        <div class="etiqueta-seccion q-mb-md">Un archivo para la iglesia</div>
        <h1 class="titulo-serif lema">
          La memoria de la iglesia, <em class="dorado">protegida</em>.
        </h1>
        <p class="descripcion">
          Actas, fotografías, credenciales e informes de DENEC en un solo lugar seguro, ordenado y
          fácil de consultar.
        </p>
        <ul class="ventajas">
          <li><q-icon name="check" /> Cada persona ve solo lo que su rol permite</li>
          <li><q-icon name="check" /> Contraseñas cifradas, nunca en texto plano</li>
          <li><q-icon name="check" /> Cada acción queda registrada en la bitácora</li>
        </ul>
      </div>

      <router-link :to="{ name: 'publico' }" class="volver">
        <q-icon name="o_public" /> Volver al sitio público de DENEC
      </router-link>
    </section>

    <!-- Formulario -->
    <section class="col-12 col-md-7 flex flex-center q-pa-lg">
      <q-form class="tarjeta-papel formulario" @submit.prevent="ingresar">
        <h2 class="titulo-serif q-mt-none q-mb-sm">Iniciar sesión</h2>
        <p class="texto-suave q-mb-lg">Ingresa con tu correo institucional.</p>

        <label class="campo-etiqueta">Correo electrónico</label>
        <q-input
          v-model="correo"
          type="email"
          outlined
          dense
          placeholder="nombre@denec.org"
          autocomplete="username"
          class="q-mb-md campo"
          :rules="[(v) => !!v || 'Ingresa tu correo']"
          lazy-rules
        />

        <label class="campo-etiqueta">Contraseña</label>
        <q-input
          v-model="contrasena"
          :type="verContrasena ? 'text' : 'password'"
          outlined
          dense
          autocomplete="current-password"
          class="q-mb-md campo"
          :rules="[(v) => !!v || 'Ingresa tu contraseña']"
          lazy-rules
        >
          <template #append>
            <q-icon
              :name="verContrasena ? 'o_visibility_off' : 'o_visibility'"
              class="cursor-pointer"
              @click="verContrasena = !verContrasena"
            />
          </template>
        </q-input>

        <div v-if="error" class="alerta-error row no-wrap q-mb-md">
          <q-icon name="o_warning" size="18px" class="q-mr-sm" />
          <span>{{ error }}</span>
        </div>

        <div class="row justify-end q-mb-lg">
          <router-link :to="{ name: 'recuperar' }" class="enlace">¿Olvidaste tu contraseña?</router-link>
        </div>

        <q-btn
          type="submit"
          unelevated
          rounded
          no-caps
          color="primary"
          icon="o_login"
          label="Ingresar al archivo"
          class="full-width boton"
          :loading="cargando"
        />

        <div v-if="!amplifyConfigurado" class="aviso-previa q-mt-lg">
          <div class="q-mb-sm">
            Aún no hay conexión a AWS (falta <code>amplify_outputs.json</code>). Ejecuta
            <code>npm run sandbox</code> o revisa las pantallas en modo vista previa.
          </div>
          <q-btn outline rounded no-caps color="secondary" label="Entrar en modo vista previa" @click="vistaPrevia" />
        </div>
      </q-form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { amplifyConfigurado } from '@/amplify'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const correo = ref('')
const contrasena = ref('')
const verContrasena = ref(false)
const cargando = ref(false)
const error = ref('')

// Mensajes de Cognito traducidos para el usuario.
const mensajes = {
  NotAuthorizedException: 'Correo o contraseña incorrectos. Tras varios intentos fallidos la cuenta se bloquea temporalmente.',
  UserNotFoundException: 'Correo o contraseña incorrectos.',
  UserNotConfirmedException: 'Tu cuenta aún no está confirmada. Contacta al administrador.',
  LimitExceededException: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
}

async function ingresar() {
  if (!amplifyConfigurado) {
    error.value = 'No hay conexión a AWS. Usa el modo vista previa o ejecuta `npm run sandbox`.'
    return
  }
  error.value = ''
  cargando.value = true
  try {
    const { isSignedIn, nextStep } = await auth.iniciarSesion(correo.value.trim(), contrasena.value)
    if (isSignedIn) {
      router.push(route.query.volver || { name: 'resumen' })
    } else {
      // p. ej. CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED (usuarios creados por el administrador)
      error.value = `Paso adicional requerido: ${nextStep.signInStep}. (Pantalla pendiente)`
    }
  } catch (e) {
    error.value = mensajes[e.name] || 'No se pudo iniciar sesión. Inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}

function vistaPrevia() {
  auth.entrarVistaPrevia()
  router.push({ name: 'resumen' })
}
</script>

<style scoped lang="scss">
.ingreso {
  min-height: 100vh;
  background: var(--marfil);
}
.panel-verde {
  background: var(--verde-bosque);
  color: #e8efe9;
  padding: 48px 56px;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--laton);
  color: var(--verde-bosque);
  display: grid;
  place-items: center;
}
.marca {
  font-size: 20px;
  line-height: 1;
  color: #fff;
}
.submarca {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #a9bfb1;
  margin-top: 2px;
}
.lema {
  font-size: 48px;
  line-height: 1.1;
  color: #fff;
  margin: 0 0 16px;
}
.dorado {
  color: var(--laton);
  font-style: italic;
  font-weight: 500;
}
.descripcion {
  color: #b9cbbf;
  max-width: 460px;
}
.ventajas {
  list-style: none;
  padding: 0;
  li {
    margin: 10px 0;
    .q-icon {
      color: var(--laton);
      margin-right: 8px;
    }
  }
}
.volver {
  color: #b9cbbf;
  text-decoration: none;
  font-size: 14px;
}
.formulario {
  width: 100%;
  max-width: 440px;
  padding: 36px;
  h2 {
    font-size: 30px;
  }
}
.texto-suave {
  color: var(--texto-suave);
}
.campo-etiqueta {
  display: block;
  font-size: 13px;
  color: var(--texto-suave);
  margin-bottom: 6px;
}
.campo :deep(.q-field__control) {
  border-radius: 12px;
  background: #fff;
}
.alerta-error {
  background: var(--error-fondo);
  color: var(--error-texto);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
}
.enlace {
  color: var(--verde-boton);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}
.boton {
  height: 44px;
}
.aviso-previa {
  font-size: 13px;
  color: var(--texto-suave);
  border-top: 1px dashed var(--borde);
  padding-top: 16px;
}
@media (max-width: 1023px) {
  .panel-verde {
    padding: 32px 24px;
  }
  .lema {
    font-size: 34px;
  }
}
</style>
