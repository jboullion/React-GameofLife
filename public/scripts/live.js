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

	return React.createElement('div', { className: "cell " + state, onClick: function onClick() {
			return props.onClick(props.row, props.col);
		} });
}

var Board = function (_React$Component) {
	_inherits(Board, _React$Component);

	function Board(props) {
		_classCallCheck(this, Board);

		//animation variables. NOT PART OF THE STATE!
		var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

		_this.fpsInterval = 0;
		_this.then = 0;
		_this.startTime = 0;
		_this.now = 0;
		_this.elapsed = 0;

		_this.componentWillMount = _this.componentWillMount.bind(_this);
		_this.componentDidMount = _this.componentDidMount.bind(_this);
		_this.clickSpawn = _this.clickSpawn.bind(_this);
		return _this;
	}

	_createClass(Board, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			//const pieces = this.props.width * this.props.height;
			var cells = [];
			for (var row = 0; row < this.props.height; row++) {
				cells[row] = [];
				for (var col = 0; col < this.props.width; col++) {
					cells[row][col] = getRandomInt(0, 1);
				}
			}

			this.setState({
				cells: cells
			});
		}

		//if we successfully mounted, we need to make sure we update our board using set interval

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {

			//BEGIN ANIMATION!
			this.fpsInterval = 1000 / this.props.fps;
			this.then = Date.now();
			this.startTime = this.then;

			requestAnimationFrame(this.updateBoard.bind(this));
		}
	}, {
		key: 'clickSpawn',
		value: function clickSpawn(row, col) {
			var newCells = this.state.cells.slice(0);
			newCells[row][col] = 2;

			this.setState({
				cells: newCells
			});
		}

		//THIS IS THE MAIN BOARD FUNCTION!!
		//This function calculates the fate of every cell, every frame, and then updates the state

	}, {
		key: 'updateBoard',
		value: function updateBoard() {
			var _this2 = this;

			// request another frame
			requestAnimationFrame(this.updateBoard.bind(this));

			if (this.props.running === false) return;

			// calc elapsed time since last loop
			this.now = Date.now();
			this.elapsed = this.now - this.then;

			// if enough time has elapsed, draw the next frame
			if (this.elapsed > this.fpsInterval) {
				(function () {

					// Get ready for next frame by setting then=now, but also adjust for your
					// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
					_this2.then = _this2.now - _this2.elapsed % _this2.fpsInterval;

					var oldCells = _this2.state.cells.slice(0);
					var numRows = _this2.props.height;
					var numCols = _this2.props.width;

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
								newCells[rindex][cindex] = 2;
							} else if (state > 0) {
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
								//set this cell to 0 just to give it a state
								newCells[rindex][cindex] = 0;
							}
						});
					});

					_this2.setState({
						cells: newCells,
						generations: _this2.state.generations + 1
					});

					_this2.props.update();
				})();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {

			if (nextProps.height != this.props.height || nextProps.width != this.props.width) {
				var cells = [];
				for (var row = 0; row < nextProps.height; row++) {
					cells[row] = [];
					for (var col = 0; col < nextProps.width; col++) {
						cells[row][col] = getRandomInt(0, 1);
					}
				}

				this.setState({
					cells: cells,
					generations: 1
				});
			}

			if (nextProps.fps !== this.props.fps) {
				this.fpsInterval = 1000 / nextProps.fps;
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var cells = [];
			//build an array containing all of our cell pieces
			this.state.cells.map(function (row, rindex) {
				cells[rindex] = [];
				row.map(function (state, cindex) {
					cells[rindex][cindex] = React.createElement(Cell, { key: rindex + '-' + cindex,
						cellState: state, row: rindex, col: cindex, onClick: _this3.clickSpawn });
				});
			});
			return React.createElement(
				'div',
				{ id: 'board', style: { width: this.props.width * 10 + 10 + "px" } },
				cells,
				React.createElement('div', { className: 'clearfix' })
			);
		}
	}]);

	return Board;
}(React.Component);

function Controls(props) {
	return React.createElement(
		'div',
		{ id: 'controls' },
		React.createElement(
			'div',
			{ id: 'generations' },
			'Generations: ',
			props.generations
		),
		React.createElement(
			'button',
			{ id: 'pause', className: 'btn btn-primary', onClick: function onClick() {
					return props.pause();
				} },
			props.running ? 'Pause' : 'Run'
		),
		React.createElement(
			'button',
			{ className: 'btn btn-primary', onClick: function onClick() {
					return props.speed(0);
				} },
			'-'
		),
		React.createElement(
			'div',
			null,
			'Speed ',
			props.fps
		),
		React.createElement(
			'button',
			{ className: 'btn btn-primary', onClick: function onClick() {
					return props.speed(1);
				} },
			'+'
		)
	);
}

var SizeControls = function (_React$Component2) {
	_inherits(SizeControls, _React$Component2);

	function SizeControls(props) {
		_classCallCheck(this, SizeControls);

		var _this4 = _possibleConstructorReturn(this, (SizeControls.__proto__ || Object.getPrototypeOf(SizeControls)).call(this, props));

		_this4.state = {
			width: props.width,
			height: props.height
		};

		_this4.updateWidth = _this4.updateWidth.bind(_this4);
		_this4.updateHeight = _this4.updateHeight.bind(_this4);
		_this4.componentWillReceiveProps = _this4.componentWillReceiveProps.bind(_this4);
		return _this4;
	}

	_createClass(SizeControls, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			/*
   		this.setState({
   			width: nextProps.width,
   			height: nextProps.height
   		});
   */
		}
	}, {
		key: 'updateWidth',
		value: function updateWidth(event) {
			if (event.target.value < 100) {
				this.setState({
					width: event.target.value
				});
			}
		}
	}, {
		key: 'updateHeight',
		value: function updateHeight(event) {
			if (event.target.value < 100) {
				this.setState({
					height: event.target.value
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this5 = this;

			return React.createElement(
				'div',
				{ id: 'size-controls' },
				React.createElement(
					'div',
					{ id: 'boardsize' },
					'Size:'
				),
				React.createElement('input', { type: 'number', value: this.state.width, onChange: this.updateWidth }),
				React.createElement(
					'span',
					null,
					'x'
				),
				React.createElement('input', { type: 'number', value: this.state.height, onChange: this.updateHeight }),
				React.createElement(
					'button',
					{ className: 'btn btn-primary', onClick: function onClick() {
							return _this5.props.resize(_this5.state.width, _this5.state.height);
						} },
					'Change'
				)
			);
		}
	}]);

	return SizeControls;
}(React.Component);

var App = function (_React$Component3) {
	_inherits(App, _React$Component3);

	function App() {
		_classCallCheck(this, App);

		var _this6 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

		_this6.state = {
			width: 50,
			height: 30,
			generations: 1,
			fps: 10,
			running: true
		};

		_this6.update = _this6.update.bind(_this6);
		_this6.pause = _this6.pause.bind(_this6);
		_this6.speed = _this6.speed.bind(_this6);
		_this6.resize = _this6.resize.bind(_this6);
		return _this6;
	}

	_createClass(App, [{
		key: 'update',
		value: function update() {
			this.setState({
				generations: this.state.generations + 1
			});
		}
	}, {
		key: 'pause',
		value: function pause() {
			if (this.state.running) {
				this.setState({
					running: false
				});
			} else {
				this.setState({
					running: true
				});
			}
		}
	}, {
		key: 'speed',
		value: function speed(_speed) {
			if (_speed === 1) {
				if (this.state.fps < 30) {
					this.setState({
						fps: this.state.fps + 1
					});
				}
			} else {
				if (this.state.fps > 1) {
					this.setState({
						fps: this.state.fps - 1
					});
				}
			}
		}
	}, {
		key: 'resize',
		value: function resize(width, height) {

			if (width != this.state.width || height != this.state.height) {
				this.setState({
					width: width,
					height: height,
					generations: 1
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(Controls, {
					generations: this.state.generations,
					pause: this.pause,
					speed: this.speed,
					fps: this.state.fps,
					running: this.state.running }),
				React.createElement(Board, {
					width: this.state.width,
					height: this.state.height,
					fps: this.state.fps,
					update: this.update,
					generations: this.state.generations,
					running: this.state.running }),
				React.createElement(SizeControls, {
					width: this.state.width,
					height: this.state.height,
					resize: this.resize })
			);
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