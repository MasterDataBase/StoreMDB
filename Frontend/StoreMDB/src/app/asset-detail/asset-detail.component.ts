import { Component, Input, OnInit } from '@angular/core';

import { AssetsStore } from '../AssetsStore';

import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import Integer from '@zxing/library/esm/core/util/Integer';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  recivedBarcode: Number | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   this.recivedBarcode = Number(params.get('data'))
    //   console.log(this.recivedBarcode);
    // });


    this.heroService.selectedProduct$.subscribe((value) => {
      this.recivedBarcode = value;
      console.log(this.recivedBarcode);
    });
  }

  currentAsset = new AssetsStore('', 0, '', '', '');

  submitted = false;

  onSubmit() { this.submitted = true; }
}
