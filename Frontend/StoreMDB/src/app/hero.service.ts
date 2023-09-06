import { Injectable } from '@angular/core';

import { Observable, map, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssetsStore, BarcodeScannedID } from './AssetsStore';

import { BehaviorSubject } from 'rxjs';
import { AssertionError } from 'assert';

@Injectable({ providedIn: 'root' })
export class HeroService {

  // private listAsset: AssetsStore[] = [{id:"",SN:"",name:"",category:"",status:""}];

  ///Share data as service
  //#region sharing
  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();

  setProduct(product: any) {
    this.product$.next(product);
  }
  //#endregion

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private heroesUrl = 'https://ef961dce-b5cf-4d0a-8812-7ed819e35eeb.mock.pstmn.io';  // URL to web api
  private localproduction = 'http://localhost:8080';  // URL to web api

  private stringTest = '{ "bardcode": "9788885457263" }';

  TestConnection(): Observable<AssetsStore> {
    // return this.http.get<AssetsStore>(this.localproduction + '\\barcodeScanned');
    return this.http.post<AssetsStore>(this.localproduction + '\\barcodeScanned', JSON.stringify(this.stringTest));
  }

  SearchBarcodeScanned(barcode: any): Observable<AssetsStore> {
    return this.http.post<AssetsStore>(this.localproduction + '\\barcodeScanned', barcode);
  }

  CreateNewAssetHTTP(assetStore: any): Observable<AssetsStore> {
    return this.http.post<AssetsStore>(this.localproduction + '\\createNewAsset', assetStore);
  }

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  private listAsset: AssetsStore[] = [];

  SetData(data: AssetsStore[]): void {
    this.listAsset = data;
  }

  GetListAsset(): AssetsStore[] {
    return this.listAsset;
  }

  AddAssetToList(data: AssetsStore) {
    this.listAsset.push(data);
  }
}