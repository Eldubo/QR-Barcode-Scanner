# QR / Barcode Scanner (Expo)

Aplicación móvil construida con Expo (React Native) para escanear códigos QR y de barras de forma rápida, con linterna, cambio de cámara, copiar al portapapeles y apertura de enlaces.

## Características
- Escaneo de QR y códigos de barras comunes: `qr`, `ean13`, `ean8`, `code128`, `code39`, `code93`, `pdf417`, `upc_a`, `upc_e`, `itf14`.
- Linterna (flash) On/Off.
- Cambiar cámara (frontal/trasera).
- Copiar resultado al portapapeles.
- Abrir enlace automáticamente si el contenido es una URL.
- Navegación con `expo-router`.

## Requisitos
- Node.js 20+ (recomendado mantener la última LTS o superior a la exigida por Expo/React Native).
- Expo CLI (vía `npx`) y app Expo Go en tu dispositivo.
- Android Studio (opcional) para emulador Android.

## Instalación
```bash
# Clona este repositorio
git clone https://github.com/tu-usuario/QR-Barcode-Scanner.git
cd QR-Barcode-Scanner

# Instala dependencias
npm install
```

## Ejecutar (recomendado con túnel)
```bash
npx expo start --tunnel
```
- Abre Expo Go en tu dispositivo y escanea el QR de la terminal.
- Alternativas: `npm run android`, `npm run ios` (iOS requiere macOS), `npm run web` (la cámara en web puede tener limitaciones).

## Estructura del proyecto
```
QR-Barcode-Scanner/
├─ app/
│  ├─ _layout.js        # Stack de navegación (expo-router)
│  └─ index.js          # Pantalla principal con CameraView
├─ assets/              # Iconos/splash por defecto
├─ index.js             # Entrada para expo-router
├─ app.json             # Configuración Expo (incluye plugin expo-router)
└─ package.json         # Scripts y dependencias
```

## Tecnologías
- Expo SDK (React Native)
- `expo-camera` (CameraView y escaneo de códigos)
- `expo-router` (navegación)
- `expo-clipboard` (portapapeles)

## Permisos
- Cámara: se solicita al abrir la app. Si fue denegado, desde Android: Ajustes > Apps > Expo Go > Permisos > Cámara.

## Troubleshooting
- PlatformConstants / TurboModule error: asegúrate de tener Expo Go actualizado y limpia caché.
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear --tunnel
```
- La cámara no abre en web: soporte de cámara en navegador puede variar. Prueba en dispositivo físico con Expo Go.
- Escaneos repetidos: la UI desactiva el escaneo tras leer un código. Usa "Volver a escanear" para reactivar.

## Build (opcional)
- Android/iOS nativo con EAS: consulta `eas build` y documentación de Expo.

## Licencia
MIT. Si usas o mejoras este proyecto, ¡se aceptan PRs! 