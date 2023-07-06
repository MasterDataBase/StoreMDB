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
var FServer = function (req, res){
if (req.url == '/') {
    fs.readFile('indexQuagga.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
    // fs.readFile('Decoder.js', function (err, data) {
    //   res.writeHead(200, {'Content-Type': 'script/javascript'});
    //   res.write(data);
    //   return res.end();
    // });
}else if(req.url == '/decoder.js'){
    fs.readFile('decoder.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
}
};

http.createServer(FServer).listen(8080);