import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderItems: Array<OrderItem> = [];
  formData: Order = new Order();

  constructor(private http: HttpClient) { }


  guardarOrden(){

    // OrderItem parametro de base datos
    const body = {
      ...this.formData,
      OrderItem : this.orderItems
    };

    return this.http.post(environment.apiURL + '/Order', body);
  }

  getOrderList(){

    return this.http.get(environment.apiURL + '/Order').toPromise();

  }

  getOrderByID(id: number): any {

    return this.http.get(environment.apiURL + '/Order/' + id ).toPromise();

  }

  deleteOrder(id: number): any {

    return this.http.delete(environment.apiURL + '/Order/' + id ).toPromise();

  }




}
