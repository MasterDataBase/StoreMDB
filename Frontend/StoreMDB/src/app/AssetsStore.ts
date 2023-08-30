export interface AssetsStore {
    id: string;
    SN: number
    category: string;
    name: string;
    status: string
}

///Class necessaria per il form
export class AssetsStore{
    constructor(
        public id: string,
        public SN: number,
        public category: string,
        public name: string,
        public status: string
    ){}
}

export interface BarcodeScannedID {
    id: string;
}