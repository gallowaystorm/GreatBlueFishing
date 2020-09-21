import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { ProductsService } from 'src/app/admin/products/products.service';
import { GlobalAuthService } from 'src/app/global-auth.service';
import { StoreService } from './store.service';

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
  form: FormGroup;
  isAuth = false;

  constructor(public productsService: ProductsService, public route: ActivatedRoute, public storeService: StoreService, private router: Router, private globalAuthService: GlobalAuthService) { }

  ngOnInit() {
    this.getProducts();
    this.form = new FormGroup({
      'quantity': new FormControl(1, {validators: [Validators.required, Validators.min(1)]}),
    });

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

  addToCart(productId: string, price: number, name: string, formDirective: FormGroupDirective){
    console.log(productId + " " + this.form.value.quantity);
    this.isAuth = this.globalAuthService.getIsAuth()
    if (this.isAuth){
      this.storeService.addToCart(productId, this.form.value.quantity, price, name);
      //to reset the form back to 1
      formDirective.resetForm();
      this.form = new FormGroup({
        'quantity': new FormControl(1, {validators: [Validators.required, Validators.min(1)]}),
      });
      return
    }
    alert("You need to be logged in first!");
  }

  goToShoppingCart(){
    this.router.navigate(['/shoppingcart']);
  }

  ngOnDestroy(){
    this.productsSub.unsubscribe();
  }
}
