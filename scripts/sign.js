const os = require('os')
const { execSync } = require('child_process')
const path = require('path')

// Determina el sistema operativo
const platform = os.platform()
let binaryPath

// Asigna la ruta del binario según el sistema operativo
switch (platform) {
	case 'win32':
		binaryPath = 'src-tauri/target/release/bundle/msi/Reconecta.msi'
		break
	case 'linux':
		binaryPath = 'src-tauri/target/release/bundle/appimage/Reconecta.AppImage'
		break
	case 'darwin':
		binaryPath = 'src-tauri/target/release/bundle/dmg/Reconecta.dmg'
		break
	default:
		throw new Error('Unsupported platform: ' + platform)
}

// Ruta de la clave privada
const privateKeyPath = 'src-tauri/keys/keyPrivate.pem'

// Firma del binario
try {
	execSync(`npx tauri signer sign --private-key ${privateKeyPath} ${binaryPath}`)
	console.log('Binary signed successfully.')
} catch (error) {
	console.error('Error signing binary:', error.message)
	process.exit(1)
}
