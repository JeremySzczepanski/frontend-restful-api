import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'node-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.css']
})
export class AddToCartModalComponent implements OnInit {

  @Input()
  product!: Product;
  products!: Product[];

  constructor() { }

  ngOnInit(): void {
  }

}
