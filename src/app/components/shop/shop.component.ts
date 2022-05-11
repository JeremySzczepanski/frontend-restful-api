import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  productSub!: Subscription;
  loading!: boolean;
  userId!: string;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {                                        //Ceci nous retourne un observable, il faut donc penser à faire un subscribe
    this.productSub = this.productService.products$.subscribe(   //quand on fait un subscribe, il faut penser à un moment à détruire cela pour des raisons de sécurité
                                                            //et pour éviter que l'application ne plante.
      (products: Product[])=>{            //lorsqu'on écoute on peut recevoir des données (ici des produits)
          this.loading = true;	//Pour afficher le spinner material
          this.products = products;       //on met dans produts les produits qu'on a reçu en paramètre
      },
      (err)=>{
        this.loading = false;	//Si on est en cas d'erreur ça veut dire qu'on est pas en mesure d'afficher les produits, dans ce cas on le met à false
        console.log(err);
      }
    );
    this.productService.getProducts();    //Ici on récupère les produits
  }

  ngOnDestroy(): void {                                 //Ici on détruit le subscribe
    this.productSub.unsubscribe();
  }

}
