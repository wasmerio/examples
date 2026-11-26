# Brief editorial: BC3 y FIEBDC explicados

> **Estado editorial: brief provisional pendiente de revisión del usuario.**
>
> Plan de investigación; no es un artículo final.

## Título, slug y fecha

- **Título provisional:** BC3 y FIEBDC explicados: qué contiene un archivo de mediciones y cómo usarlo sin perder contexto
- **Slug:** `bc3-fiebc-explicado`
- **Fecha prevista:** 2026-09-16
- **Categoría:** Tecnología

## Problema

Muchos profesionales intercambian archivos BC3/FIEBDC sin comprender qué representan, qué información conservan y qué depende del programa que los genera o importa. Una importación aparentemente correcta puede perder unidades, descomposición, rendimientos, capítulos o relaciones.

## Audiencia

Arquitectos, ingenieros, instaladores, presupuestistas, fabricantes, responsables de obra y desarrolladores que trabajan con mediciones, presupuestos y software de construcción.

## Resultado del lector

Podrá reconocer el propósito del formato, revisar su contenido antes de confiar en una importación, detectar pérdidas de contexto y formular preguntas útiles a proveedores de software.

## Alcance y no objetivos

**Incluye:** FIEBDC, BC3, entidades y relaciones conceptuales, mediciones, precios, unidades, descomposición, intercambio y validación mediante un ejemplo genérico. **No incluye:** especificación normativa completa, tutorial de una aplicación, generación de un presupuesto real, ni recomendación de proveedor.

## Tesis y ángulo

Un BC3 no es “un presupuesto universal” sino un intercambio estructurado cuyo significado depende de entidades, versión, programa y contexto. El ángulo será leerlo como contrato de datos: qué entra, qué sale y qué debe verificarse.

## Estructura propuesta

1. Por qué un archivo BC3 parece sencillo hasta que se importa.
2. FIEBDC y BC3: vocabulario mínimo.
3. Qué piezas forman mediciones y presupuestos.
4. Lo que puede perderse entre exportación e importación.
5. Cómo inspeccionar un intercambio antes de usarlo.
6. BC3, software y responsabilidades.
7. Checklist de validación.

## Preguntas de investigación

- ¿Cuál es el alcance oficial de FIEBDC y del formato BC3 vigente?
- ¿Qué entidades, campos y relaciones son esenciales para el caso de uso elegido?
- ¿Cómo se expresan unidades, descomposiciones, mediciones, precios y revisiones?
- ¿Qué diferencias de versión o implementación afectan a la interoperabilidad?
- ¿Qué pruebas mínimas detectan una importación incompleta?
- ¿Cómo enlazar BC3 con BC3Tools sin prometer compatibilidad total?

## Fuentes para la futura Investigación

Usar documentación oficial de FIEBDC y BC3Tools, especificaciones y notas de versión, documentación de importación/exportación de programas identificados y ejemplos creados para la pieza. Registrar versión, fecha, URL y sección. No inferir el estándar desde un único software.

## Requisitos de imagen

- Diagrama hero: exportación BC3, intercambio y validación entre dos sistemas.
- Tabla visual de entidades y relaciones, con datos ficticios.
- Alt text, contraste y legibilidad móvil; no capturas de software sin licencia.

## SEO y búsqueda

- **Intención:** informacional y profesional.
- **Términos principales:** `qué es BC3`, `FIEBDC BC3`, `archivo BC3`.
- **Alternativas:** `formato BC3 presupuesto`, `intercambio mediciones BC3`, `BC3Tools`, `abrir archivo BC3`, `exportar importar BC3`.
- **Justificación:** título y slug responden directamente a la consulta de definición y añaden el contexto práctico de mediciones.

## Enlaces internos

Enlazar cuando existan URLs estables con `catalogo-a-api`, `del-pdf-al-dato`, `automatizar-tareas-repetitivas` y `aprendiendo-a-programar`. El vínculo con BC3Tools debe tratarse como contexto relacionado y verificarse durante la Investigación.

## Riesgos

- Confundir formato, programa y estándar.
- Describir una versión obsoleta como vigente.
- Afirmar interoperabilidad a partir de una exportación concreta.
- Exponer archivos reales de obra o datos comerciales.
- Convertir una guía conceptual en soporte oficial de software.

## Checklist de aceptación

- [ ] Estado provisional y calendario preservados.
- [ ] Problema, audiencia, resultado, alcance y no objetivos completos.
- [ ] BC3/FIEBDC tratados con terminología oficial pendiente de verificar.
- [ ] Se planifican validación, interoperabilidad y vínculo con BC3Tools.
- [ ] Fuentes fechadas, imágenes, SEO, enlaces y riesgos incluidos.
- [ ] No se redacta artículo ni se modifica ningún brief existente.
