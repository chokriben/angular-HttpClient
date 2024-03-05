import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actions:Array<any>=
  [
    {titre:"Accueil",route:"/accueil"},
    {titre:"Liste Des Produit",route:"/produits"},
    {titre:"Ajouter Produit",route:"/ajouterProduit"},
    {titre:"About",route:"/about"}
  ]
  actionCourante:any;
  setActionCourante(a:any){
    this.actionCourante=a;

  }
}
