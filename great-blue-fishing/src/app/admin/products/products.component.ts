import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from '../create-blog/mime-type.validator';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private productId: string;
  private mode = 'create';
  enteredName = '';
  enteredDescription = '';
  enteredPrice = null;

  products: Product[] = [];
  private productsSub: Subscription;

  constructor(public productsService: ProductsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'productName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      'productDescription': new FormControl(null, {validators: [Validators.required]}),
      //#TODO: regex pattern for price to be x.xx
      'price': new FormControl(null, {validators: [Validators.required]})
    });

    this.mode = 'create';
    this.productId = null;

    this.getProducts();
  }

  onSaveProduct(formDirective: FormGroupDirective){
    if (this.form.invalid){
      return
    }

    this.isLoading = true;
    if (this.mode === 'create'){
      this.productsService.addProduct(this.form.value.productName, this.form.value.productDescription, this.form.value.image, this.form.value.price);
      if (this.productsService.addProduct){
        this.isLoading = false;
        alert('Product saved successfully');
      }
    }
    
    this.getProducts();
    formDirective.resetForm();
    this.form.reset();
  }

  onImagePicked(event: Event){
    //access file passed in
    const file = (event.target as HTMLInputElement).files[0];
    //target single control on form
    this.form.patchValue({image: file});
    //get access to image and update value and validate it
    this.form.get('image').updateValueAndValidity();
    //convert image to data url
    const reader = new FileReader();
    //executes when done loading
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
 }

  onDelete(){

  }

  getProducts(){
    //for product list
    this.productsService.getProducts();
    //blog posts subscription
    this.productsSub = this.productsService.getProductUpdateListener().subscribe((productData: { products: Product[] }) => {
      this.isLoading = false;
      this.products = productData.products;
    });
  }

}
