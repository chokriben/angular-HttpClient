import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ProduitsComponent } from './produits/produits.component';
import { AjoutProduitComponent } from './ajout-produit/ajout-produit.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path:"accueil",component:AccueilComponent},
  {path:"produits",component:ProduitsComponent},
  {path:"ajouterProduit",component:AjoutProduitComponent},
  {path:"about",component:AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
