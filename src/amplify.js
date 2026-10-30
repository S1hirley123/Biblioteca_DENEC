import { Amplify } from 'aws-amplify'

// amplify_outputs.json lo genera `npm run sandbox` (no se sube a GitHub).
// Se carga de forma opcional para que el proyecto compile aunque aún no exista.
const archivos = import.meta.glob('../amplify_outputs.json', { eager: true, import: 'default' })
const outputs = Object.values(archivos)[0]

export const amplifyConfigurado = Boolean(outputs)

if (outputs) {
  Amplify.configure(outputs)
} else {
  console.warn(
    '[Resguardo] No se encontró amplify_outputs.json. Ejecuta `npm run sandbox` para conectar con AWS. ' +
      'Mientras tanto puedes usar el modo vista previa.'
  )
}
