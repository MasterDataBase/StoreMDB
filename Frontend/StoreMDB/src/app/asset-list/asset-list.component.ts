import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetInList, AssetsStore } from '../AssetsStore';
import { HeroService } from '../hero.service';

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
      this.assetsList.push({asset:element, index: i+1, kit:"", note:""});
    }
  }

  NewScan() {
    this.router.navigate(['/barcode-scanner']);
  }


}
