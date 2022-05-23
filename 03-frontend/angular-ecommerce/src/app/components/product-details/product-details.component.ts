import { Component, OnInit } from '@angular/core';
import {Product} from "../common/product";
import {ProductService} from "../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {

    // get the "id" param string. convert string to a number using the "+" symbol
    // @ts-ignore
    const theProductId: number = +this.route.snapshot.paramMap.get("id");

    this.productService.getProduct(theProductId).subscribe(data => {
      this.product = data;
    })

  }
}
