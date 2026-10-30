import { defineStorage } from '@aws-amplify/backend';

/**
 * Amazon S3 — archivos (PDF, Word, imágenes, videos).
 * Reglas base por carpeta y grupo. La autorización fina por carpeta
 * (tabla PermisoCarpeta) la valida la Lambda de permisos y auditoría,
 * que entregará URLs prefirmadas (el acceso de la Lambda al bucket
 * se agrega en backend.ts cuando se implemente).
 */
export const storage = defineStorage({
  name: 'denecArchivos',
  access: (allow) => ({
    'documentos/*': [
      allow.groups(['ADMINISTRADOR']).to(['read', 'write', 'delete']),
      allow.groups(['MIEMBRO']).to(['read']),
    ],
    'multimedia/*': [
      allow.groups(['ADMINISTRADOR']).to(['read', 'write', 'delete']),
      allow.groups(['MIEMBRO']).to(['read']),
    ],
    'credenciales/*': [allow.groups(['ADMINISTRADOR']).to(['read', 'write', 'delete'])],
    'respaldos/*': [allow.groups(['ADMINISTRADOR']).to(['read', 'write', 'delete'])],
    'publico/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['ADMINISTRADOR']).to(['read', 'write', 'delete']),
    ],
  }),
});
