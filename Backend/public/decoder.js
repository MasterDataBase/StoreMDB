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
        console.log(result);
        console.log('Barcode data:', result.codeResult);
        // highlightBarcode(result);
        newHighlight(result);
        SendBarcodeToServer(result);
        Quagga.stop();
    });


    function newHighlight(result){
        const barcodeContainer = document.getElementById("overlay");

        result.boxes.forEach(box => {
            const rectangle = document.createElement("div");
            rectangle.className = "barcodeRectangle";
            
            const [topLeft, topRight, bottomRight, bottomLeft] = box;
            const x = topLeft[0];
            const y = topLeft[1];
            const width = topRight[0] - topLeft[0];
            const height = bottomLeft[1] - topLeft[1];
    
            rectangle.style.left = `${x}px`;
            rectangle.style.top = `${y}px`;
            rectangle.style.width = `${width}px`;
            rectangle.style.height = `${height}px`;
    
            barcodeContainer.appendChild(rectangle);
        });
    }
///          Quagga.onProcessed(function (result) {
///            highlightBarcode(result);
///          });

    // Function to highlight the detected barcode
    // function highlightBarcode(result) {
    //     var canvas = document.getElementById('canvas');
    //     var overlay = document.getElementById('overlay');
    //     var context = canvas.getContext('2d');


    //     // Clear the overlay
    //     overlay.innerHTML = '';

    //     // Get the barcode location coordinates
    //     var box = result.box;

    //     console.log(context);

    //     // Draw the rectangular overlay
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     context.beginPath();
    //     context.moveTo(box[0].x, box[0].y);
    //     context.lineTo(box[1].x, box[1].y);
    //     context.lineTo(box[2].x, box[2].y);
    //     context.lineTo(box[3].x, box[3].y);
    //     context.closePath();
    //     context.lineWidth = 10;
    //     context.strokeStyle = 'red';
    //     context.stroke();

    //     // Add the overlay to the DOM
    //     overlay.appendChild(canvas);
    // }
    
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