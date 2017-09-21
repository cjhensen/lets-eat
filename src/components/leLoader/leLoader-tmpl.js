const leLoaderTmpl = (function() {

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="le-loader js-loader">
        <img src="https://d13yacurqjgara.cloudfront.net/users/82092/screenshots/1073359/spinner.gif">
      </div>
    `;

    return utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }
  
})();

module.exports = leLoaderTmpl;