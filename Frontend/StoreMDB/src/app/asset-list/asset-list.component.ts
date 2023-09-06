import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetInList, AssetsStore } from '../AssetsStore';
import { HeroService } from '../hero.service';

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
    let testBody = {
      body: [
        ['Column 1', 'Column 2', 'Column 3'],
        ['One value goes here', 'Another one here', 'OK?']
      ]
    };

    let bodyF = [{}];
    //bodyF.push("Index", "SN","Name","Category","Status");

    this.assetsList.forEach(elm =>
      bodyF.push([elm.index, elm.asset.SN, elm.asset.name, elm.asset.category, elm.asset.status])
    )

    var dd = {
      content: [
        {
          table:
            testBody
        }
      ]
    };

    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.open();
  }
}
