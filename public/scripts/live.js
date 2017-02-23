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
			width: 50,
			height: 30,
			generations: 1
		};

		_this.componentWillMount = _this.componentWillMount.bind(_this);
		_this.componentDidMount = _this.componentDidMount.bind(_this);
		return _this;
	}

	_createClass(Board, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			//const pieces = this.props.width * this.props.height;
			var cells = [];
			for (var row = 0; row < this.state.height; row++) {
				cells[row] = [];
				for (var col = 0; col < this.state.width; col++) {
					cells[row][col] = getRandomInt(0, 1);
				}
			}
			//console.log('Last Row:'+cells[29]);

			this.setState({
				cells: cells
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {

			setInterval(this.updateBoard.bind(this), 100);
		}
	}, {
		key: 'updateBoard',
		value: function updateBoard() {
			console.log('updating...');
			var oldCells = this.state.cells.slice(0);
			var numRows = this.state.height;
			var numCols = this.state.width;

			var neighbours = 0;
			var newCells = [];

			oldCells.map(function (row, rindex) {

				newCells[rindex] = [];
				row.map(function (state, cindex) {
					neighbours = 0;

					//Find neighbours
					if (rindex > 0) {
						if (cindex > 0 && oldCells[rindex - 1][cindex - 1] > 0) {
							neighbours++;
						}
						if (oldCells[rindex - 1][cindex] > 0) {
							neighbours++;
						}
						if (cindex < numCols - 1 && oldCells[rindex - 1][cindex + 1] > 0) {
							neighbours++;
						}
					}

					if (cindex > 0 && oldCells[rindex][cindex - 1] > 0) {
						neighbours++;
					}

					if (cindex < numCols - 1 && oldCells[rindex][cindex + 1] > 0) {
						neighbours++;
					}

					if (rindex < numRows - 1) {
						if (cindex > 0 && oldCells[rindex + 1][cindex - 1] > 0) {
							neighbours++;
						}

						if (oldCells[rindex + 1][cindex] > 0) {
							neighbours++;
						}

						if (cindex < numCols - 1 && oldCells[rindex + 1][cindex + 1] > 0) {
							neighbours++;
						}
					}

					//Apply the rules of life!!!
					if (state === 0 && neighbours === 3) {
						//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
						newCells[rindex][cindex] = 1;
					} else if (state === 1) {
						if (neighbours < 2) {
							//	Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
							newCells[rindex][cindex] = 0;
						} else if (neighbours === 2 || neighbours === 3) {
							//Any live cell with two or three live neighbours lives on to the next generation.
							newCells[rindex][cindex] = 1;
						} else if (neighbours > 3) {
							//Any live cell with more than three live neighbours dies, as if by overpopulation.
							newCells[rindex][cindex] = 0;
						}
					} else {
						newCells[rindex][cindex] = 0;
					}
				});
			});

			this.setState({
				cells: newCells,
				generations: this.state.generations + 1
			});
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {}
	}, {
		key: 'render',
		value: function render() {
			var cells = [];
			//build an array containing all of our cell pieces
			this.state.cells.map(function (row, rindex) {
				cells[rindex] = [];
				row.map(function (state, cindex) {
					cells[rindex][cindex] = React.createElement(Cell, { key: rindex + '-' + cindex,
						cellState: state });
				});
			});
			return React.createElement(
				'div',
				{ id: 'board' },
				cells,
				React.createElement('div', { className: 'clearfix' })
			);
		}
		/*
  	render() {
  		return (
  			<div id="board">
  			{this.state.cells.map((cell, index) =>
  				<Cell key={index}
  					cellState={cell}
  					index={index} />
  
  			)}
  			<div className="clearfix"></div>
  			</div>
  		)
  	}
  */

	}]);

	return Board;
}(React.Component);

/**
The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells,
each of which is in one of two possible states, alive or dead, or "populated" or "unpopulated"
(the difference may seem minor, except when viewing it as an early model of human/urban behaviour
simulation or how one views a blank space on a grid). Every cell interacts with its eight neighbours,
which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:


The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to
every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick
(in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to
create further generations.
*/

var App = function (_React$Component2) {
	_inherits(App, _React$Component2);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));
		/*
  this.state = {
  	width: 50,
  	height: 30,
  	generations: 1
  };
  */
	}

	//width={this.state.width} height={this.state.height} generations={this.state.generations}


	_createClass(App, [{
		key: 'render',
		value: function render() {
			return React.createElement(Board, null);
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