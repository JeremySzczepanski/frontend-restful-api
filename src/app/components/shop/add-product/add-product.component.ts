import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'node-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm!: FormGroup;
  errorMessage!: string;
  imagePreview!: string | null;
  loading!: boolean;
  userId!: string | null;


  constructor(private formBuilder: FormBuilder, private auth: AuthService, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      stock: [2, Validators.required],
      price: [0, Validators.required],
      image: [null, Validators.required]
    });
    this.userId = this.auth.userId;
  }

  onSubmit(){
    this.loading = true; //comme ça le spinner va se lancer
    //On récupére les données issues du formulaire, on commence par créer un objet product
    const product = new Product();
    product.name = this.productForm.get('name')?.value;
    product.description = this.productForm.get('description')?.value;
    product.price = this.productForm.get('price')?.value * 100;
    product.stock = this.productForm.get('stock')?.value;
    product.image = '';   //On met une chaine vide car on le récupère déjà dans le onImagePick()
    product.userId = this.userId;

    //SAVE PRODUCT
    this.productService.createNewProduct(product, this.productForm.get('image')?.value)  //Prend en paramètre un product et une image
    .then(
      ()=>{
        this.productForm.reset()  //Si tout s'est bien passé on prend le formulaire et on supprime ce qu'il y a dedans
        this.loading = false;   //On arrête le spinner
        this.router.navigate(['/shop']);  //On redirige sur la page shop
      }
    )
    .catch(
      (err)=>{
        this.loading = false;
        this.errorMessage = err.message;
      }
    );
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
