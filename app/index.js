import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';

export default function ScannerScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [cameraFacing, setCameraFacing] = useState('back');
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [isScanningEnabled, setIsScanningEnabled] = useState(true);
	const [scannedText, setScannedText] = useState('');

	const cameraRef = useRef(null);

	const handleBarcodeScanned = useCallback(({ data }) => {
		if (!isScanningEnabled) return;
		setIsScanningEnabled(false);
		setScannedText(String(data ?? ''));
	}, [isScanningEnabled]);

	const handleToggleTorch = useCallback(() => {
		setIsTorchOn((prev) => !prev);
	}, []);

	const handleToggleCamera = useCallback(() => {
		setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));
	}, []);

	const handleCopy = useCallback(async () => {
		if (!scannedText) return;
		await Clipboard.setStringAsync(scannedText);
	}, [scannedText]);

	const isUrl = useMemo(() => {
		try {
			const url = new URL(scannedText);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	}, [scannedText]);

	const handleOpenLink = useCallback(async () => {
		if (!isUrl || !scannedText) return;
		const supported = await Linking.canOpenURL(scannedText);
		if (supported) Linking.openURL(scannedText);
	}, [isUrl, scannedText]);

	if (!permission) {
		return (
			<View style={styles.centered}>
				<Text style={styles.infoText}>Preparando permisos…</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<SafeAreaView style={styles.centered}>
				<Text style={styles.title}>Permiso de cámara denegado</Text>
				<TouchableOpacity onPress={requestPermission} style={styles.actionPrimary}>
					<Text style={styles.actionPrimaryText}>Conceder permiso</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.cameraContainer}>
				<CameraView
					style={styles.camera}
					facing={cameraFacing}
					enableTorch={isTorchOn}
					onBarcodeScanned={isScanningEnabled ? handleBarcodeScanned : undefined}
					barcodeScannerSettings={{
						barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'pdf417', 'upc_a', 'upc_e', 'itf14']
					}}
					ref={cameraRef}
				/>
				<View style={styles.overlay} pointerEvents="none">
					<View style={styles.mask} />
					<View style={styles.centerRow}>
						<View style={styles.mask} />
						<View style={styles.scannerFrame} />
						<View style={styles.mask} />
					</View>
					<View style={styles.mask} />
				</View>

				<View style={styles.topControls}>
					<TouchableOpacity onPress={handleToggleTorch} style={styles.controlButton}>
						<Text style={styles.controlText}>{isTorchOn ? 'Flash On' : 'Flash'}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleToggleCamera} style={styles.controlButton}>
						<Text style={styles.controlText}>{cameraFacing === 'back' ? 'Trasera' : 'Frontal'}</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.bottomSheet}>
				{scannedText ? (
					<>
						<Text numberOfLines={3} style={styles.scannedText}>{scannedText}</Text>
						<View style={styles.actionsRow}>
							<TouchableOpacity style={styles.action} onPress={() => setIsScanningEnabled(true)}>
								<Text style={styles.actionText}>Volver a escanear</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.action} onPress={handleCopy}>
								<Text style={styles.actionText}>Copiar</Text>
							</TouchableOpacity>
							{isUrl && (
								<TouchableOpacity style={styles.actionPrimary} onPress={handleOpenLink}>
									<Text style={styles.actionPrimaryText}>Abrir enlace</Text>
								</TouchableOpacity>
							)}
						</View>
					</>
				) : (
					<Text style={styles.hint}>Apunta al QR o código de barras dentro del marco</Text>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000' },
	centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
	title: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
	infoText: { color: '#ccc', fontSize: 16 },
	cameraContainer: { flex: 1 },
	camera: { flex: 1 },
	overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
	mask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
	centerRow: { flexDirection: 'row', alignItems: 'center' },
	scannerFrame: { width: 260, height: 260, borderWidth: 2, borderColor: '#00E0A1', borderRadius: 12 },
	topControls: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', gap: 12 },
	controlButton: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
	controlText: { color: '#fff', fontSize: 14 },
	bottomSheet: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#0B0B0B' },
	hint: { color: '#9e9e9e', textAlign: 'center' },
	scannedText: { color: '#fff', fontSize: 16, marginBottom: 8 },
	actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
	action: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#1E1E1E', borderRadius: 8 },
	actionText: { color: '#fff', fontWeight: '600' },
	actionPrimary: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#00E0A1', borderRadius: 8 },
	actionPrimaryText: { color: '#000', fontWeight: '700' }
}); 