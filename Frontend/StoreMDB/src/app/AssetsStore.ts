export interface AssetsStore {
    id: string;
    SN: string;
    category: string;
    name: string;
    status: string
}

///Class necessaria per il form
export class AssetsStore{
    constructor(
        public id: string,
        public SN: string,
        public category: string,
        public name: string,
        public status: string
    ){}
}

export interface BarcodeScannedID {
    id: string;
}