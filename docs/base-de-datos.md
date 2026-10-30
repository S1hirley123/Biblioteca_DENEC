# Base de datos — Resguardo DENEC

Amplify Gen 2 crea una tabla de **DynamoDB** por cada modelo definido en [`amplify/data/resource.ts`](../amplify/data/resource.ts). Los usuarios no son una tabla: los guarda **Amazon Cognito**. Los archivos (PDF, Word, fotos, videos) viven en **S3**. Las tablas solo guardan su ruta (`archivoKey`, `pdfKey`, etc.).

```mermaid
erDiagram
  CARPETA ||--o{ DOCUMENTO : "contiene"
  CARPETA ||--o{ PERMISO_CARPETA : "define acceso por rol"
  USUARIO_COGNITO ||--o{ REGISTRO_AUDITORIA : "realiza acciones"

  CARPETA {
    ID id PK
    String nombre
    TipoCarpeta tipo "DOCUMENTOS o MULTIMEDIA"
    String descripcion
  }
  DOCUMENTO {
    ID id PK
    String titulo
    String descripcion
    ID carpetaId FK
    String archivoKey "ruta en S3"
    String tipoArchivo
    Int tamanoBytes
    Int version
    String_lista etiquetas
    Date fechaDocumento
  }
  PERMISO_CARPETA {
    ID id PK
    ID carpetaId FK
    RolSistema rol "ADMIN, MIEMBRO, PUBLICO"
    NivelAcceso nivel "ESCRITURA, LECTURA, SIN_ACCESO"
  }
  MULTIMEDIA {
    ID id PK
    String titulo
    TipoMultimedia tipo "FOTO o VIDEO"
    String archivoKey "ruta en S3"
    String evento
    Date fecha
  }
  CREDENCIAL {
    ID id PK
    String nombreMiembro
    String documentoIdentidad
    String cargo
    String codigo "de verificacion"
    EstadoCredencial estado
    Date fechaEmision
    Date fechaVencimiento
    String fotoKey "S3"
    String pdfKey "S3"
  }
  REGISTRO_AUDITORIA {
    ID id PK
    String usuarioId FK "sub de Cognito"
    String usuarioNombre
    AccionAuditoria accion
    String recurso
    String detalle
    DateTime fecha
  }
  NOTICIA {
    ID id PK
    String titulo
    String resumen
    String contenido
    String imagenKey "S3"
    Boolean publicada
    Date fechaPublicacion
  }
  USUARIO_COGNITO {
    String sub PK
    String email
    String name
    Grupo grupos "ADMINISTRADOR o MIEMBRO"
  }
```

Amplify agrega `createdAt` y `updatedAt` a todas las tablas.

## Quién puede leer y escribir cada tabla

| Tabla | HU | Administrador | Miembro | Público |
|---|---|---|---|---|
| Carpeta | HU-05 | Todo | Lectura | — |
| Documento | HU-05, 08, 23, 24, 29 | Todo | Lectura | — |
| PermisoCarpeta | HU-27 | Todo | Lectura | — |
| Multimedia | HU-09 | Todo | Lectura | — |
| Credencial | HU-14 | Todo | — | — |
| RegistroAuditoria | HU-25 | Solo lectura (solo las Lambdas escriben) | — | — |
| Noticia | HU-33 | Todo | Lectura | Lectura |

AppSync valida estas reglas en el backend en cada consulta. Además, la Lambda **Permisos y auditoría** revisa `PermisoCarpeta` antes de entregar una URL prefirmada de S3.
