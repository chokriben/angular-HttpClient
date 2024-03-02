import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://localhost:9999/produits';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.consulterProduits();
  }

  produits: Produit[] = [];
  produitCourant: Produit = new Produit();
  message: string = '';

  validerFormulaire(form: NgForm) {
    if (form.valid) {
      if (form.value.id) {
        const index = this.produits.findIndex(p => p.id === form.value.id);
        if (index !== -1) {
          const p = this.produits[index];
          const confirmation = confirm(
            'Le produit existe déjà. Confirmez-vous la mise à jour ?'
          );
          if (confirmation) {
            this.mettreAJourProduit(form.value, p);
          } else {
            this.message = 'Mise à jour annulée.';
          }
        }
      } else {
        this.ajouterProduit(form.value);
      }
    } else {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

  consulterProduits() {
    this.http.get<Produit[]>(BASE_URL).subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des produits:', err);
        this.message = 'Une erreur s\'est produite lors de la récupération des produits.';
      },
    });
  }
  mettreAJourProduit(nouveauProduit: Produit, ancienProduit: Produit) {
    this.http.put<Produit>(`${BASE_URL}/${ancienProduit.id}`, nouveauProduit)
      .subscribe({
        next: (updatedProduct) => {
          const index = this.produits.findIndex(p => p.id === ancienProduit.id);
          if (index !== -1) {
            this.produits[index] = updatedProduct;
            this.message = 'Le produit a été mis à jour avec succès.';
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit:', err);
          this.message = 'Une erreur s\'est produite lors de la mise à jour du produit.';
        },
      });
  }




  ajouterProduit(nouveauProduit: Produit) {
    this.http.post<Produit>(BASE_URL, nouveauProduit)
      .subscribe({
        next: (newProduit) => {
          this.produits.push(newProduit);
          this.message = 'Le produit a été ajouté avec succès.';
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du produit:', err);
          this.message = 'Une erreur s\'est produite lors de l\'ajout du produit.';
        },
      });
  }

  supprimerProduit(produit: Produit) {
    this.http.delete(`${BASE_URL}/${produit.id}`)
      .subscribe({
        next: () => {
          const index = this.produits.indexOf(produit);
          if (index !== -1) {
            this.produits.splice(index, 1);
            this.message = 'Le produit a été supprimé avec succès.';
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit:', err);
          this.message = 'Une erreur s\'est produite lors de la suppression du produit.';
        },
      });
  }

  effacerSaisie() {
    this.produitCourant = new Produit();
  }
}
