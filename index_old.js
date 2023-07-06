const express = require('express');
const path = require('path');

var http = require('http');
var fs = require('fs');


const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/static', express.static(path.join(__dirname, 'public')))

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

///Express Module
app.get('/', (req, res) => {
  app.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/decoder.js', (req, res) => {
  app.sendFile(path.join(__dirname + '/decoder.js'));
});

app.post('/barcodeScanned', (req, res) => {
  // if ((req.body != null) || (req.body |= '')) {
  //   let body = JSON.parse(req.body);
  // }
  let obj = req.body;
  console.log(obj);
  findUser(obj.barcode);
  res.status(200).type('html').send('OK');

  // req.on('end', function () {
  //   // let obj = JSON.parse(body);
  //   console.log(req);
  //   findUser();
  //   //res.writeHead(200, { 'Content-Type': 'text/html' });
  //   res.write(JSON.stringify({status: 'OK'}));
  //   //res.write('OK');
  //   res.end();
  // });
});

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
