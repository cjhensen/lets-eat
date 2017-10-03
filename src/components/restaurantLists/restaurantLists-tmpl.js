// restaurantLists-tmpl

  // Dependencies
  // utilities.templateClean
  const utilities = require('../../utilities/utilities');

  // generateTemplate:
  // this template generation is different due to the fact that it calls a function
  // inside the literal to generate the list based on an array from the options
  function generateTemplate(options) {

    options = options || "";
    // pass in title and array (list) to options

    const template = `
      <div class="js-restaurant-list le-restaurant-list col-xs-12">
      <h3>${options.title}</h3>
        <ul>
          ${buildListFromArray(options.list)}
        </ul>
      </div>
    `;

    return utilities.templateClean(template);
  }

  // buildListFromArray:
  // iterates through passed in array to build a list element for each item
  function buildListFromArray(array) {
    console.log('buildListFromArray');
      let listTemplate = "";

      array.forEach(function(object) {
        listTemplate = listTemplate + `<li>${object.name}</li>`;
      });

      return listTemplate;
  }

module.exports = {
  generateTemplate: generateTemplate
};