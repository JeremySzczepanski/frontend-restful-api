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

  createNewProduct(product: Product, image: File){
    return new Promise((resolve, reject)=>{           //on retourne une promesse
                                                      //on envoie une requête au serveur et on lui demande de nous créer un produit
      let productData: FormData = new FormData();     //On met toutes les informations reçues dans un FormData qu'on initialise : new FormData
      productData.append('product', JSON.stringify(product))    //On lui ajoute ce qu'on a reçu en paramètre
      productData.append('image', image);                       //On ajoute aussi l'image, la clé sera 'image', la valeur ce qu'on a reçu en paramètre

      this.http.post(this.api+'/products', productData).subscribe(             //On execute la requête de création de produit
        (data: Data)=>{
          if(data['status'] === 201){
            this.getProducts();           //permet de nous assurer que nous aurons toutes les informations à jour.
            resolve(data);                //En faisant ceci , les données en local ne seront plus à jour (dans "Products$"), on doit donc les mettre à jour également en faisant this.getProducts();

          }else{
            reject(data['message']);
          }
        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

  updateProduct(id: string, product: Product, image: File | string){
    return new Promise((resolve, reject)=>{
      let productData: FormData = new FormData();

      if(typeof image === 'string'){			//si l'image est de type string, ça veut dire qu'on maintient l'image qu'on
                                          //avait sur le produit (url de l'image associé au produit)
        product.image = image;			      //On ne peut pas mettre directement une image dans le produit, donc on met l'url du produit
      }else{						                  //par contre, si image est un File, alors on envoie le fichier dans le formData qu'on a créé.
        productData.append('image', image);
      }
      productData.append('product', JSON.stringify(product));			//on ajoute maintenant dans le formData product avec la valeur product

      this.http.put(this.api+'/products/'+id, productData).subscribe(        //On execute la requête de mise à jour d'un produit +l'identifiant qu'on a reçu en paramètres
        (data: Data)=>{             //Si on reçoit bien les données (on est dans le update du backend si tout ok on a un status 200)
          if(data['status'] === 200){
            resolve(data);
          }else{
            reject(data);
          }
        },
        (err)=>{
          reject(err)
        }
      )

    })
  }

  deleteProduct(id: string){
    return new Promise((resolve, reject)=>{
      this.http.delete(this.api+'/products/'+id).subscribe(
        ()=>{   //On ne met pas data , car ça ne retourne pas de paramètre
          //Si tout se passe bien on reçoit un code status 204 et on a rien en retour (le code status 204 n'accepte rien en retour)
          this.getProducts(); //On récupére juste les produits
          resolve(true);
        },
        (err)=>{
          reject(err)
        }
      )
    })
  }



}
