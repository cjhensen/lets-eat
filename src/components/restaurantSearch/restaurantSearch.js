const restaurantSearch = (function() {

  // DOM
  const element = $('.js-restaurant-search');
  const template = $(restaurantSearchTmpl.generateTemplate());
  const btnSearch = $('.js-btn-submit', template); 

  function getFormValues() {
    return {
      location: $('.js-input-location', template).val(),
      radius: $('.js-select-radius', template).val(),
      cuisine: $('.js-select-cuisine', template).val(),
      tryNew: $('.js-input-try-new', template).is(':checked')
    }
  }

  function handleSearchBtnClicked(event) {
    console.log('handleSearchBtnClicked');
    event.preventDefault();
    console.log(getFormValues());
  }

  // assign event handlers
  function assignEventHandlers() {
    console.log('assignEventHandlers');
    btnSearch.on('click', handleSearchBtnClicked);
  }

  // render the element to the page
  function render() {
    console.log('restaurantSearch render');
    element.append(template);
  }


  // test function for checking values
  function test() {
    console.log('template', template);
    console.log('btnSearch', btnSearch);
  }

  // on initial load:
  //   render the template
  //   bind events
  render();
  assignEventHandlers();

  return {
    render: render,
    assignEventHandlers: assignEventHandlers,
    test: test
  }

})();