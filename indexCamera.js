const express = require('express');

//const app = express();

var http = require('http');
var fs = require('fs');

//app.use(express.json());

///Create server
var FServer = function (req, res){
  if (req.url == '/') {
      fs.readFile('indexQuagga.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
  }else if(req.url == '/decoder.js'){
      fs.readFile('decoder.js', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });
  }else if(req.url == '/barcodeScanned'){
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      let obj = JSON.parse(body);
      console.log(obj);
      findUser();
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('OK');
      res.end();
    });
  }
};

http.createServer(FServer).listen(8080);

///Connect to mongoDB vai prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findUser(barcode) {
  try {
    const obj = await prisma.storeMDB.findFirst({where: {SN:barcode}});
    console.log(obj);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}


