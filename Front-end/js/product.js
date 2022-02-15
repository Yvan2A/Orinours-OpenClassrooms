
// Demande de récupération de l'url et du paramètre Id
let params = new URL(document.location).searchParams;
let id = params.get("id");

const productCardImg = document.querySelector(".img");
const productCardName = document.querySelector(".product-card__infos__title");
const productCardDescription = document.querySelector(".product-card__infos__description");
const productCardPrice = document.querySelector(".product-card__infos__price");
const bearNumber = document.querySelector("#bearNum");
const colorSelect = document.querySelector("#color-select");


main();

function main() {
  checkIf404();
  getArticles();
  addToCart();
}
// Message d'érreur
function checkIf404() {
  window.addEventListener("error", (e) => {
      let container = document.querySelector(".container");
      container.innerHTML = `<p>Cette page n'existe pas. <a class="back-to-home" href="index.html">Retourner dans la boutique ?</a></p>`;
      container.style.padding = "40vh 0";
      container.style.fontSize = "26px";
      let backToHomeLink = document.querySelector(".back-to-home");
      backToHomeLink.style.textDecoration = "underline";
    },
    true
  );
}

function getArticles() {
  // On récupère uniquement le produit sélectionné via l'id paramètre dans la requête

  fetch(`http://localhost:3000/api/teddies/${id}`)
    .then((res) => res.json())
    .catch((error) => {
      let container = document.querySelector(".container");
      container.innerHTML = "Nos peluches ne s'affichent pas. Etes vous bien sur le serveur local (port 3000) ? <br> En cas de problème, merci de nous contacter"
      container.style.textAlign = "center";
      container.style.padding = "45vh, 0";
    })
    .then(function (resultatAPI) {
    
      // Les données reçues par l'API sont placées sur la page
      article = resultatAPI;
      productCardName.innerHTML = article.name;
      productCardImg.src = article.imageUrl;
      productCardDescription.innerText = article.description;

      // Affichage en euros
      article.price = article.price / 100;
      productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(article.price);

      let colorSelect = document.getElementById("color-select");
      for (let i = 0; i < article.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = article.colors[i];
        colorSelect.appendChild(option);
      }
    });
}
      // Ajout du produit sélectionné au panier
function addToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart");
  const confirmation = document.querySelector(".added-to-cart-confirmation");
  const textConfirmation = document.querySelector(".confirmation-text");
  
  addToCartBtn.addEventListener("click", () => {
    if (bearNumber.value > 0 && bearNumber.value < 100) {

      
      let productAdded = {
        name: productCardName.innerHTML,
        price: parseFloat(productCardPrice.innerHTML),
        quantity: parseFloat(document.querySelector("#bearNum").value),
        _id: id,
      };

      // ***** GESTION DU LOCALSTORAGE ***** //
      let arrayProductsInCart = [];
      
      // Si il y a un LocalStorage, on récupère son contenu, puis on l'insère dans le tableau arrayProductsInCart, et on le renvoit vers le localStorage avec le nouveau produit ajouté.
      if (localStorage.getItem("products") !== null) {
        arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
       }  
        
      // Si le LocalStorage est vide, on le crée avec le produit ajouté dedans
        arrayProductsInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
      

      // Effets lors d'un ajout au panier
      confirmation.style.visibility = "visible";
      textConfirmation.innerHTML = `Vous avez ajouté ${bearNumber.value}peluches à votre panier !`;
      setTimeout("location.reload(true);", 4000);
    } else {
      confirmation.style.visibility = "visible";
      textConfirmation.style.background = "red";
      textConfirmation.style.border = "red";
      textConfirmation.style.color = "white";
      textConfirmation.style.whiteSpace = "normal";
      textConfirmation.innerText = `La quantité doit être comprise entre 1 et 99,.`;
    }
  });
}
