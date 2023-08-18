///Lista necessaria per identificiare se la stringa riportata è "posteriore" o meno
const environmentFacingCameraLabelStrings: string[] = [
    'rear',
    'back',
    'rück',
    'arrière',
    'trasera',
    'trás',
    'traseira',
    'posteriore',
    '后面',
    '後面',
    '背面',
    '后置', // alternative
    '後置', // alternative
    '背置', // alternative
    'задней',
    'الخلفية',
    '후',
    'arka',
    'achterzijde',
    'หลัง',
    'baksidan',
    'bagside',
    'sau',
    'bak',
    'tylny',
    'takakamera',
    'belakang',
    'אחורית',
    'πίσω',
    'spate',
    'hátsó',
    'zadní',
    'darrere',
    'zadná',
    'задня',
    'stražnja',
    'belakang',
    'बैक'
];

///Funzione che prende il nome della camera e controlla se questa è una camera posteriore o meno.
export function isKnownBackCameraLabel(label: string): boolean {
    const labelLowerCase = label.toLowerCase();
    return environmentFacingCameraLabelStrings.some(str => {
        return labelLowerCase.includes(str);
    });
}

///Funzione che controlla tutte le camere collegate, se una è posteriore o meno
export function getMainBarcodeScanningCamera(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
    console.log("List cameras:", devices);
    const backCameras = devices.filter(v => isKnownBackCameraLabel(v.label));
    const sortedBackCameras = backCameras.sort((a, b) => a.label.localeCompare(b.label));
    return sortedBackCameras.length > 0 ? sortedBackCameras[0] : undefined;
}