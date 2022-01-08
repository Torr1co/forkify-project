import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';
// principal data a exportar
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source_url: recipe.source_url,
    image_url: recipe.image_url,
    servings: recipe.servings,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //si no tiene key, no se le hace nada de otra manera Si tiene key y se le asignara key
    ...(recipe.key && { key: recipe.key }),
    //como un key: recipe.key
    //truco muy bueno
  };
};

export const loadRecipe = async function (id) {
  try {
    // -------------
    // 1)cargar data
    // -------------
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //   obtener receta de data
    state.recipe = createRecipeObject(data);
    // cambiar el state de arriba que se usara para la data
    /* state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.source_url,
      image_url: recipe.image_url,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      ingredients: recipe.ingredients,
    }; */

    //checkear si estan en el bookmark
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    // else state.recipe.bookmarked = false;

    // console.log(recipe);
  } catch (err) {
    //se vuelve a tirar el error para el controller
    throw err;
  }
};

//funcionalidad de busqueda
export const loadSearchResults = async function (query) {
  try {
    // asigna las variables a exportar de la busqueda
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // se le incluye nuestra kay para que cargue los resultados incluyendos los nuestros en
    // state.search.results = data.data.recipes; // a mi me aparece a partir de la primera
    // console.log(data.data.recipes);
    //de la forma de abajo queda mas legible de otra manera para que lo nombres sean iguales
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        title: rec.title,
        image_url: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  // console.log(state.search.page);
  let start = (page - 1) * state.search.resultsPerPage; // 0
  let end = page * state.search.resultsPerPage; // 9

  //devuelve solo los valores del 0 al 9 de la pagina
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //añadir el bookmark
  state.bookmarks.push(recipe);

  // marcar la actual como bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

//usualmente cuando programamos, cunado añadimos ponemos toda la data y cuando eliminamos solo la id
export const deleteBookmark = function (id) {
  //eliminar bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //desmarcar
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

//pone la data en el localStorage
const initBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
initBookmarks();

//hara un request a la api entonces async
export const uploadRecipe = async function (newRecipe) {
  //1) transformar la data que viene como la que se carga

  //filtra los ingredientes
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // obtiene la cantidad, unidad y descripcion
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Usaste el formato equivocado, asegurate de poner siempre las comas '
          );
        // ^ por lo tanto se utiliza un try catch en el controlador y además en esta funcion porque al ser una promesa, saltará el error y debe ser agarrado en el controlador, no en el modelo para renderizarlo

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //hacer una receta a partir de la data obtenida, notar que ingredients es lo que obtuvimos arriba
    const recipe = {
      // id: newRecipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    //como es una promesa se debe esperar, se obtiene la data que se manda
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    //la ponemos en el state
    state.recipe = createRecipeObject(data); //la key se le agrega en el createRecipeObject

    //falta agregarle los valores que nosotros le agregamos(el bookmarked) y la key entonces:
    addBookmark(state.recipe);

    // console.log(data);
  } catch (err) {
    throw err;
  }
};
