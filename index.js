(function(location) {

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

  function setLocation(url) {
    return window.location = url;
  }

  function walkForward() {
    get(url+(++pageNum), function(res) {
      return (res.status !== 200)
        ? setLocation(url+(--pageNum))
        : walkForward();
    });
  }

  function walkBackward() {
    get(url+(--pageNum), function(res) {
      return (res.status === 200)
        ? setLocation(url+(pageNum++))
        : walkBackward();
    });
  }

  function handleResponse(res) {
    (res.status === 200) ? walkForward() : walkBackward();
  }

  function parseLocation(location) {
    var branch = 'master';
    if (~location.indexOf('/tree/')) {
      var params = location.split('/tree/');
      location = params[0];
      branch = params[1];
    }
    return location+'/commits/'+branch+'?page=';
  }

  var url = parseLocation(location);
  var pageNum = +document
    .querySelectorAll('.commits .num')[0]
    .textContent
    .replace(/[,\s]/g, '')/35|0+1;

  get(url+pageNum, handleResponse);

  var anchor = document.createElement('a');

})(window.location.href);

