const express = require('express');
const path = require('path');

var http = require('http');
var fs = require('fs');


const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/static', express.static(path.join(__dirname, 'public')))

const cors = require('cors');
app.use(cors());

///Connect to mongoDB vai prisma
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');

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
  console.log("req:", obj.id);
  if (typeof obj.id != "string") {
    console.error('Barcode not clear');
    return;
  }
  findUser(obj.id)
    .then(result => {
      console.log(result);
      if (result != null) {
        res.status(200).type('json').send(result).end();
      } else {
        res.status(201).type('html').send('Barcode not present in the DB').end();
        console.error("Item not preset in the database");
      }
    })
    .catch(error => {
      console.error('Error: ', error);
      res.status(500).send('Internal server error');
    });
});

async function findUser(barcode) {
  ///Oggetto per definire elemento di default
  const defaultValue = { id: '0', SN: 0, category: '', name: '', status: '' };
  console.log("Inside the query:", barcode);

  ///Query per trovare l'elemento sulla base dell'SN
  try {
    let obj;
    obj = await prisma.storeMDB.findFirst({
      where: {
        SN: barcode
      }
    })
    ///Ritorna l'oggetto trovato oppure il valore di default
    return obj || defaultValue;
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

///Create new asset
app.post('/createNewAsset', (req, res) => {
  let obj = req.body;
  console.log("req:", obj);
  if (obj.id == '0' || obj.id == null) {
    createNewAsset(obj).then(
      res.status(200).type('json').send(obj).end()
    )
  } else {
    console.log('ID should have value 0');
    res.status(500).type('html').send('ID should have value 0').end();
    return;    
  }
});

async function createNewAsset(newAsset){
  try {
    let obj;
    obj = await prisma.storeMDB.create({
      data: {
        SN: newAsset.SN,
        category: newAsset.category,
        name: newAsset.name,
        status: newAsset.status,
      }
    });
  }catch (error){
    console.log(error);
  }finally{
    await prisma.$disconnect();
  }
}

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});