import { defineFunction } from '@aws-amplify/backend';

/** Lambda: Certificados — generación de credenciales de membresía. */
export const certificados = defineFunction({
  name: 'certificados',
  entry: './handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
