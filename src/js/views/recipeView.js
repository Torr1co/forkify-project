import View from './View.js'; // elemento padre
// para que funcionen los iconos debes importarlos x q en el dist estan distintos
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
//console.log(icons); // si los logeas tenes el icons en el nuevo path
//console.log(Fraction); //ver si existe
// 5ed6604591c37cdc054bc886

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'Sorry brou, we don´t find the recipe, try another one';
  _message = '';

  //esta funcion sirve para separar la logica de la view, corre el programa cuando haya un handler
  addHandlerRender(handler) {
    // si cambia el hash o carga la pagina, se ejecuta el show recipe
    ['hashchange', 'load'].forEach(el => window.addEventListener(el, handler));
    // window.addEventListener('hashchange', controlRecipes);
    // window.addEventListener('load', controlRecipes);
  }

  addHandlerUpdateservings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.btn--update-servings  ');
      if (!btn) return;

      //lo mismo que con el addHandlerClick de pagiantionView, tiene camelcase updateTo porque se convierte asi en la notacion del - de data
      // const updateTo = +btn.dataset.updateTo;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerUpdateBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    // se le agrega el dataset data-update-to a los  botones para el movimiento de pagina y btn--bookmark para el bookmark
    return `
      <figure class="recipe__fig">
            <img src="${this._data.image_url}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cooking_time
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings - 1
                }">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings + 1
                }">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${this._data.ingredients
                .map(this._generateMarkupIngredient)
                .join('')}
              
              
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                this._data.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${this._data.source_url}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}_icon-arrow-right"></use>
              </svg>
            </a>
          </div>`;
  }

  //este se corre adentro de el generateMakup
  _generateMarkupIngredient(ing) {
    return `
  <li class="recipe__ingredient">
  <svg class="recipe__icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <div class="recipe__quantity">${
    ing.quantity ? new Fraction(ing.quantity).toString() : ''
  }</div>
  <div class="recipe__description">
    <span class="recipe__unit">${ing.unit}</span>
    ${ing.description}
  </div>
</li>`;
  }
}

// se exporta de esta manera para evitar problemas de mas de una view y no sobrecargar el controller
export default new RecipeView();
