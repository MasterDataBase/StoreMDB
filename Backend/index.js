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



///Express Module
app.get('/', (req, res) => {
  //app.sendFile(path.join(__dirname + '/index.html'));
  var indexPath = path.resolve(path.join(__dirname + '/index.html'));
  console.log(indexPath);
  app.sendFile(indexPath);
});

app.get('/decoder.js', (req, res) => {
  app.sendFile(path.join(__dirname + '/decoder.js'));
});

app.post('/barcodeScanned', (req, res) => {
  let obj = req.body;
  console.log(obj);
  findUser(obj.barcode)
  .then(result => {
    console.log(result);
    res.status(200).type('json').send(result);
  })
  .catch(error => {
    console.error('Error: ', error );
    res.status(500).send('Internal server error');
  });
});

async function findUser(barcode) {
  try {
    let obj; 
    obj = await prisma.storeMDB.findFirst({where: {SN:barcode}});
    return obj;
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
