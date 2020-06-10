import { Component, OnInit } from '@angular/core';
import { ItemService } from '../shared/item.service';
import { Item } from '../shared/item.model';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordersm',
  templateUrl: './ordersm.component.html',
  styles: []
})
export class OrdersmComponent implements OnInit {

  orderList;
  guardado: false;

  constructor( private service: OrderService,
               private router: Router,
               private toast : ToastrService) { }

  ngOnInit( ) {

    this.refreshList();

   
  }

  refreshList(){

    this.service.getOrderList().then( resp => this.orderList = resp );

  }

  openForEdit(orderID: number) {
    this.router.navigate(['/order/edit/' + orderID]);
  }

  onOrderDelete( id: number){

    this.service.deleteOrder(id).then( resp => {

      // if( confirm('') ){

        
      // }

      Swal.fire({
        title: 'Estas Seguro(a)?',
        text: 'Quiere Borrar el Registro??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar!'
      }).then((result) => {
        if (result.value) {

          this.refreshList();
          this.toast.warning('Borrado Con exito', 'Restaurante App')
          
          
        }
      });

    });


  }

}
