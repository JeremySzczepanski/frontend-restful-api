import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  api = environment.api;
  products: Product[] = [];
  products$ = new Subject<Product[]>();

  constructor(private http: HttpClient) { }

  emitProduct(){
    this.products$.next(this.products);
  }

  getProducts(){
    this.http.get(this.api+'/products').subscribe(
      (data: Data)=>{
        if(data['status'] === 200){
          this.products = data['result'];
          this.emitProduct();
        }else{
          console.log(data);
        }
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getProductById(id: string){					          //On va penser à ne récupérer qu'un élément. qui prend en argument un id
    return new Promise((resolve, reject)=>{			//comme on fait un appel vers le serveur l'idéal est de retourner une promesse
      this.http.get(this.api+'/Products/'+id).subscribe(
        (data: Data)=>{
          if(data['status'] === 200){
            resolve(data['result'])
          }else{
            reject(data['message'])
          }
        },
        (err)=>{				                         //si on a pas de données en retour on fait un reject de l'erreur
          reject(err);
        }
      )
    })

  }
}
