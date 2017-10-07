// restaurantLists

  // Dependencies
  const globals = require('../../globals');
  const utilities = require('../../utilities/utilities'); // for makeDbRequest
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');

  // DOM
  const component = '.js-restaurant-list';
  // let template = $(restaurantListsTmpl.generateTemplate());
  const templateOptions = {};
  const deleteButton = `${component} li a`;

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);
  pubSub.on('renderRestaurantSearch', destroy);
  pubSub.on('renderRestaurantChoose', destroy);


  // module variables
  let currentList = {};

  function handleRenderRestaurantList(dataReceived) {
    console.log('dataReceived', dataReceived);

    // remove from dom if it already exists
    destroy();
    
    let listToDisplay = []; 

    if(dataReceived) { 
      currentList = dataReceived; 
    }
    
    // get list from users based on nav item clicked
    utilities.makeDbRequest('GET', currentList.itemClicked).then(function(data) {
      listToDisplay = data;
      console.log('listToDisplay', listToDisplay);

      templateOptions.title = currentList.itemClicked;
      templateOptions.list = listToDisplay;
      console.log('templateOptions', templateOptions);
      render();
    }).catch(function(err) {
      console.log(err);
    });

  }

  function handleDeleteButtonClicked(event) {
    event.preventDefault();
    console.log('handleDeleteButtonClicked');

    const arrayToDelFrom = templateOptions.title;
    const itemToDelete = $(this).attr('data-id');

    const data = {
      arrayToDelFrom: arrayToDelFrom,
      itemToDelete: itemToDelete
    };

    utilities.makeDbRequest('DELETE', data).then(function(data) {
      console.log('delete request completed');
      destroy();
      pubSub.emit('renderRestaurantList');
    }).catch(function(err) {
      console.log(err);
    });

    
  }

  function assignEventHandlers() {
    globals.APP_CONTAINER.on('click', deleteButton, handleDeleteButtonClicked);
  }

  function render() {
    console.log('restaurantLists render');
    let template = $(restaurantListsTmpl.generateTemplate(templateOptions));
    globals.APP_CONTAINER.append(template);
  }

  function destroy() {
    if($(component).length) {
      console.log('restaurantLists destroy');
      $(component).remove();
    }
  }

  assignEventHandlers();