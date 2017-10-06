// utilities
  
  // templateClean:
  // remove line breaks,
  // remove whitespace between element tags, 
  // remove leading and trailing whitespace
  function templateClean(template) {
    return template.replace(/(\r\n|\n|\r)/gm,"").replace(/>\s+</g,'><').trim(); 
  }

  // randomIntBetweenNums:
  // generates a random integer between a min and max value
  function randomIntBetweenNums(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Fisher-Yates Shuffle
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  function shuffleArray(array) {
    let counter = array.length;

    while(counter > 0) {
      // random index with max of counter (array length)
      let index = Math.floor(Math.random() * counter);

      // decrease counter
      counter--;

      // temp is set to array item at decreased counter
      let temp = array[counter];

      // array item at decreased counter index is set to array at random index
      array[counter] = array[index];

      // array at random index is set to temp value
      array[index] = temp;
    }

    return array;
  }

  // makeDbRequest:
  // make a request to the mongo db
  // pass in a data object
  // supports GET and PUT operations
  function makeDbRequest(requestType, data) {
    return new Promise(function(resolve, reject) {
      const settings = {
        url: '/userdata',
        dataType: 'json',
        data: {},
        type: requestType,
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(err);
        }
      };

      if(requestType === 'GET') {
        console.log('requestType', requestType);
        // data === 'history', 'liked', 'disliked'...
        settings.data.arrayToGet = data;
      }
      // data === {'history': objToInsert, 'liked': objToInsert}
      if(requestType === 'PUT') {
        console.log('requestType', requestType);
        settings.data = data;
        console.log('put data', data);
        console.log('settings.data', settings.data);
      }
      if(requestType === 'DELETE') {
        console.log('requestType', requestType);
        settings.data = data;
        console.log('settings.data', settings.data);
      }
      $.ajax(settings);
    });
  }

module.exports = {
  templateClean: templateClean,
  randomIntBetweenNums: randomIntBetweenNums,
  shuffleArray: shuffleArray,
  makeDbRequest: makeDbRequest
};