# Abrir la granja con el servidor alternativo

Para la vista previa local, abrir `Abrir granja.command` con doble clic. El acceso usa Node instalado por Creator Hub y el servidor oficial Hammurabi. Mantener la terminal abierta mientras se juega. Si ya hay una vista previa usando el puerto 8000, cerrarla antes de abrir otra.

También se puede ejecutar `npm start` desde la carpeta del proyecto si Node/npm están disponibles.

El botón Preview de Creator Hub inicia directamente sdk-commands y no usa el script npm del proyecto. Sigue seleccionando Bevy en esta versión, por lo que para esta prueba se debe usar el acceso anterior.

## Diagnóstico del 8 de octubre de 2026

El servidor Bevy 0.1.0-36033403774.commit-19347eb se cierra con código 1 al recargar esta escena: informa que ya existe otro servidor usando el mismo bloqueo. Se reprodujo incluso con un único proceso headless. La revisión del código oficial indica que conserva los bloqueos anteriores y vuelve a solicitarlos cuando reaparece SceneHash. El cliente entonces permanece en «Conectando con la granja».

Se probó Hammurabi 1.7.2-30851429170.commit-274b256: inicia la granja, se conecta a LiveKit y recarga la escena sin cerrarse. Durante la prueba se observaron cosechas guardadas en el almacenamiento local y recuperadas tras recargas del servidor. Falta la confirmación del jugador y la prueba de cerrar/reabrir toda la vista previa para dar por validado el flujo completo.

No se cambiaron las reglas del cultivo ni el formato del guardado. El reporte del fallo se registró con autorización del usuario mediante la guía oficial report-sdk-issue.

## Prueba estable sin recargas automáticas

El acceso inicia ahora con `--no-watch`: compila al abrir y evita recargas por cambios de archivos durante la partida. El servidor conserva la escritura de progreso. Para incorporar cambios de código, cerrar y volver a abrir la vista previa. Se observaron recargas repetidas, pero no se confirmó qué archivo las disparó. La prueba con el observador oficial mostró que el archivo local de almacenamiento está excluido; no se atribuye el fallo a la conexión del usuario sin evidencia.
