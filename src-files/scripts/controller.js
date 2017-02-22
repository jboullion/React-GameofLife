
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

	return <div className={"cell "+state}></div>;
}

class Board extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cells: 0
		};
	}

	componentWillMount(){
		const pieces = this.props.width * this.props.height;
		let cells = [];
		for (var i = 0; i < pieces; i++) {
			cells[i] = getRandomInt(0, 1);
		}
		this.setState({
			cells:  cells
		});
	}

	componentWillReceiveProps(nextProps){

	}

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
}


class App extends React.Component {
	constructor() {
		super();
		this.state = {
			width: 50,
			height: 30
		};
	}



	render() {
		return <Board width={this.state.width} height={this.state.height} />
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
