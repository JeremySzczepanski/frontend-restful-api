import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from '../../../models/cart'
import { Item } from '../../../models/item'

@Component({
  selector: 'node-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart!: Cart;
  items!: Item[];
  resume!: {quantity: number, costHT: number, costTaxe: number, costTTC: number};


  constructor(private cartService: CartService) {}

   ngOnInit(): void {
    this.cartService.cart$.subscribe(
      (cart: Cart)=>{
        this.cart = cart;
        // console.log()
        this.items = cart.items;

      }
    );
    this.cartService.emitCart();
  }


}
