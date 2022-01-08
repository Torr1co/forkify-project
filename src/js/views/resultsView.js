import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Sorry, no recipes found four your query';
  _message = '';
}
export default new resultView();
