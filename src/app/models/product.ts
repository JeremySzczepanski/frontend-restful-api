export class Product {
  _id : string;
  name : string;
  description : string;
  price : number;
  stock : number;
  image : string;
  userId : string;
  createdAt : Date;

  constructor(data: any){
    this._id = data._id;
    this.name = data.name;
    this.description = data.description
    this.price = data.price;
    this.stock = data.stock;
    this.image = data.image;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

}
