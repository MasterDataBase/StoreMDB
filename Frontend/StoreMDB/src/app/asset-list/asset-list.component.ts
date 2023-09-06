import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetsStore } from '../AssetsStore';
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

    assetsList: AssetsStore[] = this.heroService.GetListAsset();

  ngOnInit(): void {
    // this.assetsList = this.heroService.GetListAsset();
  }

  NewScan() {
    this.router.navigate(['/barcode-scanner']);
  }


}
