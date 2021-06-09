// para que funcionen los iconos debes importarlos x q en el dist estan distintos
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
console.log(icons); // si los logeas tenes el icons en el nuevo path

// contenedor padre
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`El request tardo demasiado Timeout despues de ${s} segundos`)
      );
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    // window.location es la url, con el hash se agarra la id y el slice para quitar el #
    const id = window.location.hash.slice(1);
    console.log(id);

    // te ahorras el molesto mensaje de error
    if (!id) return;

    //mostrar spinner
    renderSpinner(recipeContainer);

    // -------------
    // 1)cargar data
    // -------------
    const res = await fetch(
      /* 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886' */
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();

    // mandar error
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);

    //cambiar recipe para que sea camelcase
    let { recipe } = data.data;
    /* recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.id,
    }; */
    console.log(recipe);
    // --------------------------
    // 2)renderizar(mostrar) data
    // --------------------------
    const markup = `
      <figure class="recipe__fig">
            <img src="${recipe.image_url}" alt="${
      recipe.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${recipe.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                recipe.cooking_time
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                recipe.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round">
              <svg class="">
                <use href="${icons}#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${recipe.ingredients
                .map(ing => {
                  return `
                <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>`;
                })
                .join('')}
              
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                recipe.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${recipe.source_url}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>`;

    // limpiar y agregar el html, se hace sobre el padre(recipeContainer) siempre
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    // recibe el error throw
    alert(err);
  }
};

// showRecipe();
// si cambia el hash o carga la pagina, se ejecuta el show recipe
['hashchange', 'load'].forEach(e => window.addEventListener(e, showRecipe));
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
