import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
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

  constructor(public productsService: ProductsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'productName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      'productDescription': new FormControl(null, {validators: [Validators.required]}),
      //#TODO: regex pattern for price to be x.xx
      'price': new FormControl(null, {validators: [Validators.required]})
    });

    //for create vs edit mode
      //pulls the path that you are at to determine between /create and /edit/:postID
      this.route.paramMap
      //subscribes to observable
      .subscribe( (paramMap: ParamMap) => {
        //check if path exists
        if (paramMap.has('productId')) {
          this.mode = 'edit';
          //sets productId in the path equal to productId variable
          this.productId = paramMap.get('productId');
          //spinner on load
          this.isLoading = true;
          //call overloaded getPost function that finds post in database that matches id
          this.productsService.getSingleProduct(this.productId)
            //subscribe to observable
            .subscribe(productData => {
              //stop spinner
              this.isLoading = false;
              this.product = {id: productData._id, name: productData.name, description: productData.description, imagePath: productData.imagePath, price: productData.price};
              //overite default form value on init
              this.form.setValue({'productName': this.product.name, 'productDescription': this.product.description, 'image': this.product.imagePath, price: this.product.price});
            });
        } else {
          this.mode = 'create';
          this.productId = null;
        }
      });
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
    } else {
      var confirmUpdate = confirm("Are you sure you want to update this product?");
      if (confirmUpdate == true){
        var productUpdated = this.productsService.updateProduct(this.productId, this.form.value.productName, this.form.value.productDescription, this.form.value.image, this.form.value.price);
        this.isLoading = false;
        if (productUpdated == true) {
          alert("Product has been updated!");
          this.mode = "create";
        }
      } else {
        return;
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

  onDelete(productId: string){
    var confirmDelete = confirm("Are you sure you want to delete this product? This cannot be undone.");
    if (confirmDelete){
      this.isLoading = true;
      this.productsService.deleteProduct(productId).subscribe( () => {
        //to update product list on frontend on delete
        this.productsService.getProducts();
      }, () => {
        //this method helps handle erros
        this.isLoading = false;
      });
    } else {
      return;
    }
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

  ngOnDestroy(){
    this.productsSub.unsubscribe();
  }

}
