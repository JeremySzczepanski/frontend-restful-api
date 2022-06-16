import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Item } from '../models/item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items!: Item[];
  resume!: {quantity: number, costHT: number, costTaxe: number, costTTC: number};
  cart: Cart = new Cart();
  tva = environment.tva/100;
  cart$ = new Subject<Cart>();



  constructor() {
    this.initCart();
   }

  //Check du localStorage afin de ne pas perdre le panier lors de l'actualisation du navigateur
  initCart(){
    if(typeof(localStorage) !== 'undefined'){
      const cart = JSON.parse(localStorage.getItem('cart')!);
      this.cart = cart ? cart: new Cart();
    }else{
      this.cart = new Cart();
    }
  }

  emitCart(){
    this.cart$.next(this.cart);
  }

  addToCart(product: Product){
    //On parcours chaque element du panier, on regarde est ce que
		//l'identifiant d'un produit qu'il contient est le même que celui que l'on a reçu en paramètre.
		//si c'est le cas on le récupère dans la "const item"
		//le "find" va nous retourner le premier element, si pas d'element va nous retourner "undefined"

		const item = this.cart.items.find(item => item.product._id === product._id);

		//On regarde maintenant si on a l'item

		if(item){
			item.quantity++;	//on prend l'item et on incrémente sa quantity de 1
		}else{
						//dans le cas où on ne retrouve aucun produit
			const item = new Item();
			item.product = product;
			item.quantity = 1;
			this.cart.items.push(item);	//On ajoute cet item là à notre panier
		}

		//On met à jour le resume du panier ( quantity costHT costTaxe costTTC )

		this.updateCart();


	}

	//Cette méthode permet de mettre à jour le resume
	updateCart(){
		//comme on incrémente l'idéal serait d'initialiser:
		this.cart.resume = {quantity: 0, costHT: 0, costTaxe: 0, costTTC: 0};



              //******Original****** */

	// 	//Puis on parcourt la boucle:
	// 	this.cart.items.forEach(item => {
	// 		this.cart.resume.quantity += item.quantity;
	// 		this.cart.resume.costHT += item.quantity*item.product.price;
	// 		this.cart.resume.costTaxe += this.cart.resume.costHT*this.tva;			//On peut mettre la TVA directement dans la partie environment.
	// 		//this.cart.resume.costTTC += this.cart.resume.costHT + this.cart.resume.costHT*this.tva;		//On peut factoriser:
	// 		this.cart.resume.costTTC += this.cart.resume.costHT*(1 + this.tva);item.quantity*item.product.price;
	// 	})
  //   this.emitCart();
	// }

              //******Changement du TTC****** */

  		//Puis on parcourt la boucle:
      this.cart.items.forEach(item => {
        this.cart.resume.quantity += item.quantity;
        this.cart.resume.costTTC += item.quantity*item.product.price;
        this.cart.resume.costTaxe += this.cart.resume.costTTC*this.tva;			//On peut mettre la TVA directement dans la partie environment.
        //this.cart.resume.costTTC += this.cart.resume.costHT + this.cart.resume.costHT*this.tva;		//On peut factoriser:
        this.cart.resume.costHT += this.cart.resume.costTTC/(1 + this.tva);item.quantity*item.product.price;
      })
      this.emitCart();

      //stockage des données (cart) dans le localStorage
      if(typeof(localStorage) !== "undefined"){
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }

    }


  removeOne(product: Product){
    //premièrement il faut qu'on cherche l'élément dans le panier
    const item = this.cart.items.find(item => item.product._id === product._id);
    //On recherche l'element, si on a l'element c'est qu'il existe dans le panier:
    if(item){
    //est ce que l'élément existe une fois ou plusieurs fois (si une fois on retire l'item, si plusieurs fois on décrémente de 1)
      if(item.quantity > 1){
        item.quantity--;	//on décrémente
      }else{
              //Si item = 1, on supprime l'element avec splice en récupérant l'indice
        const index = this.cart.items.indexOf(item);
              //On supprime 1 element à partir de l'index
        this.cart.items.splice(index,1);
      }

    //Quand on sort du if, on met à jour le panier (l'ideal est de le mettre dans le if, comme ça on sait qu'on a fait des modifications)
    this.updateCart();

    }
  }


  removeMany(product: Product){
    //premièrement il faut qu'on cherche l'élément dans le panier
    const item = this.cart.items.find(item => item.product._id === product._id);
    //Si on retrouve l'élement, on va simplement supprimer l'indice de l'élément
    if(item){
      const index = this.cart.items.indexOf(item);
      //Maintenant qu'on a l'index, on va supprimer ça
      this.cart.items.splice(index,1);
      this.updateCart();
    }

  }




}


