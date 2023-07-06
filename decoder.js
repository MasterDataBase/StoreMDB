console.log("Decoder");

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
    //console.log('Barcode data:', result.codeResult);
    highlightBarcode(result);
    Quagga.stop();
    });

///          Quagga.onProcessed(function (result) {
///            highlightBarcode(result);
///          });

    // Function to highlight the detected barcode
    function highlightBarcode(result) {
        var canvas = document.getElementById('canvas');
        var overlay = document.getElementById('overlay');
        var context = canvas.getContext('2d');


    // Clear the overlay
    overlay.innerHTML = '';

    // Get the barcode location coordinates
    var box = result.box;

    console.log(context);

    // Draw the rectangular overlay
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(box[0].x, box[0].y);
    context.lineTo(box[1].x, box[1].y);
    context.lineTo(box[2].x, box[2].y);
    context.lineTo(box[3].x, box[3].y);
    context.closePath();
    context.lineWidth = 10;
    context.strokeStyle = 'red';
    context.stroke();

    // Add the overlay to the DOM
    overlay.appendChild(canvas);
    }
    
})
.catch(function (err) {
    console.error('Error accessing media devices:', err);
});