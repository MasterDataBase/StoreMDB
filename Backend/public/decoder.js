// Helper function to access the media devices
function getMediaDevices() {
return navigator.mediaDevices.getUserMedia({ video: true });
}

// Initialize QuaggaJS once the media devices are ready
getMediaDevices()
.then(function (stream) {
    // Display the video stream in the video element
    var videoElement = document.getElementById('video');
    videoElement.srcObject = stream;

    // Initialize QuaggaJS with the video element
    Quagga.init(
        {
            inputStream: {
                type: 'LiveStream',
                target: videoElement
            },
            decoder: {
                readers: ['ean_reader', 'code_128_reader'] // Specify the barcode reader type (e.g., EAN reader)
            },
            locator: {
                patchSize: 'large',
                halfSample: true
            },
            locate: true
        },
        function (err) {
            if (err) {
            console.error('Failed to initialize Quagga:', err);
            return;
            }
            console.log('Quagga initialized successfully');

            // Start barcode scanning
            Quagga.start();
        }
    );

    // Listen for barcode detection
    Quagga.onDetected(function (result) {
        console.log(result);
        // console.log('Barcode data:', result.codeResult);
        // highlightBarcode(result);
        // newHighlight(result);
        SendBarcodeToServer(result);
        Quagga.stop();
    });
    
})
.catch(function (err) {
    console.error('Error accessing media devices:', err);
});

function SendBarcodeToServer(result){
    fetch('/barcodeScanned',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bardcode: result.codeResult.code}),
    })
    .then(function(response){
        if(response.ok){
            console.log('Barcode inviato con successo');
        }else{
            console.error('Errore sull invio barcode');
        }
    })
    .catch(function(error){
        console.log('Error on method SendBarcodeToServer');
    });
}