import type { Schema } from '../../data/resource';

type Identidad = { sub?: string; username?: string; groups?: string[] | null };

/**
 * obtenerUrlArchivo — "autorización por rol y por recurso · validar permisos en backend".
 * 1. Lee los grupos del JWT de Cognito.
 * 2. (Pendiente) Consulta PermisoCarpeta para la carpeta del archivo.
 * 3. (Pendiente) Genera la URL prefirmada de S3 y registra en RegistroAuditoria.
 */
export const handler: Schema['obtenerUrlArchivo']['functionHandler'] = async (event) => {
  const { archivoKey, operacion } = event.arguments;
  const identidad = (event.identity ?? {}) as Identidad;
  const grupos = identidad.groups ?? [];

  const esAdmin = grupos.includes('ADMINISTRADOR');
  const permitido = esAdmin || (operacion === 'LEER' && grupos.includes('MIEMBRO'));

  return {
    ok: permitido,
    modulo: 'permisos-auditoria',
    archivoKey,
    operacion,
    grupos,
    url: null,
    mensaje: permitido
      ? 'Acceso permitido por rol (URL prefirmada pendiente).'
      : 'Sin acceso a este recurso.',
  };
};
