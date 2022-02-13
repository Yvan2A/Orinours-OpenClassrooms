main();

function main() {
  getArticles();
}

// Récupérer les articles depuis l'API
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json();
    })
    .catch((error) => {
      let productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML =
        "Nous n'avons pas réussi à afficher nos nounours. Avez vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      productsContainer.style.textAlign = "center";
      productsContainer.style.padding = "30vh 0";
    })

    // Dispatcher les données de chaque produit (prix, nom...) dans le DOM
    .then(function (resultatAPI) {
      const articles = resultatAPI;
      console.log(articles);
      for (let article in articles) {
        let productCard = document.createElement("div");
        document.querySelector(".products").appendChild(productCard);
        productCard.classList.add("product");

        let productLink = document.createElement("a");
        productCard.appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;
        productLink.classList.add("stretched-link");

        let productImgDiv = document.createElement("div");
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        let productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;

        let productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        let productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.classList.add("product__infos__title");
        productInfoTitle.innerHTML = resultatAPI[article].name;

        let productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");

        // Formatage du prix pour l'afficher en euros
        resultatAPI[article].price = resultatAPI[article].price / 100;
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(resultatAPI[article].price);
      }
    });
}
