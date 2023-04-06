import { Component } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent {
  products: Product[];
  searchTerm: string;
  currentPage = 1;
  productsPerPage = 3;
  constructor(private productService: ProductService) {
    this.products = [];
    this.searchTerm = "";
  }
  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  filterProducts(): Product[] {
    return this.products.filter(product => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

}
