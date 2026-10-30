<template>
  <q-page class="pagina">
    <div class="etiqueta-seccion">{{ historias }}</div>
    <h1 class="titulo-serif">{{ titulo }}</h1>
    <p class="texto-suave">
      Pantalla pendiente. Se construirá siguiendo el diseño de Figma (Prototipo v2 · Archivo vivo)
      según el plan de 8 semanas.
    </p>
    <div class="tarjeta-papel q-pa-lg q-mt-lg vacio">
      <q-icon name="o_construction" size="40px" color="secondary" />
      <div class="q-mt-sm">En construcción</div>
    </div>
  </q-page>
</template>

<script setup>
defineProps({
  titulo: { type: String, required: true },
  historias: { type: String, default: '' },
})
</script>

<style scoped>
.pagina {
  padding: 32px 40px;
}
h1 {
  font-size: 34px;
  margin: 6px 0 8px;
}
.texto-suave {
  color: var(--texto-suave);
}
.vacio {
  text-align: center;
  color: var(--texto-suave);
  max-width: 560px;
}
</style>
