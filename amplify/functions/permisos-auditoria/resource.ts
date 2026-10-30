import { defineFunction } from '@aws-amplify/backend';

/** Lambda: Permisos y auditoría — valida acceso por carpeta, entrega URL prefirmada y registra en la bitácora. */
export const permisosAuditoria = defineFunction({
  name: 'permisos-auditoria',
  entry: './handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
