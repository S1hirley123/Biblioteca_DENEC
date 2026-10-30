import { defineAuth } from '@aws-amplify/backend';

/**
 * Amazon Cognito — inicio de sesión con correo (HU-01, HU-02).
 * Grupos = roles del sistema. El "Público general" no inicia sesión:
 * usa la identidad de invitado (guest) para ver el sitio público.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['ADMINISTRADOR', 'MIEMBRO'],
});
