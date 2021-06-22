import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FavComponent} from './fav/fav.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fav', component: FavComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
