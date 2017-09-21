// leMenu-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');


  function generateTemplate() {
    const template = `
      <div class="le-menu js-menu">
        <button class="le-menu-toggle btn" type="button">MENU</button>
        <nav class="nav">
          <a class="nav-item" href="#" alt="" data-item="log">Login/Logout</a>
          <a class="nav-item" href="#" alt="" data-item="search">Search</a>
          <a class="nav-item" href="#" alt="" data-item="history">History</a>
          <a class="nav-item" href="#" alt="" data-item="liked">Liked Restaurants</a>
          <a class="nav-item" href="#" alt="" data-item="disliked">Disliked Restaurants</a>
        </nav>
      </div>
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};