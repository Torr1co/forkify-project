class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    //   mucho muuy importante aprender a hacer esto
    const query = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //esta funcion sirve para separar la logica de la view, corre el programa cuando haya un handler pero a travez del controller
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      //sino reinicia la pagina
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
