import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

//el mismo que el recipeView pero con el padre cambiado
class bookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'cmon bro bookmark something ';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new bookmarksView();
