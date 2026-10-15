# Primera prueba cooperativa

Los cuatro canteros comparten sus datos mediante el Multiplayer Server de SDK7. El servidor procesa las acciones y guarda los datos en Storage. Cada cliente dibuja sus lechugas y barras a partir de los datos del servidor. Los contadores suman las cosechas de cada cantero y las plantas actualmente marchitas.

Se mantienen los tiempos acelerados: crecimiento de 10 segundos y ventana de cosecha de 15 segundos. Todavía no hay riego ni economía. La meta compartida es cinco cosechas.

## Cómo probar

1. Abrir `granja1` en Creator Hub y lanzar Preview/Play.
2. En las opciones del botón Play, habilitar **Multi-Instance Preview** para abrir otro cliente de escritorio, usando cuentas distintas. Alternativamente, usar un cliente de escritorio y un cliente web conectado a la misma vista previa.
3. Entrar con ambos jugadores a la granja y esperar que termine la sincronización inicial.
4. Sembrar con A. B debe ver la misma lechuga crecer.
5. Cosechar con B después de 10 segundos. La planta debe desaparecer en ambos y ambos contadores deben aumentar en uno.
6. Sembrar en canteros diferentes con ambos clientes y cosecharlos: el total debe aumentar en dos.
7. Dejar una planta hasta los 25 segundos desde la siembra. Ambos deben verla marchita; limpiarla desde B debe vaciar el cantero en ambos.
8. Mantener A abierto y cerrar B. Volver a entrar con B: debe recibir los cultivos y el contador de A. Repetir intercambiando quién permanece conectado.
9. Intentar cosechar la misma planta a la vez: el total esperado es una cosecha. Comprobar también que la granja sigue utilizable después.

## Guardado después de salir todos

1. Después de la migración, cerrar los clientes y detener la vista previa anterior. Volver a abrir `granja1` y lanzar Preview para iniciar el servidor nuevo. La primera vez puede empezar en cero: los datos de la versión anterior no estaban guardados.
2. Esperar el aviso «Progreso guardado» antes de interactuar. Al arrancar puede aparecer «Conectando» o «Esperando a la granja».
3. Cosechar al menos una lechuga y sembrar en otro cantero.
4. Esperar que el aviso vuelva a «Progreso guardado» y anotar el contador.
5. Cerrar todos los clientes y detener la vista previa. Cerrar y volver a abrir Creator Hub para comprobar un arranque nuevo del servidor.
6. Lanzar Preview otra vez. El contador debe conservarse. La planta puede estar marchita, porque el tiempo fuera de la escena sigue contando.
7. Repetir entre dos jugadores y verificar que el contador coincide.

Si aparece «No se pudo cargar» o «Error al guardar», no dar la prueba por aprobada: conservar el mensaje y revisar los logs. La escena bloquea acciones cuando no puede recuperar los datos para evitar sobrescribirlos.

## Límites de esta versión

- El guardado local de la vista previa y el de un World publicado son independientes. La prueba local no verifica la persistencia de una publicación.
- Storage local queda en `node_modules/@dcl/sdk-commands/.runtime-data/server-storage.json`: conservarlo antes de reinstalar dependencias. Producción guarda los datos en el servicio de Decentraland.
- Los cambios se guardan en intervalos de dos segundos, con una sola escritura en curso y reintentos ante fallos. No salir antes del aviso de guardado.
- El servidor decide los tiempos y rechaza acciones lejanas o dirigidas a una versión antigua del cultivo. Todavía requiere pruebas reales de clientes antes de agregar economía.
- La compilación y las pruebas de lógica no sustituyen la prueba con dos clientes. No se declara validado el multiplayer hasta completar esta lista.

Documentación oficial: https://docs.decentraland.org/creator/scenes-sdk7/networking/authoritative-servers
