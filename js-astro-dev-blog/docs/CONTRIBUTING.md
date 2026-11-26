# Contribuir a DevBlog

¡Gracias por tu interés en contribuir! Esta guía te ayudará a comenzar.

## Primeros Pasos

### Prerrequisitos

- Node.js 20+ (especificado en `.nvmrc`)
- npm o yarn como gestor de paquetes

### Configuración

1. Fork del repositorio
2. Clona tu fork localmente
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Copia las variables de entorno:
   ```bash
   cp .env.example .env
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Flujo de Desarrollo

### Calidad del Código

Antes de enviar un pull request, asegúrate de:

```bash
# Ejecutar linting
npm run lint

# Corregir problemas de linting
npm run lint:fix

# Formatear código
npm run format

# Verificación de tipos
npm run type-check
```

### Nomenclatura de Branches

- `feature/nombre-feature` - Nuevas funcionalidades
- `bugfix/descripcion-bug` - Corrección de bugs
- `hotfix/correccion-critica` - Correcciones críticas
- `docs/actualizaciones-documentacion` - Cambios en documentación
- `ci/configuracion-pipeline` - Cambios en CI/CD

### Mensajes de Commit (Conventional Commits)

Este proyecto sigue la convención de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nuevas funcionalidades
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios de estilo (blancos, formato, faltas de puntuación, etc.)
- `refactor:` - Refactorización de código
- `test:` - Agregar o actualizar tests
- `ci:` - Cambios en archivos y scripts de configuración de CI/CD
- `chore:` - Tareas de mantenimiento (dependencias, etc.)
- `security:` - Mejoras o parches de seguridad

## Estructura del Proyecto

```
src/
├── components/     # Componentes Astro
├── layouts/       # Layouts de páginas
├── pages/         # Páginas de rutas
├── styles/        # Estilos globales
└── utils/         # Funciones utilitarias
```

## Guías

### Estilo de Código

- Usa TypeScript para seguridad de tipos
- Sigue la configuración de ESLint
- Usa Prettier para formateo
- Mantén los componentes pequeños y enfocados

### Componentes Astro

- Usa extensión de archivo `.astro`
- Separa lógica y presentación
- Usa props para pasar datos
- Implementa proper error boundaries

### Base de Datos

- Usa Prisma para operaciones de base de datos
- Sigue las mejores prácticas de Supabase
- Implementa políticas RLS adecuadas
- Valida todas las entradas

## Enviando Cambios

1. Crea un nuevo branch desde `main`
2. Realiza tus cambios
3. Ejecuta las verificaciones de calidad
4. Haz commit con mensaje convencional
5. Push a tu fork
6. Crea pull request

### Plantilla de Pull Request

```markdown
## Descripción

Breve descripción de los cambios

## Tipo de Cambio

- [ ] Corrección de bug
- [ ] Nueva funcionalidad
- [ ] Cambio breaking
- [ ] Actualización de documentación

## Testing

- [ ] El código compila sin errores
- [ ] Todos los tests pasan
- [ ] Testing manual completado

## Checklist

- [ ] El código sigue las guías de estilo
- [ ] Auto-revisión completada
- [ ] Documentación actualizada
```

## Obtener Ayuda

- Revisa issues y discusiones existentes
- Lee la documentación de Astro
- Revisa el README del proyecto
- Pregunta en las discusiones

¡Gracias por contribuir! 🚀
