import {Product} from "./product";

export class rowtype{
    produkt: Product;
    produktkennung: string;
    produktmengen: number[];

    constructor() {
        this.produktmengen = new Array<number>();
    }
}