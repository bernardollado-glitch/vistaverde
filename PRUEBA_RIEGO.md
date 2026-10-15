# Riego cooperativo — primera prueba

Implementado el 8 de octubre de 2026.

Cada cantero tiene un botón azul independiente. Después de sembrar, cualquier jugador cercano puede pulsarlo para regar. El cartel muestra SIN AGUA o HÚMEDO con los segundos restantes. La humedad dura 12 segundos en esta demo. Se puede volver a regar cuando se seca; no se puede regar sin cultivo, sobre una planta marchita ni duplicar un riego mientras permanece húmeda.

Esta etapa muestra y sincroniza el cuidado; no modifica los 10 segundos de crecimiento ni los 15 segundos disponibles para cosechar. Ajustar sus efectos sobre el cultivo queda para la siguiente decisión de equilibrio.

El servidor valida al jugador, la distancia y la versión observada del cantero. El riego comparte la cola de guardado. Los guardados anteriores se leen con regadaEn=0 conservando las cosechas. La humedad usa el reloj del servidor y también transcurre cuando se cierra el juego.

## Prueba manual pendiente

1. Esperar Progreso guardado. Cerrar los dos clientes y la terminal de la vista previa anterior.
2. Abrir Abrir granja.command y volver a cargar el enlace en Google Chrome. Ambos deben usar la versión nueva.
3. Sembrar desde escritorio y pulsar el botón azul de ese cantero desde Chrome.
4. Comprobar HÚMEDO en ambos, su cuenta regresiva y SIN AGUA al terminar.
5. Repetir invirtiendo usuarios; cosechar y comprobar el contador compartido.
6. Regar, esperar Progreso guardado y reiniciar. Si pasan más de 12 segundos, debe estar seco; las cosechas deben conservarse.

## Verificación realizada

Compilación y comprobación TypeScript sin errores. 16 pruebas automáticas aprobadas: ciclo de cultivo, proximidad, concurrencia, riego duplicado, vencimiento de humedad, lectura compatible de guardados anteriores, datos corruptos, cola de escrituras y recuperación de riego en un nuevo servidor simulado. Aún falta validar la presentación y los clics con los clientes reales.

Respaldo de código, pruebas y almacenamiento anterior: ../respaldos/pre-riego-2026-10-08/.
