let cart = document.querySelector(".cart-card__recap");
let copyOfLS = JSON.parse(localStorage.getItem("products"));

main();

function main() {
  displayCart();
  countTotalInCart();
  toEmptyCart();
  checkFormAndPostRequest();
}

function displayCart() {
  let test = document.querySelector(".width-to-empty-cart");
  let cartCard = document.querySelector(".cart-card");
  let emptyCart = document.querySelector(".if-empty-cart");

  // Si le tableau copié du localStorage contient au moins un objet, on affiche le panier et on supprime le message d'erreur.
  if (localStorage.getItem("products")) {
    cartCard.style.display = "flex";
    cartCard.style.flexDirection = "column";
    cartCard.style.justifyContent = "space-around";
    emptyCart.style.display = "none";
  }

  // Pour chaque objet dans le tableau copié du localStorage, on crée les divs de l'affichage du panier et on les remplit avec les données du tableau.
  for (let produit in copyOfLS) {
    let productRow = document.createElement("div");
    cart.insertBefore(productRow, test);
    productRow.classList.add("cart-card__recap__row", "product-row");

    let productName = document.createElement("div");
    productRow.appendChild(productName);
    productName.classList.add("cart-card__recap__title");
    productName.innerHTML = copyOfLS[produit].name;

    let productQuantity = document.createElement("div");
    productRow.appendChild(productQuantity);
    productQuantity.classList.add("cart-card__recap__title", "title-quantity");
    productQuantity.innerHTML = copyOfLS[produit].quantity;

    let productPrice = document.createElement("div");
    productRow.appendChild(productPrice);
    productPrice.classList.add(
      "cart-card__recap__title",
      "data-price",
      "price"
    );

    // Affichage du prix avec le formatage €
    productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(copyOfLS[produit].price * copyOfLS[produit].quantity);
  }
}

function countTotalInCart() {
  let arrayOfPrice = [];
  let totalPrice = document.querySelector(".total");

  // On push chaque prix du DOM dans un tableau
  let productPriceAccordingToQuantity = document.querySelectorAll(".price");
  for (let price in productPriceAccordingToQuantity) {
    arrayOfPrice.push(productPriceAccordingToQuantity[price].innerHTML);
  }

  // On enlève les undefined du tableau
  arrayOfPrice = arrayOfPrice.filter((el) => {
    return el != undefined;
  });

  // Transformer en nombre chaque valeur du tableau
  arrayOfPrice = arrayOfPrice.map((x) => parseFloat(x));

  // Additionner les valeurs du tableau pour avoir le prix total
  const reducer = (acc, currentVal) => acc + currentVal;
  arrayOfPrice = arrayOfPrice.reduce(reducer);

  // Affichage du prix avec formatage €
  totalPrice.innerText = `Total : ${(arrayOfPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayOfPrice))}`;
}

function toEmptyCart() {

  // Lorsque qu'on clique sur le bouton, le panier se vide ainsi que le localStorage
  const buttonToEmptyCart = document.querySelector(".to-empty-cart");
  buttonToEmptyCart.addEventListener("click", () => {
    localStorage.clear();
  });
}

function checkFormAndPostRequest() {

  // On récupère les inputs depuis le DOM.
  const submit = document.querySelector("#submit");
  let inputName = document.querySelector("#name");
  let inputLastName = document.querySelector("#lastname");
  let inputPostal = document.querySelector("#postal");
  let inputCity = document.querySelector("#city");
  let inputAdress = document.querySelector("#adress");
  let inputMail = document.querySelector("#mail");
  let inputPhone = document.querySelector("#phone");
  let erreur = document.querySelector(".erreur");

  // Lors d'un clic, si l'un des champs n'est pas rempli, on affiche une erreur, on empêche l'envoi du formulaire. On vérifie aussi que le numéro est un nombre, sinon même chose.
  submit.addEventListener("click", (e) => {
    if (
      !inputName.value ||
      !inputLastName.value ||
      !inputPostal.value ||
      !inputCity.value ||
      !inputAdress.value ||
      !inputMail.value ||
      !inputPhone.value
    ) {
      erreur.innerHTML = "Vous devez renseigner tous les champs !";
      e.preventDefault();
    } else if (isNaN(inputPhone.value)) {
      e.preventDefault();
      erreur.innerText = "Votre numéro de téléphone n'est pas valide";
    } else {

      // Si le formulaire est valide, le tableau productsBought contiendra un tableau d'objet qui sont les produits acheté, et order contiendra ce tableau ainsi que l'objet qui contient les infos de l'acheteur
      let productsBought = [];
      productsBought.push(copyOfLS);

      const order = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          city: inputCity.value,
          address: inputAdress.value,
          email: inputMail.value,
        },
        products: productsBought,
      };

      // -------  Envoi de la requête POST au back-end --------
      // Création de l'entête de la requête
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
      };

      // Préparation du prix formaté pour l'afficher sur la prochaine page
      let priceConfirmation = document.querySelector(".total").innerText;
      priceConfirmation = priceConfirmation.split(" :");

      // Envoie de la requête avec l'en-tête. On changera de page avec un localStorage qui ne contiendra plus que l'order id et le prix.
      fetch("http://localhost:3000/api/teddies/order", options)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          console.log(data)
          localStorage.setItem("orderId", data.orderId);
          localStorage.setItem("total", priceConfirmation[1]);

          //  On peut commenter cette ligne pour vérifier le statut 201 de la requête fetch. Le fait de préciser la destination du lien ici et non dans la balise <a> du HTML permet d'avoir le temps de placer les éléments comme l'orderId dans le localStorage avant le changement de page.
           document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Il y a eu une erreur : " + err);
        });
    }
  });
}
