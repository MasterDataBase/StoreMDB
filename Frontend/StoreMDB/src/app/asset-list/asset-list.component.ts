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
        { text: 'Bolla di carico del Faggiua!' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            // body: this.CreateBody(this.assetsList, ["index", "asset.SN"])
            widths: ['*','*', '*', '*', '*'],
            body:
              // [{text:'Col 1', fillColor: 'red'}, {text:'Col 2'}]
              this.CreateBody(this.assetsList, ["index", "asset.name", "asset.SN", "kit", "note"])
          }
        }
      ]
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

    bodyF.push([{text: "Index"}, {text: "Prodotto/Descrizione"}, {text:"B/C"}, {text:"Kit"}, {text:"Note"}]);

    rows.forEach((row) =>{
      var dataRow: { text: any; }[] = [];
      columns.forEach((column) =>{
        var val = this.KeyFind(row,column);
        dataRow.push({text: val});
      });
      bodyF.push(dataRow);
    });

    return bodyF;
  }

  ///Method necessario per trovare il field S in un oggetto O
  KeyFind(o: any , s: any): any {
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
