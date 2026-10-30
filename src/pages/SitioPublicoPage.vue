<template>
  <div class="publico">
    <header class="row items-center justify-between q-px-xl q-py-md">
      <div class="titulo-serif marca">DENEC</div>
      <q-btn unelevated rounded no-caps color="primary" icon="o_login" label="Acceso con credencial" :to="{ name: 'ingreso' }" />
    </header>

    <section class="q-px-xl q-py-xl">
      <div class="etiqueta-seccion">Sitio público · HU-33</div>
      <h1 class="titulo-serif">Bienvenidos a DENEC</h1>
      <p class="texto-suave">
        Pendiente: organigrama, misión y visión, reseña histórica y noticias (según el diseño de
        Figma "00 · Sitio público DENEC").
      </p>
    </section>
  </div>
</template>

<style scoped>
.publico {
  min-height: 100vh;
  background: var(--marfil);
}
.marca {
  font-size: 24px;
  color: var(--verde-bosque);
}
h1 {
  font-size: 44px;
  margin: 8px 0 12px;
}
.texto-suave {
  color: var(--texto-suave);
  max-width: 620px;
}
</style>
