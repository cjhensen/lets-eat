// leLoader-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="le-loader js-loader">
        <div class="animation-2">
          <div class="box1"></div>
          <div class="box2"></div>
          <div class="box3"></div>
          <div class="box4"></div>
          <div class="box5"></div>
        </div>
      </div>
    `;

    return utilities.templateClean(template);
  }

module.exports = {
  generateTemplate: generateTemplate
};