// leLoader

  // Dependencies
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

  function render() {
    console.log('leLoader render');
    APP_CONTAINER.prepend(template);
  }

  function destroy() {
    console.log('leLoader destroy');
    if($(component).length) {
      console.log('leLoader destroy'); 
      $(component).remove();
      // $(component).detach();
      // can either .detach() which keeps event handlers
    }
  }

// module.exports = leLoader;