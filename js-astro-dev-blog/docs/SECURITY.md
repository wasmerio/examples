# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor repórtala de forma privada antes de hacerla pública.

### Cómo Reportar

1. Envía un email a: security@[tu-dominio].com
2. Incluye "Reporte de Vulnerabilidad" en el asunto
3. Proporciona información detallada sobre la vulnerabilidad
4. Incluye pasos para reproducir si es posible

### Tiempo de Respuesta

- Respuesta inicial en 48 horas
- Análisis detallado en 7 días
- Timeline de corrección depende de la severidad

## Mejores Prácticas de Seguridad

### Configuración de Supabase

- Nunca exponer service role keys en código cliente
- Usar políticas de Row Level Security (RLS)
- Validar todas las entradas de usuario
- Implementar flujos de autenticación adecuados

### Variables de Entorno

- Mantener datos sensibles en archivos `.env`
- Nunca commitear archivos `.env` al control de versiones
- Usar claves diferentes para desarrollo y producción

## Dependencias

Este proyecto utiliza:

- npm audit para escaneo de vulnerabilidades
- Actualizaciones regulares de dependencias
- Patches de seguridad aplicados prontamente
