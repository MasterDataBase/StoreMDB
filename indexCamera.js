const NodeWebcam = require('node-webcam');

var http = require('http');
var fs = require('fs');

// Create an instance of NodeWebcam
const Webcam = NodeWebcam.create({
  width: 1280,
  height: 720,
  output: 'jpeg',
  quality: 100,
  saveShots: false,
  callbackReturn: 'base64',
});

// Capture an image from the webcam
// Webcam.capture('test-image', (err, data) => {
//   if (err) {
//     console.error('Failed to capture image:', err);
//   } else {
//     console.log('Image captured successfully');
//     // Use the captured image data here
//     // console.log('Image data:', data);
//   }
// });

///Create server
http.createServer(function (req, res) {
  fs.readFile('indexQuagga.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);