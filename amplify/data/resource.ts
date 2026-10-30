import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { actas } from '../functions/actas/resource';
import { certificados } from '../functions/certificados/resource';
import { permisosAuditoria } from '../functions/permisos-auditoria/resource';

/**
 * AWS AppSync (GraphQL) + Amazon DynamoDB.
 * Cada `a.model` crea una tabla DynamoDB con su API GraphQL.
 * Las operaciones personalizadas (al final) se resuelven con las Lambdas.
 */
const schema = a
  .schema({
    // ---------- Enums ----------
    RolSistema: a.enum(['ADMINISTRADOR', 'MIEMBRO', 'PUBLICO']),
    NivelAcceso: a.enum(['ESCRITURA', 'LECTURA', 'SIN_ACCESO']),
    TipoCarpeta: a.enum(['DOCUMENTOS', 'MULTIMEDIA']),
    TipoMultimedia: a.enum(['FOTO', 'VIDEO']),
    EstadoCredencial: a.enum(['VIGENTE', 'VENCIDA', 'REVOCADA']),
    AccionAuditoria: a.enum([
      'ACCEDIO',
      'CREADO',
      'EDITADO',
      'ELIMINADO',
      'DESCARGADO',
      'ROL_CAMBIADO',
      'PERMISO_CAMBIADO',
    ]),

    // ---------- Gestión documental (HU-05, 08, 23, 24, 29) ----------
    Carpeta: a
      .model({
        nombre: a.string().required(),
        tipo: a.ref('TipoCarpeta'),
        descripcion: a.string(),
        documentos: a.hasMany('Documento', 'carpetaId'),
        permisos: a.hasMany('PermisoCarpeta', 'carpetaId'),
      })
      .authorization((allow) => [
        allow.group('ADMINISTRADOR'),
        allow.group('MIEMBRO').to(['read']),
      ]),

    Documento: a
      .model({
        titulo: a.string().required(),
        descripcion: a.string(),
        carpetaId: a.id().required(),
        carpeta: a.belongsTo('Carpeta', 'carpetaId'),
        archivoKey: a.string().required(), // ruta en S3: documentos/...
        tipoArchivo: a.string(), // pdf, docx, ...
        tamanoBytes: a.integer(),
        version: a.integer().default(1),
        etiquetas: a.string().array(),
        fechaDocumento: a.date(),
      })
      .authorization((allow) => [
        allow.group('ADMINISTRADOR'),
        allow.group('MIEMBRO').to(['read']),
      ]),

    // ---------- Multimedia (HU-09) ----------
    Multimedia: a
      .model({
        titulo: a.string().required(),
        tipo: a.ref('TipoMultimedia'),
        archivoKey: a.string().required(), // multimedia/...
        evento: a.string(),
        fecha: a.date(),
      })
      .authorization((allow) => [
        allow.group('ADMINISTRADOR'),
        allow.group('MIEMBRO').to(['read']),
      ]),

    // ---------- Credenciales y membresía (HU-14) ----------
    Credencial: a
      .model({
        nombreMiembro: a.string().required(),
        documentoIdentidad: a.string().required(),
        cargo: a.string(),
        codigo: a.string().required(),
        estado: a.ref('EstadoCredencial'),
        fechaEmision: a.date(),
        fechaVencimiento: a.date(),
        fotoKey: a.string(),
        pdfKey: a.string(), // credenciales/... (lo genera la Lambda de certificados)
      })
      .authorization((allow) => [allow.group('ADMINISTRADOR')]),

    // ---------- Permisos por carpeta (HU-27) ----------
    PermisoCarpeta: a
      .model({
        carpetaId: a.id().required(),
        carpeta: a.belongsTo('Carpeta', 'carpetaId'),
        rol: a.ref('RolSistema').required(),
        nivel: a.ref('NivelAcceso').required(),
      })
      .authorization((allow) => [
        allow.group('ADMINISTRADOR'),
        allow.group('MIEMBRO').to(['read']),
      ]),

    // ---------- Bitácora de auditoría (HU-25) ----------
    // Solo lectura para administradores; solo la Lambda escribe (no se edita ni borra).
    RegistroAuditoria: a
      .model({
        usuarioId: a.string().required(),
        usuarioNombre: a.string(),
        accion: a.ref('AccionAuditoria').required(),
        recurso: a.string().required(),
        detalle: a.string(),
        fecha: a.datetime().required(),
      })
      .authorization((allow) => [allow.group('ADMINISTRADOR').to(['read'])]),

    // ---------- Sitio público DENEC (HU-33) ----------
    Noticia: a
      .model({
        titulo: a.string().required(),
        resumen: a.string(),
        contenido: a.string(),
        imagenKey: a.string(), // publico/...
        publicada: a.boolean().default(false),
        fechaPublicacion: a.date(),
      })
      .authorization((allow) => [
        allow.guest().to(['read']),
        allow.authenticated().to(['read']),
        allow.group('ADMINISTRADOR'),
      ]),

    // ---------- Operaciones personalizadas → Lambdas ----------
    procesarActa: a
      .mutation()
      .arguments({ documentoId: a.id().required() })
      .returns(a.json())
      .authorization((allow) => [allow.group('ADMINISTRADOR')])
      .handler(a.handler.function(actas)),

    generarCredencial: a
      .mutation()
      .arguments({ credencialId: a.id().required() })
      .returns(a.json())
      .authorization((allow) => [allow.group('ADMINISTRADOR')])
      .handler(a.handler.function(certificados)),

    obtenerUrlArchivo: a
      .query()
      .arguments({
        archivoKey: a.string().required(),
        operacion: a.string().required(), // 'LEER' | 'SUBIR'
      })
      .returns(a.json())
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(permisosAuditoria)),
  })
  // Las Lambdas pueden leer/escribir las tablas (p. ej. registrar en la bitácora).
  .authorization((allow) => [
    allow.resource(actas),
    allow.resource(certificados),
    allow.resource(permisosAuditoria),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
