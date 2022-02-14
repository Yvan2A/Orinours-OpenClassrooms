main();

function main() {
  getArticles();
}

// Récupérer les articles depuis l'API
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then((res) => res.json())
    .catch((error) => {
      let productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML =
        "Nous n'avons pas réussi à afficher nos nounours. Avez vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      productsContainer.style.textAlign = "center";
      productsContainer.style.padding = "30vh 0";
    })

    // Ajouter les données de chaque produit dans le DOM
    .then(function (dataAPI) {
      const makeArticle = dataAPI;
      console.log(makeArticle);
      
      for (let article in makeArticle) {
        let productCard = document.createElement("div");
        document.querySelector(".products").appendChild(productCard);
        productCard.classList.add("product");

        let productLink = document.createElement("a");
        productCard.appendChild(productLink);
        productLink.href = `product.html?id=${dataAPI[article]._id}`;
        productLink.classList.add("stretched-link");

        let productImgDiv = document.createElement("div");
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        let productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = dataAPI[article].imageUrl;

        let productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        let productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.classList.add("product__infos__title");
        productInfoTitle.innerHTML = dataAPI[article].name;

        let productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");

      }
    });
}
