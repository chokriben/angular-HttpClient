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
      console.log('Le formulaire est valide.');

      // Vérifier si l'ID du produit courant est défini
      if (typeof this.produitCourant.id === 'string') {
        console.log("L'ID du produit existe et est une chaîne de caractères.");

        // Recherche du produit dans la liste par ID
        const index = this.produits.findIndex(
          (p) => p.id === this.produitCourant.id
        );

        if (index !== -1) {
          console.log('Le produit existe déjà dans la liste.');
          const p = this.produits[index];
          const confirmation = confirm(
            'Le produit existe déjà. Confirmez-vous la mise à jour ?'
          );
          if (confirmation) {
            console.log('La mise à jour du produit est confirmée.');
            this.mettreAJourProduit(this.produitCourant, p);
          } else {
            console.log('La mise à jour du produit est annulée.');
            this.message = 'Mise à jour annulée.';
          }
        } else {
          console.log(
            "Le produit n'existe pas dans la liste, ajout d'un nouveau produit."
          );
          this.ajouterProduit(this.produitCourant);
        }
      } else {
        console.log(
          "L'ID du produit n'est pas défini ou n'est pas une chaîne de caractères."
        );
        this.message = "L'ID du produit n'est pas valide.";
      }
    } else {
      console.log(
        "Le formulaire n'est pas valide. Veuillez remplir tous les champs obligatoires."
      );
      this.message = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

  mettreAJourProduit(nouveauProduit: Produit, ancienProduit: Produit) {
    this.sendPutRequest(
      `${BASE_URL}/${ancienProduit.id}`,
      nouveauProduit,
      (updatedProduct) => {
        const index = this.produits.findIndex((p) => p.id === ancienProduit.id);
        if (index !== -1) {
          this.produits[index] = updatedProduct;
          this.message = 'Le produit a été mis à jour avec succès.';
          this.effacerSaisie(); // Clear the form after successful update
        }
      },
      'Erreur lors de la mise à jour du produit.'
    );
  }

  consulterProduits() {
    this.sendGetRequest(
      BASE_URL,
      (data) => {
        this.produits = data;
      },
      'Erreur lors de la récupération des produits.'
    );
  }

  ajouterProduit(nouveauProduit: Produit) {
    this.sendPostRequest(
      BASE_URL,
      nouveauProduit,
      (response) => {
        this.produits.push(response); // Ajouter le nouveau produit à la liste locale
        this.message = 'Le produit a été ajouté avec succès.';
        this.effacerSaisie(); // Effacer le formulaire après l'ajout réussi
      },
      "Erreur lors de l'ajout du produit."
    );
  }

  supprimerProduit(produit: Produit) {
    this.sendDeleteRequest(
      `${BASE_URL}/${produit.id}`,
      () => {
        const index = this.produits.indexOf(produit);
        if (index !== -1) {
          this.produits.splice(index, 1);
          this.message = 'Le produit a été supprimé avec succès.';
        }
      },
      'Erreur lors de la suppression du produit.'
    );
  }

  editerProduit(produit: Produit) {
    this.produitCourant = { ...produit }; // Copie des détails du produit sélectionné dans produitCourant
  }

  effacerSaisie() {
    this.produitCourant = new Produit();
  }
  private sendPostRequest(
    url: string,
    data: any,
    successCallback: (data: any) => void,
    errorMessage: string
  ) {
    this.http.post<any>(url, data).subscribe({
      next: (response) => {
        successCallback(response); // Appel du callback avec la réponse de la requête
      },
      error: (err) => {
        console.error(errorMessage, err);
        this.message = "Une erreur s'est produite lors de l'ajout du produit.";
      },
    });
  }
  private sendGetRequest(
    url: string,
    successCallback: (data: any) => void,
    errorMessage: string
  ) {
    this.http.get<any>(url).subscribe({
      next: successCallback,
      error: (err) => {
        console.error(errorMessage, err);
        this.message =
          "Une erreur s'est produite lors de la récupération des produits.";
      },
    });
  }

  private sendPutRequest(
    url: string,
    data: any,
    successCallback: (data: any) => void,
    errorMessage: string
  ) {
    this.http.put<any>(url, data).subscribe({
      next: successCallback,
      error: (err) => {
        console.error(errorMessage, err);
        this.message =
          "Une erreur s'est produite lors de la mise à jour du produit.";
      },
    });
  }

  private sendDeleteRequest(
    url: string,
    successCallback: () => void,
    errorMessage: string
  ) {
    this.http.delete(url).subscribe({
      next: successCallback,
      error: (err) => {
        console.error(errorMessage, err);
        this.message =
          "Une erreur s'est produite lors de la suppression du produit.";
      },
    });
  }
}
