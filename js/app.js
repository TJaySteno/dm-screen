//General Purpose Functions
//Dice function
function d (sides) { return Math.floor(Math.random() * sides ) + 1; };

//Add time stamp
function addTime (message) {
	let date = new Date();
	return ` - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

//Dice
let previousRolls = [];

function getInputValues (val) {
	if (!val) { throw new Error('no input') };
	const rolls = val.split('+'); //1d20,
	// rolls.push(val.slice('-'));
	const numOfDice = [];
	const dieSides = [];
	let modifier = [];
	for (let i = 0; i < rolls.length; i++) {
		if (rolls[i].includes('d')) {
			numOfDice.push(Number(rolls[i].split('d')[0]));
			dieSides.push(Number(rolls[i].split('d')[1]));
		} else {
			modifier.push(Number(rolls[i]));
		}
	}

	const message = rollDice(val, numOfDice, dieSides, modifier);
	diceInput.value = '';
	diceInput.focus();
	return message;
}

function rollDice (val, num, sides, mod) {
	// (1d8+1d6+5): 8, 6, +4 (X total) - 15:19:22
	let message = `(${val}):`;
	let sum = 0;
	//roll as many dice types as you need
	for (let i = 0; i < num.length; i++) {
		if (i !== 0) { message += `,` };
		//roll for number of dice in the type
		for (let j = 0; j < num[i]; j++) {
			const roll = d(sides[i]);
			sum += roll;
			message += ` ${roll}`;
		}
	}
	if (mod) {
		for (let i = 0; i < mod.length; i++) {
			message += `, +${mod[i]}`;
			sum += mod;
		};
	}
	message += ` (${sum} total)`;
	message += addTime();
	message = allRollsMessage(message);
	return message;
}

function allRollsMessage (newRoll) {
	previousRolls.unshift(newRoll);
	if (previousRolls.length > 5) { previousRolls.pop(); };
	message = '<ol>';
	for (let i = 0; i < previousRolls.length; i++) { message += `<li>${previousRolls[i]}</li>`; };
	message += '</ol>';
	return message;
}

//PC Tracker
function createEditDiv (string) {
	//return this with values
		// <div class="create-edit">
		// 	<input type="text" name="nameInput" placeholder="name">
		// 	<input type="text" name="raceInput" placeholder="race">
		// 	<input type="text" name="classInput" placeholder="class">
		// 	<input type="text" name="perceptionInput" placeholder="pass. perc.">
		// 	<textarea name="name" rows="2" cols="90" placeholder="extra notes"></textarea>
		// 	<button type="button" name="finish">&#10004;</button>
		// </div>
}

function addPC () {
// 	var btn = document.createElement("BUTTON");        // Create a <button> element
// var t = document.createTextNode("CLICK ME");       // Create a text node
// btn.appendChild(t);                                // Append the text to <button>
// document.body.appendChild(btn);                    // Append <button> to <body> 

	// create blank 'create-edit' div
		// alter addPCbutton.textContent
	// addEventListener
		// checkbox
		// addPCbutton
	let x;
}

function editPC () {
	// 1. add buttons to 'p' elements
		// alter editPCbutton.textContent
		// addEventListener
	// 2. change chosen 'p' into 'create-edit div'
		// remove small buttons
		// addEventListener checkbox
	let x;
}

function removePC () {
	// 1. add buttons to 'p' elements
		// alter removePCbutton.textContent
		// addEventListener
	// 2. delete 'p' element
	let x;
}

//Initiative Tracker
const initiative = getLocalStorage() || [];

function getLocalStorage () {
	if (!localStorage.initiative) { return false };
	const array = [];
	const storage = localStorage.initiative;
	const storageSplit = storage.split(', ');
	for (let i = 0; i < storageSplit.length; i++) {
		const itemSplit = storageSplit[i].split(': ');
		const item = {
			name: itemSplit[0],
			init: itemSplit[1]
		}
		array.push(item);
	}
	return array;
}

function addToList () {
	try {
		if (!name.value) { throw new Error('name') };
		if (!init.value || isNaN(init.value)) { throw new Error('init'); }
		const input = {
			name: name.value,
			init: init.value
		}
		initiative.unshift(input);
		clearInitInputs();
		return printInitiative();
	} catch (err) { throw err; }
}

function sortInitiative () {
	initiative.sort((a, b) => b.init - a.init);
	return printInitiative();
}

function clearByName () {
	const input = name.value.toLowerCase();
	for (let i = 0; i < initiative.length; i++) {
		if (input === initiative[i].name.toLowerCase()) {
			initiative.splice(i, 1);
		}
	}
	clearInitInputs();
	return printInitiative();
}

function clearInitiative () {
	initiative.length = 0;
	delete localStorage.initiative;
	return '';
}

function printInitiative () {
	let message = '';
	for (let i = 0; i < initiative.length; i++) {
		if (i !== 0) { message += ', ' };
		message += `${initiative[i].name}: ${initiative[i].init}`;
	}
	localStorage.initiative = message;
	return message;
}

function clearInitInputs () {
	name.value = '';
	init.value = '';
	name.focus();
}

initDisplay.innerHTML = printInitiative();

//Error handler
function handler (err) {
	console.log(err);
	let message = `${err.message}<br>`;
	if (err.status) { message += `Status: ${err.status}` };
	print(message);
}
