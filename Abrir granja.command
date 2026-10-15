#!/bin/zsh
cd "$(dirname "$0")" || exit 1
DCL_NODE_DIR='/Applications/Decentraland Creator Hub.app/Contents/Resources/node-bin/bin'
export PATH="$DCL_NODE_DIR:$PATH"
if [[ ! -x "$DCL_NODE_DIR/node" ]]; then
  print 'No se encontró Node de Creator Hub. Verificá que Creator Hub esté instalado en Aplicaciones.'
  read '?Presioná Enter para cerrar.'
  exit 1
fi
"$DCL_NODE_DIR/node" scripts/preview-granja.cjs
read '?La vista previa terminó. Presioná Enter para cerrar.'
