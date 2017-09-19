const leLoaderTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');

  function generateTemplate() {
    const template = `
      <div class="le-loader js-loader">
        <img src="https://d13yacurqjgara.cloudfront.net/users/82092/screenshots/1073359/spinner.gif">
      </div>
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }
  
})();

module.exports = leLoaderTmpl;