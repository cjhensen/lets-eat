// leMenu-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');


  function generateTemplate() {
    const template = `
      <div class="le-menu js-menu">
        <h2>Let's Eat</h2>
        <ul class="nav">
          <li class="nav-item"><a href="#" data-item="search">Search</a></li>
          <li class="nav-item"><a href="#" data-item="history">History</a></li>
          <li class="nav-item"><a href="#" data-item="liked">Liked</a></li>
          <li class="nav-item"><a href="#" data-item="disliked">Disliked</a></li>
          <li class="nav-item"><a href="/logout" data-item="log">Log Out</a></li>
        </ul>
        <input type="checkbox" id="nav-trigger" class="nav-trigger le-menu-toggle" />
        <label for="nav-trigger"></label>
      </div>
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};