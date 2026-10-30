<template>
  <q-layout view="lHh LpR lFf">
    <q-drawer v-model="menuAbierto" show-if-above :width="268" class="barra-lateral">
      <div class="column full-height no-wrap q-pa-md">
        <!-- Marca -->
        <div class="row items-center no-wrap q-mb-lg q-px-xs">
          <div class="logo"><q-icon name="o_account_balance" size="20px" /></div>
          <div class="q-ml-sm">
            <div class="titulo-serif marca">Resguardo</div>
            <div class="submarca">DENEC · ARCHIVO VIVO</div>
          </div>
        </div>

        <!-- Menú -->
        <div v-for="grupo in menuVisible" :key="grupo.titulo" class="q-mb-md">
          <div class="titulo-grupo">{{ grupo.titulo }}</div>
          <q-list>
            <q-item
              v-for="item in grupo.items"
              :key="item.ruta"
              :to="{ name: item.ruta }"
              clickable
              class="item-menu"
              active-class="item-activo"
            >
              <q-item-section avatar><q-icon :name="item.icono" size="20px" /></q-item-section>
              <q-item-section>{{ item.texto }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-space />

        <q-item clickable :to="{ name: 'publico' }" class="item-menu q-mb-sm">
          <q-item-section avatar><q-icon name="o_public" size="20px" /></q-item-section>
          <q-item-section>Ver sitio público</q-item-section>
        </q-item>

        <!-- Usuario -->
        <div class="tarjeta-usuario row items-center no-wrap">
          <q-avatar size="36px" class="avatar">{{ auth.iniciales }}</q-avatar>
          <div class="q-ml-sm col ellipsis">
            <div class="nombre ellipsis">{{ auth.usuario?.nombre }}</div>
            <div class="rol">{{ auth.rolVisible }}</div>
          </div>
          <q-btn flat round dense icon="o_logout" color="white" @click="salir">
            <q-tooltip>Cerrar sesión</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-btn
        v-if="$q.screen.lt.md"
        flat
        round
        icon="menu"
        class="q-ma-sm"
        @click="menuAbierto = !menuAbierto"
      />
      <q-banner v-if="auth.vistaPrevia" dense class="banner-previa">
        Modo vista previa: sin conexión a AWS. Los datos son de ejemplo.
      </q-banner>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuAbierto = ref(false)

const menu = [
  {
    titulo: 'Archivo',
    items: [
      { texto: 'Resumen', ruta: 'resumen', icono: 'o_dashboard' },
      { texto: 'Documentos', ruta: 'documentos', icono: 'o_description' },
      { texto: 'Multimedia', ruta: 'multimedia', icono: 'o_image' },
      { texto: 'Credenciales', ruta: 'credenciales', icono: 'o_badge' },
    ],
  },
  {
    titulo: 'Administración',
    soloAdmin: true,
    items: [
      { texto: 'Usuarios', ruta: 'usuarios', icono: 'o_group' },
      { texto: 'Reportes', ruta: 'reportes', icono: 'o_bar_chart' },
      { texto: 'Auditoría y permisos', ruta: 'auditoria', icono: 'o_history' },
      { texto: 'Respaldos', ruta: 'respaldos', icono: 'o_backup' },
    ],
  },
]

const menuVisible = computed(() => menu.filter((g) => !g.soloAdmin || auth.esAdmin))

async function salir() {
  await auth.cerrarSesion()
  router.push({ name: 'ingreso' })
}
</script>

<style scoped lang="scss">
.barra-lateral {
  background: var(--verde-bosque);
  color: #e8efe9;
}
.logo {
  width: 36px;
  height: 36px;
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
.titulo-grupo {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a9bfb1;
  margin: 0 8px 6px;
}
.item-menu {
  border-radius: 10px;
  color: #e8efe9;
  min-height: 40px;
  padding: 4px 10px;
  :deep(.q-item__section--avatar) {
    min-width: 32px;
    color: #c9d8ce;
  }
}
.item-activo {
  background: var(--marfil);
  color: var(--verde-bosque);
  font-weight: 600;
  :deep(.q-item__section--avatar) {
    color: var(--verde-bosque);
  }
}
.tarjeta-usuario {
  background: var(--verde-boton);
  border-radius: 12px;
  padding: 10px 12px;
  .avatar {
    background: var(--laton-claro);
    color: var(--verde-bosque);
    font-weight: 600;
    font-size: 13px;
  }
  .nombre {
    color: #fff;
    font-weight: 500;
  }
  .rol {
    color: #a9bfb1;
    font-size: 12px;
  }
}
.banner-previa {
  background: var(--laton-claro);
  color: #7a5c2b;
  margin: 16px 32px 0;
  border-radius: 10px;
}
</style>
