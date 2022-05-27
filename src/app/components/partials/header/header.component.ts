import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'node-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth!: boolean;
  resume!: {quantity: number, costHT: number, costTaxe: number, costTTC: number};


  constructor(private auth: AuthService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(       //On s'abonne dessus et lorsqu'on va recevoir des données de type (cart: Cart)
      (cart: Cart)=>{                       //lorsqu'on reçoit les données on prend le cart qu'on a
        this.resume = cart.resume;          //ici, et on met dedans le resume du cart qu'on a reçu
      },
      (err)=>{
        console.log(err);                   //en cas d'erreur on produit l'affichage de l'erreur dans la console
      }
    )
    this.cartService.emitCart();
    this.auth.isAuth$.subscribe(
      (bool: boolean)=>{
        this.isAuth = bool;
      }
    )
  }

  logout(){
    this.auth.logout();
  }

}
