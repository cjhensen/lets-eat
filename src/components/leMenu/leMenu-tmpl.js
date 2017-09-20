const leMenuTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');


  function generateTemplate() {
    const template = `
      <div class="le-menu">
        <button class="le-menu-toggle btn" type="button">MENU</button>
        <nav class="nav">
          <a class="nav-item" href="#" alt="">Login/Logout</a>
          <a class="nav-item" href="#" alt="">Search</a>
          <a class="nav-item" href="#" alt="">History</a>
          <a class="nav-item" href="#" alt="">Liked Restaurants</a>
          <a class="nav-item" href="#" alt="">Disliked Restaurants</a>
        </nav>
      </div>
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = leMenuTmpl;