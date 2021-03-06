// leLoader

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const leLoaderTmpl = require('./leLoader-tmpl');

  // DOM
  const component = '.js-loader';
  const template = $(leLoaderTmpl.generateTemplate());

  // Subscribed Events
  pubSub.on('renderLoader', handleRenderLoader);
  pubSub.on('destroyLoader', handleDestroyLoader);

  function handleRenderLoader() {
    render();
  }

  function handleDestroyLoader() {
    destroy();
  }

  function render(container) {
    container = container || globals.APP_CONTAINER;
    
    console.log('leLoader render');
    container.prepend(template);
  }

  function destroy(container) {
    container = container || globals.APP_CONTAINER;
    console.log('leLoader destroy');
    
    // need to pass in a container in order to make it testable
    if(container.find(component).length) {
      container.find(component).remove();
    }

  }

module.exports = {
  render: render,
  destroy: destroy
};