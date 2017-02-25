
function Cell(props) {
	let state = '';

	switch(props.cellState){
		case 0:
			state = 'empty'
			break;
		case 1:
			state = 'alive'
			break;
		case 2:
			state = 'dying'
			break;
	}

	return <div className={"cell "+state}  onClick={() => props.onClick(props.row, props.col)}></div>;
}

class Board extends React.Component {

	constructor(props) {
		super(props);

		//animation variables. NOT PART OF THE STATE!
		this.fpsInterval = 0;
		this.then = 0;
		this.startTime = 0;
		this.now = 0;
		this.elapsed = 0;

		this.componentWillMount = this.componentWillMount.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.clickSpawn = this.clickSpawn.bind(this);
	}

	componentWillMount(){
		//const pieces = this.props.width * this.props.height;
		let cells = [];
		for (var row = 0; row < this.props.height; row++) {
			cells[row] = [];
			for (var col = 0; col < this.props.width; col++) {
				cells[row][col] = getRandomInt(0, 1);
			}
		}

		this.setState({
			cells:  cells
		});
	}

	//if we successfully mounted, we need to make sure we update our board using set interval
	componentDidMount() {

		//BEGIN ANIMATION!
		this.fpsInterval = 1000 / this.props.fps;
		this.then = Date.now();
		this.startTime = this.then;

		requestAnimationFrame(this.updateBoard.bind(this));
	}

	clickSpawn(row,col){
		const newCells = this.state.cells.slice(0);
		newCells[row][col] = 2;

		this.setState({
			cells: newCells
		})
	}

	//THIS IS THE MAIN BOARD FUNCTION!!
	//This function calculates the fate of every cell, every frame, and then updates the state
	updateBoard(){
		// request another frame
		requestAnimationFrame(this.updateBoard.bind(this));

		if(this.props.running === false) return;

		// calc elapsed time since last loop
		this.now = Date.now();
		this.elapsed = this.now - this.then;

		// if enough time has elapsed, draw the next frame
		if (this.elapsed > this.fpsInterval) {

			// Get ready for next frame by setting then=now, but also adjust for your
			// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
			this.then = this.now - (this.elapsed % this.fpsInterval);

			const oldCells = this.state.cells.slice(0);
			const numRows = this.props.height;
			const numCols = this.props.width;

			let neighbours = 0;
			let newCells = [];

			oldCells.map((row, rindex) => {

				newCells[rindex] = [];
				row.map((state, cindex) => {
					neighbours = 0;

					//Find neighbours
					if(rindex > 0){
						if(cindex > 0 && oldCells[rindex-1][cindex-1] > 0){
							neighbours++;
						}
						if(oldCells[rindex-1][cindex] > 0){
							neighbours++;
						}
						if(cindex < numCols-1 && oldCells[rindex-1][cindex+1] > 0){
							neighbours++;
						}
					}

					if(cindex > 0 && oldCells[rindex][cindex-1] > 0){
						neighbours++;
					}

					if(cindex < numCols-1 && oldCells[rindex][cindex+1] > 0){
						neighbours++;
					}

					if(rindex < numRows-1){
						if(cindex > 0 && oldCells[rindex+1][cindex-1] > 0){
							neighbours++;
						}

						if(oldCells[rindex+1][cindex] > 0){
							neighbours++;
						}

						if(cindex < numCols-1 && oldCells[rindex+1][cindex+1] > 0){
							neighbours++;
						}

					}

					//Apply the rules of life!!!
					if(state === 0 && neighbours === 3){
						//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
						newCells[rindex][cindex] = 2;
					}else if(state > 0){
						if(neighbours < 2){
							//	Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
							newCells[rindex][cindex] = 0;
						}else if(neighbours === 2 || neighbours === 3){
							//Any live cell with two or three live neighbours lives on to the next generation.
							newCells[rindex][cindex] = 1;
						}else if(neighbours > 3){
							//Any live cell with more than three live neighbours dies, as if by overpopulation.
							newCells[rindex][cindex] = 0;
						}
					}else{
						//set this cell to 0 just to give it a state
						newCells[rindex][cindex] = 0;
					}

				})
			});

			this.setState({
				cells: newCells,
				generations: this.state.generations+1
			});

			this.props.update();
		}

	}

	componentWillReceiveProps(nextProps){

		if(nextProps.height != this.props.height || nextProps.width != this.props.width){
			let cells = [];
			for (var row = 0; row < nextProps.height; row++) {
				cells[row] = [];
				for (var col = 0; col < nextProps.width; col++) {
					cells[row][col] = getRandomInt(0, 1);
				}
			}

			this.setState({
				cells:  cells,
				generations:  1
			});
		}

		if(nextProps.fps !== this.props.fps){
			this.fpsInterval = 1000 / nextProps.fps;
		}

	}

	render() {
		let cells = [];
		//build an array containing all of our cell pieces
		this.state.cells.map((row, rindex) => {
			cells[rindex] = [];
			row.map((state, cindex) => {
				cells[rindex][cindex] = <Cell key={rindex+'-'+cindex}
					cellState={state} row={rindex} col={cindex} onClick={this.clickSpawn} />;
			})
		})
		return (
			<div id="board" style={{width: ((this.props.width*10)+10)+"px"}}>
			{cells}
			<div className="clearfix"></div>
			</div>
		)
	}

}

function Controls(props) {
	return (
		<div id="controls">
			<div id="generations">Generations: {props.generations}</div>
			<button id="pause" className="btn btn-primary" onClick={() => props.pause()}>{props.running?'Pause':'Run'}</button>
			<button className="btn btn-primary" onClick={() => props.speed(0)}>-</button>
			<div>Speed {props.fps}</div>
			<button className="btn btn-primary" onClick={() => props.speed(1)}>+</button>
		</div>
	);
}

class SizeControls extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			width: props.width,
			height: props.height,
		};

		this.updateWidth = this.updateWidth.bind(this);
		this.updateHeight = this.updateHeight.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
	}

	componentWillReceiveProps(nextProps){
/*
		this.setState({
			width: nextProps.width,
			height: nextProps.height
		});
*/
	}

	updateWidth(event) {
		if(event.target.value < 100 ){
			this.setState({
				width: event.target.value
			});
		}
	}

	updateHeight(event) {
		if( event.target.value < 100 ){
			this.setState({
				height: event.target.value
			});
		}
	}

	render() {
		return (
			<div id="size-controls">
				<div id="boardsize">Size:</div>
				<input type="number" value={this.state.width} onChange={this.updateWidth} />
				<span>x</span>
				<input type="number" value={this.state.height} onChange={this.updateHeight} />
				<button className="btn btn-primary" onClick={() => this.props.resize(this.state.width,this.state.height)}>Change</button>
			</div>
		);
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			width: 50,
			height: 30,
			generations: 1,
			fps: 10,
			running: true
		};

		this.update = this.update.bind(this);
		this.pause = this.pause.bind(this);
		this.speed = this.speed.bind(this);
		this.resize = this.resize.bind(this);
	}

	update(){
		this.setState({
			generations:  this.state.generations + 1
		});
	}

	pause(){
		if(this.state.running){
			this.setState({
				running:  false
			});
		}else{
			this.setState({
				running:  true
			});
		}
	}

	speed(speed){
		if(speed === 1){
			if(this.state.fps < 30){
				this.setState({
					fps:  this.state.fps+1
				});
			}
		}else{
			if(this.state.fps > 1){
				this.setState({
					fps:  this.state.fps-1
				});
			}
		}
	}

	resize(width, height){

		if(width != this.state.width || height != this.state.height){
			this.setState({
				width:  width,
				height: height,
				generations:  1
			});
		}

	}

	render() {
		return (
			<div>
				<Controls
					generations={this.state.generations}
					pause={this.pause}
					speed={this.speed}
					fps={this.state.fps}
					running={this.state.running} />
				<Board
					width={this.state.width}
					height={this.state.height}
					fps={this.state.fps}
					update={this.update}
					generations={this.state.generations}
					running={this.state.running} />
				<SizeControls
					width={this.state.width}
					height={this.state.height}
					resize={this.resize} />
			</div>
		)
	}
}


// ========================================

ReactDOM.render(
	<App />,
	document.getElementById('app')
);



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
function storeLocal(name, value){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(name, JSON.stringify(value));
	}else{
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
function getLocal(name){

	if (typeof(Storage) !== "undefined") {
		return JSON.parse(localStorage.getItem(name));
	}else{
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
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
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
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
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
