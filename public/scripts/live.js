'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Cell(props) {
  var state = '';

  switch (props.cellState) {
    case 0:
      state = 'empty';
      break;
    case 1:
      state = 'alive';
      break;
    case 2:
      state = 'dying';
      break;
  }

  return React.createElement('div', { className: "cell " + state });
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

    _this.state = {
      cells: 0
    };
    return _this;
  }

  _createClass(Board, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var pieces = this.props.width * this.props.height;
      var cells = [];
      for (var i = 0; i < pieces; i++) {
        cells[i] = getRandomInt(0, 1);
      }
      this.setState({
        cells: cells
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'board' },
        this.state.cells.map(function (cell, index) {
          return React.createElement(Cell, { key: index,
            cellState: cell,
            index: index });
        }),
        React.createElement('div', { className: 'clearfix' })
      );
    }
  }]);

  return Board;
}(React.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this2.state = {
      width: 50,
      height: 30
    };
    return _this2;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return React.createElement(Board, { width: this.state.width, height: this.state.height });
    }
  }]);

  return App;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

// ====================================
//              FUNCTIONS
// ====================================

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * SAVE any value to local storage
 * @param string Storage name
 * @param mixed Storage Value
 */
function storeLocal(name, value) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    //if we do not have local storage for some reason try to use cookies
    //we are just saving for 1 day for now
    setCookie(name, JSON.stringify(value), 1);
  }
}

/**
 * GET any value to local storage
 * @param  string cname  Storage Name
 * @return string        Storage Value
 */
function getLocal(name) {

  if (typeof Storage !== "undefined") {
    return JSON.parse(localStorage.getItem(name));
  } else {
    //if we do not have local storage for some reason try to use cookies
    return JSON.parse(getCookie(name));
  }
}

/**
 * Set a Cookie
 * @param string cname  Cookie Name
 * @param mixed cvalue  Cookie Value
 * @param int exdays How many days before expire
 */
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get a cookie
 * @param  string cname  Cookie Name
 * @return string        Cookie Value
 */
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Delete a Cookie
 * @param string cname  Cookie Name
 */
function deleteCookie(cname) {
  setCookie(cname, '', -1);
}