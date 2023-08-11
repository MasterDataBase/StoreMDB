import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import Quagga from '@ericblade/quagga2';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent {
  constructor(
    private scannerContainer: ElementRef
  ) { }

  
  ngOnInit() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        // target: document.querySelector('#scannerContainer')    // Or '#yourElement' (optional)
        target: this.scannerContainer.nativeElement
      },
      decoder: {
        readers: ['ean_reader', 'code_128_reader']
      }
    },  (err) => {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
      Quagga.onDetected((res) => {
        console.log(res);
        if (res.codeResult.code) {
          this.onBarcodeScanned(res.codeResult.code);
        }
      });
    });
  }

  onBarcodeScanned(result: string) {
    console.log(result);
    // Quagga.stop();
  }
}
