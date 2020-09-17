import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { ProductsService } from 'src/app/admin/products/products.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, OnDestroy {

  public product: Product;
  isLoading = false;
  imagePreview: string;
  private productId: string;
  products: Product[] = [];
  private productsSub: Subscription;

  constructor(public productsService: ProductsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    //for product list
    this.productsService.getProducts();
    //product posts subscription
    this.productsSub = this.productsService.getProductUpdateListener().subscribe((productData: { products: Product[] }) => {
      this.isLoading = false;
      this.products = productData.products;
    });
  }

  addToCart(productId: string){
    console.log(productId + " is added to cart")
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
  }
}
