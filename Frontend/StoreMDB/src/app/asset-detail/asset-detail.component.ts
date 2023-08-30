import { Component, Input, OnInit } from '@angular/core';

import { AssetsStore } from '../AssetsStore';

import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import Integer from '@zxing/library/esm/core/util/Integer';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  recivedBarcode: Number | undefined;

  currentAsset = new AssetsStore('0', 0, '', '', '');

  assetForm: FormGroup = new FormGroup({
    SN: new FormControl(),
    category: new FormControl(),
    name: new FormControl(),
    status: new FormControl(),
  });

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   this.recivedBarcode = Number(params.get('data'))
    //   console.log(this.recivedBarcode);
    // });

    this.assetForm = this.formBuilder.group({
      SN: ['', Validators.required],
      category: ['', Validators.required],
      name: ['', Validators.required],
      status: ['', Validators.required]
    });


    this.heroService.selectedProduct$.subscribe((value) => {
      this.recivedBarcode = value;
      console.log(this.recivedBarcode);
      this.currentAsset.SN = Number(this.recivedBarcode);
    });


  }



  // submitted = false;

  CreateNewAsset() {
    if (this.assetForm.valid) {
      this.currentAsset.SN = this.assetForm.value.SN;
      this.currentAsset.category = this.assetForm.value.category;
      this.currentAsset.name = this.assetForm.value.name;
      this.currentAsset.status = this.assetForm.value.status;
      console.log(this.currentAsset);

      this.heroService.CreateNewAssetHTTP(this.currentAsset).subscribe(
        (resp) => {
          console.log(resp);
        }
      )

    } else {
      console.error("Fullfil form please");
    }
  }
}
