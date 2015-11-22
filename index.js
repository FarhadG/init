(function(location) {

  // cross browser AJAX
  function get(url, callback, x) {
    try {
      x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
      x.open('GET', url, 1);
      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      x.onreadystatechange = function() {
        x.readyState > 3 && callback && callback(x);
      };
      x.send('GET')
    } catch(e) {
      window.console && console.log(e);
    }
  }

  // changes current page to the specified URL
  function setLocation(url) {
    return window.location = url;
  }

  // recursively increments forward, until it gets an `error`
  function walkForward() {
    return get(url+(++pageNum), function(res) {
      return (res.status !== 200)
        ? setLocation(url+(--pageNum))
        : walkForward();
    });
  }

  // recursively increments backward, until it gets an `error`
  function walkBackward() {
    return get(url+(--pageNum), function(res) {
      return (res.status === 200)
        ? setLocation(url+(pageNum++))
        : walkBackward();
    });
  }

  // determines the direction for checking the first page from the approximation
  function handleResponse(res) {
    return (res.status === 200) ? walkForward() : walkBackward();
  }

  // returns the current location (including the branch)
  function parseLocation(location) {
    var branch = document.querySelectorAll('.select-menu .css-truncate-target.js-select-button')[0].textContent;
    if (~location.indexOf('/tree/')) {
      var params = location.split('/tree/');
      location = params[0];
      branch = params[1];
    }
    else if (!branch) {
      branch = 'master';
    }
    return location+'/commits/'+branch+'?page=';
  }

  // the necessary content to approximate the first page from the number of commits
  var url = parseLocation(location);
  var pageNum = +document
    .querySelectorAll('.commits .num')[0]
    .textContent
    .replace(/[,\s]/g, '')/35|0+1;

  // init
  get(url+pageNum, handleResponse);

})(window.location.href);
