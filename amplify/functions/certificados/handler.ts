import type { Schema } from '../../data/resource';

/**
 * generarCredencial — genera el PDF de la credencial con código de
 * verificación y lo guarda en S3 (credenciales/...).
 * BASE: solo responde; la lógica se completa según el plan de 8 semanas.
 */
export const handler: Schema['generarCredencial']['functionHandler'] = async (event) => {
  const { credencialId } = event.arguments;

  return {
    ok: true,
    modulo: 'certificados',
    credencialId,
    mensaje: 'Lambda de Certificados conectada (lógica pendiente).',
  };
};
