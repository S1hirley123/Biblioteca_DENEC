import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { actas } from './functions/actas/resource';
import { certificados } from './functions/certificados/resource';
import { permisosAuditoria } from './functions/permisos-auditoria/resource';

/**
 * Resguardo DENEC — arquitectura general (ver arquitectura.png):
 *
 *   Usuario → Amplify Hosting → Cognito (JWT + grupos) → AppSync (GraphQL)
 *          → Lambdas (Actas · Certificados · Permisos y auditoría)
 *          → DynamoDB (datos, roles, bitácora) + S3 (PDF, Word, imágenes)
 */
defineBackend({
  auth,
  data,
  storage,
  actas,
  certificados,
  permisosAuditoria,
});
