import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']
})
export class DeleteProductModalComponent implements OnInit {

  @Input()
  product!: Product;
  userId!: string | null;

  constructor(private auth: AuthService,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.userId = this.auth.userId;
  }

  deleteProduct(product: Product){
    //On regarde si le produit appartient à l'utilisateur connecté
    if(this.userId !== product.userId){
      return this.router.navigate(['/not-found']);	//On injecte le private router: Router dans le contructor.
    }
    console.log(product)
    //La suppression
    this.productService.deleteProduct(this.product._id)
    .then(
      ()=>{
      console.log('Product Deleted !')
      }
    )
    .catch(
      ()=>{
        return this.router.navigate(['/shop']);
      }
    )

  }


}
