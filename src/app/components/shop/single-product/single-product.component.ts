import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from './../../../services/product.service'

@Component({
  selector: 'node-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {

  product!: Product

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
      window.scrollTo(0,0);
      this.route.params.subscribe(    //Ceci nous retourne un observable, on va donc s'abonner et regader à l'intérieur
        (params: Params)=>{           //lorsqu'on reçoit en argument params, on regarde dedans
          const id = params['id'];    //Objet dans lequel on garde les paramètres qui ont été fourni (l'id)
                                      //On utilise la méthode getProductById qui prend un argument de type string
          this.productService.getProductById(id)    //et l'id récupéré est aussi de type string.
                                                   //ceci nous retourne une promesse, on va donc l'écouter
          .then((product: any)=>{   //si tout se passe bien, la promesse nous envoie "data.result" avec un produit dedans
              this.product = product  //On prend le product qu'on a initialisé et on lui donne la valeur reçue
          })
          .catch((err)=>{
            this.router.navigate(['/not-found']);
            console.log(err)
          });

        }
      )
  }

}
