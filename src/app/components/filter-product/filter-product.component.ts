import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./filter-product.component.css']
})
export class FilterProductComponent {
  @Output() filterEvent = new EventEmitter<{ category: string, priceRange: string }>();
  categories: string[] = [];
  priceRangeValues: { [key: string]: { min: number, max: number } } = {};
  selectedCategory = 'All';
  selectedPriceRange = 'All';

  constructor() { }

  ngOnInit(): void {
    this.categories = ['All', 'Electronics', 'Mobile', 'Watch', 'Clothing', 'Books'];
    this.priceRangeValues = {
      'All': { min: 0, max: 1000 },
      'Low Cost': { min: 0, max: 10 },
      'Moderate': { min: 10, max: 100 },
      'Expensive': { min: 100, max: 1000 }
    };
  }

  applyFilter() {
    this.filterEvent.emit({ category: this.selectedCategory, priceRange: this.selectedPriceRange });
  }
}
