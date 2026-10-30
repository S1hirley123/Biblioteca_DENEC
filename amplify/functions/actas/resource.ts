import { defineFunction } from '@aws-amplify/backend';

/** Lambda: Actas — lógica de Documentos y Multimedia. */
export const actas = defineFunction({
  name: 'actas',
  entry: './handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
