import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'F, no recipe found 4 your query';
  _message = '';
}
export default new resultView();
