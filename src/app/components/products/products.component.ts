import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[] = [];
  currentPage = 1;
  productsPerPage = 3;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts(this.currentPage, this.productsPerPage).subscribe(products => {
      this.products = products;
      console.log(products)
    });
  }
}
