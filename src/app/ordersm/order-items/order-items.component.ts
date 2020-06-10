import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrderItem } from '../../shared/order-item.model';
import { Item } from '../../shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from '../../shared/order.service';
import { ItemService } from '../../shared/item.service';
import { registerLocaleData } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {

  formData: OrderItem;
  itemList: Item[];
  isValid = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialoRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private service: OrderService ) { }

  ngOnInit() {
     
    // mostrar datos de base de datos
    this.itemService.getItemList().then( resp => this.itemList = resp as Item[] );

    // editamos los valores en la tabla
    
    if (this.data.orderItemIndex === null) {

    this.formData = {

      OrderItemID: null,
      OrderID: this.data.OrderID,
      ItemID: 0,
      ItemName: '',
      Price: 0,
      Quantity: 0,
      Total: 0
    };
  
  } else {
    
    this.formData = Object.assign({}, this.service.orderItems[this.data.orderItemIndex]);
  }


  }

  updatePrecio(ctrl){

    // Mostrando datos de BD segun el item escogido formulario al escoger Item

    if (ctrl.selectedIndex === 0) {

      this.formData.Price = 0;
      this.formData.ItemName = '';

    } else {

      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;

    }

    this.updateTotal();

  }

  updateTotal(){

    // realizamos la multiplicacion y convertimos el dato al correspondoente

    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }


  onSubmit(form: NgForm) {

    if (this.validarForm(form.value)) {

      this.service.orderItems.push(form.value);
      this.dialoRef.close();

    } else {

      // cuando editamos un registerLocaleData, tomara los cambios

      this.service.orderItems[this.data.orderItemIndex] = form.value;
      this.dialoRef.close();
    }

  }

  private validarForm(formData: OrderItem){

    this.isValid = true;

    if (formData.ItemID === 0) {

      this.isValid = false;

    } else if (formData.Quantity === 0) {

      this.isValid = false;

    }

    return this.isValid;

  }
}
