import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersmComponent } from './ordersm/ordersm.component';
import { OrderComponent } from './ordersm/order/order.component';


const routes: Routes = [


  { path: '', pathMatch: 'full', redirectTo: 'order'},
  { path: 'orders', component: OrdersmComponent},
  { path: 'order',
  children: [

    { path: '', component: OrderComponent},
    { path: 'edit/:id', component: OrderComponent}

  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
