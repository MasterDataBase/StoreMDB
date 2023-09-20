import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetInList, AssetsStore } from '../AssetsStore';
import { HeroService } from '../hero.service';
import { compileFunction } from 'vm';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {

  constructor(
    private router: Router,
    private heroService: HeroService
  ) { }

  assetsList: AssetInList[] = [];

  ngOnInit(): void {
    let assetToShow = this.heroService.GetListAsset();
    for (let i = 0; i < assetToShow.length; i++) {
      const element = assetToShow[i];
      this.assetsList.push({ asset: element, index: i + 1, kit: "", note: "" });
    }
  }

  NewScan() {
    this.router.navigate(['/barcode-scanner']);
  }

  PrintPDF() {
    // let testBody ={
    // body: [
    //   ['Column 1', 'Column 2', 'Column 3'],
    //   ['One value goes here', 'Another one here', 'OK?']
    // ];
    // }



    // this.assetsList.forEach(elm =>
    //   bodyF.push({[elm.index, elm.asset.SN]})
    // )

    var dd = {
      content: [
        {
          columns: [
            {
              image: "testimage",
              width: 250,
              height: 150
            },
            { 
              text: 'ATLANTIS FILM & VIDEO S.R.L. \n\nVia Bordighera 15, 20143 Milano – Italia \n\nTel: +39 02 32001 – Email: info@atlantisfilm.it \n\nSito web: www.atlantisfilm.it \n\nP.IVA e C.F. IT12045820151',
              alignment: 'right'
            }
          ]
        },
        { text: "\n\n\n" },
        {
          columns: 
          [
            { 
              text: "Numero DDT: \nPeriodo di impegno: \nEvento: \nIndirizzo: \nCausale: ", 
              bold: true,
              alignment: "left"
            },
            { 
              text: "211/2023 \nDal 30/08 al 03/09 \nArmani Venezia (4FF) \nVenezia, Arsenale \nNoleggio ",
              alignment: "justify"
            }
          ]          
        },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }]},
        {
          columns:
          [
            {
              text: "\nMezzo di trasporto: \nAutista: \nPeriodo di impegno mezzo: \nNote Producer: ",
              bold: true,
              alignment: "left"
            },
            {
              text: "\nCrafter \nGiovanni Lentini, Daniele Bertinelli \nDal 31/08 al 03/09 \nStefano Brina",
              alignment: "justify"
            }
          ]
        },
        { text: "\n\n" },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3 }]},
        {
          layout: 'lightHorizontalLines', // optional
          style: 'tableExample',
          table: {
            headerRows: 1,
            // body: this.CreateBody(this.assetsList, ["index", "asset.SN"])
            widths: ['*', '*', '*', '*', '*'],
            body:
              // [{text:'Col 1', fillColor: 'red'}, {text:'Col 2'}]
              this.CreateBody(this.assetsList, ["index", "asset.name", "asset.SN", "kit", "note"])
          }
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
      },
      defaultStyle: {},
      images: {
        testimage: "http://localhost:8080/images/Bullet.jpg"
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.open();
  }

  CreateBody(rows: AssetInList[], columns: string[]) {
    let bodyF = [];
    let data: any[] = [];
    let head: any[] = [];

    // bodyF.push({ text: 'Header 1' }, { text: 'Header 2' });

    // // bodyF.push(head);

    ///For debug propouse
    // for (let index = 0; index < 1; index++) {
    //   bodyF.push([index, 'SN-${i}']);
    // }

    bodyF.push([
      { text: "Index", style: "tableHeader" },
      { text: "Prodotto/Descrizione", style: "tableHeader" },
      { text: "B/C", style: "tableHeader" },
      { text: "Kit", style: "tableHeader" },
      { text: "Note", style: "tableHeader" }
    ]);

    rows.forEach((row) => {
      var dataRow: { text: any; }[] = [];
      columns.forEach((column) => {
        var val = this.KeyFind(row, column);
        dataRow.push({ text: val });
      });
      bodyF.push(dataRow);
    });

    return bodyF;
  }

  ///Method necessario per trovare il field S in un oggetto O
  KeyFind(o: any, s: any): any {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }

}
