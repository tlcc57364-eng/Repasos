# Repaso: Sistemas Expertos, Machine Learning, REST y Serverless

> ⚠️ = pregunta que fallaste en el intento (conviene repasarla con más atención). ✅ = ya la tenías correcta.

---

## 1. ¿Qué figura extrae el conocimiento de los especialistas y le da una representación en el sistema? ⚠️
**Respuesta: El Ingeniero de Conocimiento.**
Es quien entrevista al experto y traduce su conocimiento a reglas/hechos para la Base de Conocimientos. El Experto de Dominio es quien *tiene* el conocimiento; el Científico de Datos trabaja con datos, no con conocimiento humano.

## 2. ¿Qué método nativo de JavaScript transforma el objeto en la carga útil HTTP (cadena de texto estructurada)? ⚠️
**Respuesta: `JSON.stringify()`**
Convierte un objeto JS a cadena JSON. `json.parse()` hace lo contrario (cadena → objeto), `fetch()` envía la petición y `headers.append()` solo agrega cabeceras.

## 3. Cuando los humanos no saben explicar su intuición para resolver un problema complejo, ¿qué enfoque de IA es más adecuado? ⚠️
**Respuesta: Machine Learning.**
Si el experto no puede explicitar sus reglas, no se pueden codificar en un Sistema Experto; el ML las aprende a partir de ejemplos.

## 4. Hechos `estudiante(juan).` y `tiene_edad(juan, 8).` en Prolog: ¿qué tipo de lógica? ⚠️
**Respuesta: Predicados** (lógica de predicados / primer orden).
Cada hecho es un predicado con argumentos. La lógica difusa maneja grados de verdad, no es lo que se usa aquí.

## 5. Bagging en Random Forest (Ho 1995, Breiman 2001): ¿qué significa? ⚠️
**Respuesta: Bootstrap Aggregating: crear subconjuntos de datos al azar con reemplazo para cada árbol.**
Cada árbol se entrena con una muestra bootstrap y luego se agregan (votación/promedio) los resultados.

## 6. Scikit-Learn en Python para resolver un problema de crédito: ⚠️
**Respuesta: Estamos aplicando técnicas de Machine Learning.**
Scikit-Learn es una librería de ML, no de Sistemas Expertos clásicos ni de LISP.

## 7. Petición de pre-vuelo (preflight) en REST con respuesta 204: ¿qué método HTTP debe interceptar el código Python? ⚠️
**Respuesta: `OPTIONS`**
El navegador envía una petición `OPTIONS` (CORS preflight) antes del POST complejo entre dominios distintos.

## 8. Dialogflow: las "Intenciones" equivalen a qué componente clásico de un Sistema Experto? ⚠️
**Respuesta: A las Reglas de dominio.**
Las intenciones asocian lo que dice el usuario con una acción a tomar, igual que las reglas SI-ENTONCES de la base de conocimientos.

## 9. Regla "SI pasillo mojado Y baño seco ENTONCES problema en la cocina". El hecho "pasillo mojado" sirve como: ✅
**Respuesta: Premisa.**
Es la parte del SI (antecedente). "Problema en la cocina" es la conclusión.

## 10. Cabeceras HTTP para que el navegador guarde temporalmente respuestas estáticas y no golpee el servidor: ¿qué restricción REST? ✅
**Respuesta: Caché.**

## 11. ¿Por qué la factura de la función Cloud fue $0.00 durante un mes sin actividad? ⚠️
**Respuesta: El modelo Pay-as-you-go no cobra por capacidad inactiva.**
En Serverless solo pagas por ejecución real. No es cierto que las funciones se apaguen permanentemente a las 24 h.

## 12. Un Sistema Experto se diferencia del Machine Learning porque: ✅
**Respuesta: Emula las decisiones de un experto.**
Se basa en conocimiento humano codificado, no en aprendizaje desde grandes volúmenes de datos.

## 13. Origen histórico del Dataset Iris: ⚠️
**Respuesta: Fue introducido en 1936 por el biólogo y estadístico británico Sir Ronald Aylmer Fisher.**

## 14. "Dominio de Experticidad" se refiere a: ✅
**Respuesta: El área del experto humano con mayor experiencia.**

## 15. Algoritmo que aprende de tomografías ya diagnosticadas por doctores (ejemplos con "respuesta correcta"): ⚠️
**Respuesta: Aprendizaje Supervisado.**
Se entrena con datos etiquetados (entrada + respuesta correcta).

## 16. Un hecho en Prolog termina típicamente con: ⚠️
**Respuesta: Punto (.)**

## 17. Cosmos DB (servicio gestionado) + Cloud Functions (código por eventos): ¿qué enfoques Serverless? ✅
**Respuesta: BaaS para la base de datos y FaaS para el motor de inferencia.**

## 18. En Machine Learning el sistema "induce" las reglas. Esto significa que: ⚠️
**Respuesta: El sistema descubre patrones implícitos.**
Las reglas no las escribe un programador; salen de los datos.

## 19. La Lógica Difusa difiere de la Booleana porque: ⚠️
**Respuesta: Permite grados de verdad.**
La booleana solo admite verdadero/falso; la difusa admite valores intermedios entre 0 y 1.

## 20. Ventaja principal de un Sistema Experto frente a un modelo de ML profundo: ⚠️
**Respuesta: Su razonamiento es fácilmente explicable.**
Se puede rastrear qué reglas se activaron (transparencia), a diferencia de la "caja negra" del deep learning.

## 21. Frontend en Angular y backend en Python, evolucionando la interfaz sin tocar la base de datos: ¿qué restricción REST? ✅
**Respuesta: Cliente-Servidor.**
Separa las responsabilidades de interfaz y almacenamiento para que evolucionen de forma independiente.

## 22. Random Forest con 100% de precisión sobre el Dataset Iris: ¿qué automatizó matemáticamente sin if/else manuales? ⚠️
**Respuesta: Ha aprendido las reglas dimensionales para diferenciar especies botánicas.**

## 23. En Forward Chaining en Python, ¿qué instrucción asegura que *todos* los síntomas requeridos por la regla estén presentes? ✅
**Respuesta: `all(sintoma in sintomas_usuario for sintoma in regla["sintomas"])`**
`all()` exige que todos se cumplan; `any()` solo requiere uno.

## 24. Los dos componentes fundamentales de un Sistema Experto: ⚠️
**Respuesta: Base de Conocimientos y Motor de Inferencia.**

## 25. Desplegar un motor de reglas en la nube sin personal DevOps, con escalado automático e invisible: ⚠️
**Respuesta: Serverless.**
Elimina la gestión de servidores y sistemas operativos; el proveedor escala automáticamente.

---

## Resumen rápido de conceptos clave

| Concepto | Idea central |
|---|---|
| Ingeniero de Conocimiento | Extrae y representa el conocimiento del experto |
| Sistema Experto | Base de Conocimientos + Motor de Inferencia; explicable |
| Machine Learning | Aprende patrones desde datos; "induce" reglas |
| Aprendizaje Supervisado | Datos con etiqueta/respuesta correcta |
| Lógica Difusa | Grados de verdad (no solo V/F) |
| Prolog | Hechos y reglas terminan en `.`; lógica de predicados |
| Bagging | Bootstrap Aggregating (muestras con reemplazo) |
| Iris | Fisher, 1936 |
| REST: Cliente-Servidor | Separa interfaz de almacenamiento |
| REST: Caché | Reutilizar respuestas y no golpear el servidor |
| Preflight CORS | Método `OPTIONS`, respuesta 204 |
| JSON.stringify() | Objeto JS → cadena JSON |
| Serverless | Sin gestionar servidores, escala solo, pago por uso |
| BaaS / FaaS | Backend gestionado (BD) / funciones por eventos |
