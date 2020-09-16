import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from './product.model';

const BACKEND_URL = environment.apiUrl + '/products/'

@Injectable({providedIn: 'root'})
export class ProductsService{

  private products: Product[] = [];
  private productsUpdated = new Subject<{ products: Product[]}>();

  constructor(private http: HttpClient, private router: Router){}

  addProduct(name: string, description: string, image: File, price: number){
    const productData = new FormData();
    //append the passed in information
    productData.append('name', name);
    productData.append('description', description);
    //title is passed in as well to name image
    productData.append('image', image, name);
    productData.append('price', price.toString());
    this.http.post<{message: string, product: Product}>(BACKEND_URL, productData)
      .subscribe( (responseData) => {
        return true;
      });
  }

  getProducts(){
    this.http.get<{message: string, products: any }>(BACKEND_URL)
      //to change id to _id
      .pipe(map((productData => {
        //replace every post with...
        return { products: productData.products.map(product => {
          return {
            name: product.name,
            description: product.description,
            id: product._id,
            imagePath: product.imagePath,
            price: product.price
          };
        })};
      })))
      //subscribe to observable with remapped posts
      .subscribe( (transformedproductData) => {
        this.products = transformedproductData.products;
        this.productsUpdated.next( { products: [...this.products] } );
      });
  }

  //get single product
  getSingleProduct(productId: string){
    return this.http.get<{ _id: string, name: string, description: string, imagePath: string, price: number }>(BACKEND_URL + productId);
  }

  getProductUpdateListener(){
    return this.productsUpdated.asObservable();
  }

  updateProduct(id: string, name: string, description: string, image: File | string, price: number){
    let productData: Product | FormData;
    if(typeof(image) === 'object') {
      //create new form data object
      productData = new FormData();
      productData.append('id', id);
      productData.append('name', name);
    productData.append('description', description);
    //title is passed in as well to name image
    productData.append('image', image, name);
    productData.append('price', price.toString());
    } else {
      //create new post data
      productData = {id: id, name: name, description: description, imagePath: image, price: price};
    }
    this.http.put(BACKEND_URL + id, productData)
    //subscribe to obervable
    .subscribe( response => {
      this.navigateToProductPage();
    });
    return true;
  }

  navigateToProductPage(){
    this.router.navigate(["/admin/products"]);
  }

}
