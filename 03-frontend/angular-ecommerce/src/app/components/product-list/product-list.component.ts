import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../common/product";
import {ActivatedRoute} from "@angular/router";
import {ProductCategory} from "../common/product-category";
import {CartItem} from "../common/cart-item";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  pagingList = [5, 10, 20, 50];
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  // @ts-ignore
  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    console.log(this.thePageNumber)
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {
    // @ts-ignore
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different leyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed


    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize,this.currentCategoryId).subscribe(this.processResult())

    // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(data => {
    //   this.products = data;
    // })
  }

  processResult() {

    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: any) {
    this.thePageSize = this.pagingList[pageSize.options.selectedIndex];
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(theProduct)

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);

  }

}
