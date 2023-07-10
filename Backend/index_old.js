const express = require('express');
const path = require('path');

var http = require('http');
var fs = require('fs');


const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));



///Connect to mongoDB vai prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findUser(barcode) {
  let obj; 
  try {
    obj = await prisma.storeMDB.findFirst({where: {SN:barcode}});
    console.debug(obj);    
  } catch (error) {
    console.error(error);
    obj = "empty";
  } finally {    
    await prisma.$disconnect();
    return obj
  }
}

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
  // let result = await findUser(obj.barcode);
  // console.log(result);
  // if(result != "empty"){
  //   return res.render('resultBarcode',  { data: result });
  // }
  // res.status(200).type('html').send('OK');
  findUser(obj.barcode)
  .then(result => {
    console.debug(result);
    if (result != null) {
      return res.render('resultBarcode', { data: result });
    }else{
      res.status(201).type('html').send('user not found');
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Error finding user' });
  });
});

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
