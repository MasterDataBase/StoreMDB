import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import Quagga from '@ericblade/quagga2';
import { getMainBarcodeScanningCamera } from '../camera-access';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { AssetsStore, BarcodeScannedID } from '../AssetsStore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements AfterViewInit {
  constructor(
    private scannerContainer: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private heroService: HeroService,
    private router: Router
  ) { }

  assetOnDB: AssetsStore = { id: '0', SN: '0', category: '', name: '', status: '' };
  isEnabledCamera: boolean = true;
  errorMessage: string | undefined;
  started: boolean | undefined;
  barcode: BarcodeScannedID = { id: '' };
  resultScanned: AssetsStore | undefined;
  awaitData = false;

  ngOnInit() {
    this.isEnabledCamera = true;
  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }
    this.initializeScanner();
  }

  private initializeScanner(): Promise<void> {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported. Please use Chrome on Android or Safari on iOS';
      this.started = false;
      return Promise.reject(this.errorMessage);
    }

    // enumerate devices and do some heuristics to find a suitable first camera
    return Quagga.CameraAccess.enumerateVideoDevices()
      .then(mediaDeviceInfos => {
        const mainCamera = getMainBarcodeScanningCamera(mediaDeviceInfos);
        if (mainCamera) {
          console.log(`Using ${mainCamera.label} (${mainCamera.deviceId}) as initial camera`);
          return this.initializeScannerWithDevice(mainCamera.deviceId);
        } else {
          console.error(`Unable to determine suitable camera, will fall back to default handling`);
          return this.initializeScannerWithDevice(undefined);
        }
      })
      .catch(error => {
        this.errorMessage = `Failed to enumerate devices: ${error}`;
        this.started = false;
      });
  }

  private initializeScannerWithDevice(preferredDeviceId: string | undefined): Promise<void> {
    console.log(`Initializing Quagga scanner...`);

    const constraints: MediaTrackConstraints = {};
    if (preferredDeviceId) {
      // if we have a specific device, we select that
      constraints.deviceId = preferredDeviceId;
    } else {
      // otherwise we tell the browser we want a camera facing backwards (note that browser does not always care about this)
      constraints.facingMode = 'environment';
    }

    return Quagga.init({
      inputStream: {
        type: 'LiveStream',
        constraints,
        area: { // defines rectangle of the detection/localization area
          top: '25%',    // top offset
          right: '10%',  // right offset
          left: '10%',   // left offset
          bottom: '25%'  // bottom offset
        },
        target: document.querySelector('#scanner-container') ?? undefined
      },
      decoder: {
        readers: ['ean_reader'],
        multiple: false
      },
      // See: https://github.com/ericblade/quagga2/blob/master/README.md#locate
      locate: false
    },
      (err) => {
        if (err) {
          console.error(`Quagga initialization failed: ${err}`);
          this.errorMessage = `Initialization error: ${err}`;
          this.started = false;
        } else {
          console.log(`Quagga initialization succeeded`);
          Quagga.start();
          this.started = true;
          this.changeDetectorRef.detectChanges();
          Quagga.onDetected((res) => {
            if (res.codeResult.code) {
              Quagga.stop();
              Quagga.offDetected();
              this.started = false;
              this.awaitData = true;
              this.isEnabledCamera = false;
              this.onBarcodeScanned(res.codeResult.code);
            }
          });
        }
      });
  }

  onBarcodeScanned(result: string) {
    console.log("Scanned: ", result);
    // Quagga.stop();
    this.barcode.id = result;
    this.heroService.SearchBarcodeScanned(this.barcode).subscribe(
      // resp => this.assetOnDB = resp
      (resp) =>{
        this.awaitData = false;
        if(resp.id != '0'){
          this.assetOnDB = resp;
        }else{
          this.assetOnDB = { id: '0', SN: this.barcode.id, category: '', name: '', status: '' };
        }
      }
    );
    
  }

  NewScan(){
    this.isEnabledCamera = true;
    this.initializeScanner();
  }

  CreateNewAsset(){
    const data = this.barcode.id;
    this.router.navigate(['/asset-detail']);
    this.heroService.setProduct(data);
  }
}
