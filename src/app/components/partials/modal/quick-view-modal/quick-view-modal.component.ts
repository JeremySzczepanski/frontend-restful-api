import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'node-quick-view-modal',
  templateUrl: './quick-view-modal.component.html',
  styleUrls: ['./quick-view-modal.component.css']
})
export class QuickViewModalComponent implements OnInit {

  @Input()  products!: Product[];
  product!: Product;


  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  addToCart(product: Product){
    this.cartService.addToCart(product);
    console.log(this.cartService.cart);
  }

}
