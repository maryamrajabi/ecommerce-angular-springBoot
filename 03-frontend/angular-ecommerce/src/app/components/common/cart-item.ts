import {Product} from "./product";

export class CartItem {
  id: number;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imgUrl;
    this.unitPrice = product.unitPrice;

    this.quantity = 1
  }
}
