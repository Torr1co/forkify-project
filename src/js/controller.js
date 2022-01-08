import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // window.location es la url, con el hash se agarra la id y el slice para quitar el #
    const id = window.location.hash.slice(1);

    // te ahorras el molesto mensaje de error
    if (!id) return;
    recipeView.renderSpinner(); //mostrar spinner

    // actualizas view para que marque la receta seleccionada
    resultsView.update(model.getSearchResultsPage());
    //actualizas los bookmarks para que salgan del local storage
    bookmarksView.update(model.state.bookmarks);

    // cargar receta
    await model.loadRecipe(id);

    // renderizar(mostrar) data
    recipeView.render(model.state.recipe);
  } catch (err) {
    // recibe el error throw
    // alert(err);
    recipeView.renderError(/* `${err} 💥🤒 F` */);
  }
};

// hacer un control para cada cosa parece buena idea
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) obtenes el query (es lo que hay escrito en el buscador)
    const query = searchView.getQuery();
    if (!query) return;

    // 2) aca llamamos/cargas el searchresults
    await model.loadSearchResults(query);

    // console.log(model.state.search.results);
    //renderizas la data
    // resultsView.render(model.state.search.results);

    //3) renderizas (algo de) la data
    resultsView.render(model.getSearchResultsPage());

    //4) renderizas los botones;
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // throw err;
  }
};

/* hace que el recipeView llame a la funcion
controlRecipes que renderiza todo para tenerlo separado
publisher suscriber pattern, publisher es addHandlerRender y suscriber es controlRecipes */
const controlPagination = function (goToPage) {
  //3) renderizas (algo de) la NUEVA data
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4) renderizas los NUEVOS botones
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  //acutalizar las porciones de la receta (en el model porque es el que se encarga de la data)
  model.updateServings(updateTo);
  //acutalizar la view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  //agregar eliminar bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //actualizar recipeview
  recipeView.update(model.state.recipe);

  //renderizar bookmarks nuevos
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  //renderiza los boomarks en localStorage
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //mostramos spinner
    addRecipeView.renderSpinner();
    //como es una funcion async, esta debe ser esperada con await y para eso esta funcion también debe ser async
    //cargamos la data de la nueva receta
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //renderizamos la receta
    recipeView.render(model.state.recipe);

    //mandamos mensaje de exito
    addRecipeView.renderMessage();

    //rendemizamos el bookmark
    bookmarksView.render(model.state.bookmarks);

    //cambiar la id de la url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //cerramos la ventana
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥💣', err);
    addRecipeView.renderError(err.message);
  }
  //cargar nueva data de la receta
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateservings(controlServings);
  recipeView.addHandlerUpdateBookmark(controlAddBookmark); // carga la recipe del bookmark

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
