import { Component, OnInit, OnDestroy } from '@angular/core';
import { Slide } from 'src/app/models/slide';
import { sliderData } from 'src/app/models/api-slider';
import { interval, Observable, Subscription } from 'rxjs';



@Component({
  selector: 'node-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css']
})
export class HomeSliderComponent implements OnInit {

  slider: Slide[] = sliderData;
  currentSlide: Slide = this.slider[0];
  currentIndex: number = 0;
  indexObs: Observable<number> = interval(5000)
  indexObsSub!: Subscription

  constructor() { }

  ngOnInit(): void {
    this.indexObsSub = this.indexObs.subscribe({
      next: (value: number) =>{
        this.handleChangeImage(1)
        //console.log(value);
      }
    })
  }

  handleChangeImage(index: number){	//on va recevoir un paramètre, alors on met index qui sera de type "number"
    //console.log("index : ", index);

    let newIndex



    if(index === -1){
      //on affiche le previous (on récupère l'image précédente)
      //console.log("previous: ", index);
      newIndex = this.currentIndex - 1
      if(newIndex >=0){                                   //quand on sera à 0
        //ok
        this.currentIndex = newIndex                      //si "newIndex" est supérieur ou égal à 0 (on fait -1) car on accepte 0
      }else{
        //error                                           //Si on arrive à une valeur négative
        this.currentIndex = this.slider.length - 1        //la dernière position du tableau (la taille du tableau (-1 pour l'indice))
      };
    }
    if(index === 1){
      //on affiche le next (on recupère l'image suivante)
      //console.log("next : ", index);
      newIndex = this.currentIndex + 1
      if(newIndex < this.slider.length){
        //ok
        this.currentIndex = newIndex
      }else{
      //error
      this.currentIndex = 0
      }
    }
  //console.log("currentIndex : ", this.currentIndex);
  }


  ngOnDestroy(){
    this.indexObsSub.unsubscribe()
  }

}
