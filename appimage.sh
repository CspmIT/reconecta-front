#!/bin/bash

# Verificar si AppImageTool está instalado
if ! [ -x "$(command -v appimagetool)" ]; then
    echo "AppImageTool no está instalado. Instalándolo ahora..."
    sudo apt-get update
    sudo apt-get install -y appimagetool
fi

# Crear el AppImage
echo "Creando AppImage..."
appimagetool ./
if [ $? -ne 0 ]; then
    echo "Error al crear el AppImage."
    exit 1
fi

echo "AppImage creado exitosamente."
