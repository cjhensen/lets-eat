const leMultiItemList = (function() {

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
  const leMultiItemListTmpl = require('./leMultiItemList-tmpl');

  // DOM
  const component = '.js-multi-item-list';
  let template = $(leMultiItemListTmpl.generateTemplate());

  function render() {
    console.log('leMultiItemList render');
    APP_CONTAINER.append(template);
  }

  function destroy() {
    console.log('leMultiItemList destroy');
  }

  render();

})();

module.exports = leMultiItemList;