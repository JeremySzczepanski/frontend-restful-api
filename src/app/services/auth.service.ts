import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.api;
  token!: string | null;
  userId!: string | null;
  isAuth$ = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient ) {
    this.initAuth();
  }

  initAuth(){
    if(typeof localStorage !== "undefined"){
      const data = JSON.parse(localStorage.getItem('auth')||"");
      console.log(data)
        if(data){
          if(data.userId && data.token){
            this.userId = data.userId;
            this.token = data.token;
            this.isAuth$.next(true);
          }
        }

    }
  }


  signup(email: string, password: string){
    return new Promise((resolve, reject)=>{
      this.http.post<any>(this.api+'/users/signup', {email: email, password: password}).subscribe(
        (signupData: {status: number, message: string})=>{
          if(signupData.status === 201){
            //**authentifier l'utilisateur**
            this.signin(email, password)
            .then(()=>{
              resolve(true)
            })
            .catch((err)=>{
              reject(err)
            })
          }else{
            reject(signupData.message);
          }

        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

  signin(email: string, password: string){
    return new Promise((resolve, reject)=>{
      this.http.post<any>(this.api+'/users/login', {email: email, password: password}).subscribe(
        (authData: {token: string, userId: string})=>{
            this.token = authData.token;
            this.userId = authData.userId;
            this.isAuth$.next(true);
            // console.log(authData);

            //Save AuthData in local Storage
            if(typeof localStorage !== "undefined"){
              localStorage.setItem('auth', JSON.stringify(authData))
            }

            resolve(true);
        },
        (err)=>{
          reject(err)
        }
      )
    })
  }

  logout(){
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
    if(typeof localStorage !== "undefined"){
      localStorage.removeItem('auth');
    }
  }
}
