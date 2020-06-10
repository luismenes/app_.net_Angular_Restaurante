import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// // libreria de angular materia

import {MatDialogModule} from '@angular/material/dialog';
// import { MaterialModule } from './material.module';


import { ToastrModule } from 'ngx-toastr';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersmComponent } from './ordersm/ordersm.component';
import { OrderItemsComponent } from './ordersm/order-items/order-items.component';
import { OrderComponent } from './ordersm/order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderService } from './shared/order.service';

@NgModule({
  declarations: [
    AppComponent,
    OrdersmComponent,
    OrderItemsComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [OrderItemsComponent],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
