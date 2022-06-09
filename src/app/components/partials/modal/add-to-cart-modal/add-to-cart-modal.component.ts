import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Cart } from 'src/app/models/cart';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'node-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.css']
})
export class AddToCartModalComponent implements OnInit {

  @Input() products: Product[]=[];
  product!: Product;
  cart!: Cart;
  isAuth!: boolean;
  resume!: {quantity: number, costHT: number, costTaxe: number, costTTC: number};



  constructor(private cartService: CartService,
              private auth: AuthService
              ) { }

  ngOnInit(): void {

  //   this.cartService.cart$.subscribe(       //On s'abonne dessus et lorsqu'on va recevoir des données de type (cart: Cart)
  //     (cart: Cart)=>{                       //lorsqu'on reçoit les données on prend le cart qu'on a
  //       this.resume = cart.resume;          //ici, et on met dedans le resume du cart qu'on a reçu
  //     },
  //     (err)=>{
  //       console.log(err);                   //en cas d'erreur on produit l'affichage de l'erreur dans la console
  //     }
  //   )
  //   this.cartService.emitCart();
  //   this.auth.isAuth$.subscribe(
  //     (bool: boolean)=>{
  //       this.isAuth = bool;
  //     }
  //   )
  }

}
