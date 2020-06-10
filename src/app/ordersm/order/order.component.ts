import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/order.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Customer } from '../../shared/customer.model';
import { Order } from '../../shared/order.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerService } from '../../shared/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { OrderItem } from '../../shared/order-item.model';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

 
  customerList: Customer[];
  isValid = true;

  

  constructor( private service: OrderService,
               private dialog: MatDialog,
               private customerService: CustomerService,
               private router: Router,
               private toastr: ToastrService,
               private activatedRouter: ActivatedRoute) { }

  ngOnInit() {

    const orderID = this.activatedRouter.snapshot.paramMap.get('id');

    if (orderID === null) {

      this.resetForm();

    } else {

       this.service.getOrderByID(parseInt(orderID)).then(resp => {

        this.service.formData = resp.order;
        this.service.orderItems = resp.orderDetalle;

      });
    }

    this.customerService.getCustomerList().then(resp => this.customerList = resp as Customer[]);
 
  }


  resetForm(form?: NgForm) {

    if ( form === null ) {

      form.resetForm();

    } else {

      this.service.formData = {

        OrderID: null,
        OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
        CustomerID: 0,
        GTotal: 0,
        DeletedOrderItemIDs: ''
      };

    }

    this.service.orderItems = [];
    
  }


  AddOrEditOrderItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex, OrderID };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
    this.updateGrandTotal();
    });
  }


  onDeleteOrderItem(orderItemID: number, i: number){

    if (orderItemID === null) {

      this.service.formData.DeletedOrderItemIDs += orderItemID + ',';
      
    }

    this.service.orderItems.splice(i, 1 );
    this.updateGrandTotal();

  }

  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.GTotal = parseFloat(this.service.formData.GTotal.toFixed(2));
  }

  private validateForm() {
      this.isValid = true;
      if (this.service.formData.CustomerID === 0){

        this.isValid = false;

      } else if (this.service.orderItems.length === 0) {

        this.isValid = false;

      }
      return this.isValid;
  }

  
  onSubmit(form: NgForm) {
    if (this.validateForm()) {

      this.service.guardarOrden().subscribe( resp => {

        Swal.fire({
          title: 'Estas Seguro(a)?',
          text: 'Quiere Guardar??',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.value) {
            
            this.resetForm();
            this.toastr.success('Guardado satisfactoriamente', 'Restaurante App');
            this.router.navigate(['/orders']);
          }
        });

        

      });
    
    }
    //   this.service.saveOrUpdateOrder().subscribe(res => {
    //     this.resetForm();
    //     this.toastr.success('Submitted Successfully', 'Restaurent App.');
    //     this.router.navigate(['/orders']);
    //   })
    // }
  }

  // onDeleteOrderItem(orderItemID: number, i: number) {
  //   if (orderItemID != null)
  //     this.service.formData.DeletedOrderItemIDs += orderItemID + ",";
  //   this.service.orderItems.splice(i, 1);
    
  // }

  

  




}
