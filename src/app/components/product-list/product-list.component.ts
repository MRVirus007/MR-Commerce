import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  searchTerm: string;
  currentPage = 1;
  productsPerPage = 10;
  totalPages: number = 0;
  constructor(private productService: ProductService) {
    this.products = [];
    this.searchTerm = "";
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
    });
  }

  applyFilter(filterData: { category: string, priceRange: string }, currentPage: number, productsPerPage: number) {
    const { category, priceRange } = filterData;
    if (category === 'All') {
      this.getAllProducts();
      this.products = this.products.filter(product => {
        const price = product.price;
        if (priceRange === 'All') {
          return true;
        } else if (priceRange === 'Low Cost') {
          return price <= 10;
        } else if (priceRange === 'Moderate') {
          return price > 10 && price <= 100;
        } else if (priceRange === 'Expensive') {
          return price > 100 && price <= 1000;
        } else {
          return false;
        }
      });
    } else {
      this.productService.getProductsByCategory(category)
        .subscribe((products: any[]) => {
          console.log(products);
          this.products = products.filter(product => {
            const price = product.price;
            if (priceRange === 'All') {
              return true;
            } else if (priceRange === 'Low Cost') {
              return price <= 10;
            } else if (priceRange === 'Moderate') {
              return price > 10 && price <= 100;
            } else if (priceRange === 'Expensive') {
              return price > 100 && price <= 1000;
            } else {
              return false;
            }
          });
        });
    }

  }


  filterProducts(): Product[] {
    return this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  // hasPreviousPage(): boolean {
  //   return this.currentPage > 1;
  // }

  // hasNextPage(): boolean {
  //   return this.currentPage < this.totalPages;
  // }

  // previousPage(): void {
  //   if (this.hasPreviousPage()) {
  //     this.currentPage--;
  //   }
  // }

  // nextPage(): void {
  //   if (this.hasNextPage()) {
  //     this.currentPage++;
  //   }
  // }

}
