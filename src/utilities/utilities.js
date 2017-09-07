const _utilities = (function() {
  
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

  return {
    templateClean: templateClean,
    randomIntBetweenNums: randomIntBetweenNums
  }

})();