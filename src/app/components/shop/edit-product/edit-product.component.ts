import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'node-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productForm!: FormGroup;
  errorMessage!: string;
  imagePreview!: string | null;
  loading!: boolean;
  userId!: string | null;
  product!: Product;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,

              ) { }


  // ngOnInit(): void {
  //   this.userId = this.auth.userId; //On initialise le userId afin que ça ne pose pas prb pour la suite.
  //   this.loading = true;  //On active le spinner comme on fait une requête vers le serveur
  //   this.route.params.subscribe(
  //     (params: Params)=>{         //une fois qu'on récupére les données on va récupérer le produit qui a l'identifiant qui se retrouve dans les params reçus
  //       this.productService.getProductById(params['id'])
  //       .then(
  //         (product: Product)=>{
  //             this.product = product;
  //               //On regarde si le produit appartient à celui qui prétend le modifier.
  //             if(this.product.userId !== this.userId){
  //               //Si pas on le redirige vers un not-found
  //               console.log("You can't edit this product !")
  //               return this.router.navigate(['/not-found']);
  //             }

  //             //ICI tout se passe correctement on va donc initialiser le formulaire avec les valeurs par défaut du produit
  //             //Dans le add-product on mettait des valeurs "null" ici on peut mettre directement les valeurs du produit via product.xxxxx
  //             this.productForm = this.formBuilder.group({
  //               name: [product.name, Validators.required],
  //               description: [product.description, Validators.required],
  //               price: [product.price / 100, Validators.required],    //Pour le prix ici on va diviser par 100, car on stocke le produit * 100
  //               stock: [product.stock, Validators.required],
  //               image: [product.image, Validators.required]
  //             });

  //             //Il faut également afficher l'image du produit (this.imagePreview qui attend l'URL de l'image)
  //             this.imagePreview = product.image;
  //             this.loading = false; //On coupe le spinner

  //         }
  //       )
  //           .catch(
  //             (err)=>{
  //               console.log(err.message);
  //               return this.router.navigate(['/shop']);
  //             });
  //     }
  //     )
  // }
  ngOnInit(): void {
    this.userId = this.auth.userId;
    this.loading = true;

    this.route.params.subscribe(
      (params: Params)=>{
        this.productService.getProductById(params['id'])
        next: (product: Product) => {
          this.product = product;
          if(this.product.userId !== this.userId){
            console.log("You can't edit this product !")
            return this.router.navigate(['/not-found']);
          }
          this.productForm = this.formBuilder.group({
            name: [product.name, Validators.required],
            description: [product.description, Validators.required],
            price: [product.price / 100, Validators.required],
            stock: [product.stock, Validators.required],
            image: [product.image, Validators.required]
          });
          this.imagePreview = product.image;
          this.loading = false;
        }
        error: (err: { message: any; }) => console.log(err.message);
          return this.router.navigate(['/shop']);

      }
    )
  }



  onSubmit(){

  }

  onImagePick(event: Event){
    const target = event.target as HTMLInputElement;
    if(!target.files?.length){
      return;
    }
    const file: File = target.files[0];  //On recupere le fichier qui est chargé
    this.productForm.get('image')?.patchValue(file);      //On récupére le champ, on fait un patchValue
                                                          //pour modifier sa valeur et on lui donne le fichier qu'on a reçu
    this.productForm.get('image')?.updateValueAndValidity();  //on update la valeur, et on rend le champ valide (à cause des validators)
         //par défaut c'est un champ qui n'est pas valide, et lorsqu'on modifie sa valeur on le rend valide.

          //On va lire le fichier et le rendre valide, on va utiliser une interface concue en javascript: fileReader (voir la description dans developer.mozilla.org)
    const reader = new FileReader();
    reader.onload = ()=>{ //on défini l'action que l'on veut réaliser
      if(this.productForm.get('image')?.valid){
        this.imagePreview = reader.result as string;  //on a défini imagePreview en string on doit donc forcer le string
      }else{
        this.imagePreview = null;
      }
    }
    reader.readAsDataURL(file);

  }


}
