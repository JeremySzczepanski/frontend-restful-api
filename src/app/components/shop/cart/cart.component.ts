import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Item } from 'src/app/models/item';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'node-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  styles: ['getElementsByClassName("button") { background-color: green;}']
})
export class CartComponent implements OnInit {

  cart!: Cart;
  items!: Item[];
  resume!: {quantity: number, costHT: number, costTaxe: number, costTTC: number};
  tva = environment.tva/100;
  // color!: string;


  constructor(private cartService: CartService) { }         //on injecte cartService qui permet de manipuler le panier

  ngOnInit(): void {
    this.cartService.cart$.subscribe(
      (cart: Cart)=>{
        this.cart = cart;
        this.items = cart.items;
        this.resume = cart.resume;  //permet d'actualiser le total du Modal Resume
      }
      );
    this.cartService.emitCart();

    // this.cart = this.cartService.cart; 		                  //On récupère le cart qu'on a dans cartService
    // this.items = this.cartService.cart.items;
    // this.resume = this.cartService.cart.resume;
  }

  //Pour incrémenter
  addToCart(product: Product){
    this.cartService.addToCart(product);
  }

  //Pour décrémenter
  removeOne(product: Product){
    this.cartService.removeOne(product);
  }

  //Pour supprimer un produit
  removeMany(product: Product){
    this.cartService.removeMany(product);
  }

  // //MouseOver
  // over(){
  //   this.color = "green";

  // }
  // //MouseOut
  // out(){
  //   this.color = "linear-gradient(to bottom right, #B8D7FF, #8EB7EB)";
  // }
}
