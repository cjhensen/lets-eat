const leMultiItemListTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');


  function generateTemplate() {
    const template = `
      <div class="le-multi-item-list js-multi-item-list">
      </div>
    `;

    return _utilities.templateClean(template);
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = leMultiItemListTmpl;