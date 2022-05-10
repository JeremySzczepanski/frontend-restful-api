import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  //intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {			//Ici l'interceptor récupére la requête, on va typer

  intercept(request: HttpRequest<any>, next: HttpHandler) {	//à l'intérieur on a la requête qui nous est fourni, on va pouvoir faire des modifications dessus, et											//avec next on va pouvoir relancer la requête après modification, on va donc récupérer le token qu'on va insérer
    const token = this.auth.token;                          //On récupère le token
    const newRequest = request.clone({                      //On modifie la requête qu'on a actuellement en créant une nouvelle requête
	    headers: request.headers.set('Authorization', 'Bearer '+token)  //Dans la nouvelle requête, On change son entête et donc l'authorization
    })
    return next.handle(newRequest);                       //On se retrouve avec une nouvelle requête qu'on va pouvoir lancer
  }
}
