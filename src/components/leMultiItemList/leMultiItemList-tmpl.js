const leMultiItemListTmpl = (function() {

  // Dependencies
  // _utilities.templateClean
  const _utilities = require('../../utilities/utilities');

  // generateTemplate:
  // this template generation is different due to the fact that it calls a function
  // inside the literal to generate the list based on an array from the options
  function generateTemplate(options) {

    options = options || "";
    const testArray = [{id: "test1"}, {id: "test2"}, {id: "test3"}];
    // pass in array to options

    const template = `
      <div class="le-multi-item-list js-multi-item-list">
        <ul>
          ${buildListFromArray(testArray)}
        </ul>
      </div>
    `;

    return _utilities.templateClean(template);
  }

  // buildListFromArray:
  // iterates through passed in array to build a list element for each item
  function buildListFromArray(array) {
    console.log('buildListFromArray');
    let listTemplate = "";

    array.forEach(function(object) {
      listTemplate = listTemplate + `<li>${object.id}</li>`;
    });
    return listTemplate;
  }

  return {
    generateTemplate: generateTemplate
  }

})();

module.exports = leMultiItemListTmpl;