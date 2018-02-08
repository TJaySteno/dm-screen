// GENERAL PURPOSE FUNCTIONS
// DICE FUNCTIONS
function d (sides) { return Math.floor(Math.random() * sides ) + 1; };

// ADD TIME STAMP
function addTime (message) {
	let date = new Date();
	return ` - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// LOCAL STORAGE AND VARIABLES
const previousRolls = [];
const initiative = getLocalStorage('initiative') || [];

//Dice
function getInputValues (val) {
	try {
		if (!val) throw new Error('No input');
		const rolls = val.split('+');
		rolls.forEach( function (v,i) {
			if (v.includes('-')) {
				const arr = rolls.splice(i, 1)[0].split('-');
				arr.forEach( function (val,ind) {
					if (!val.includes('d')) val = `-${val}`;
					rolls.splice(i, 0, val);
				});
			}
		});
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

		diceInput.value = '';
		diceInput.focus();

		const message = rollDice(val, numOfDice, dieSides, modifier);
		print(message);
	} catch (err) { handler(err); }
}

function rollDice (val, num, sides, mod) {
	// Example message: (1d8+1d6+5): 8, 6, 5 (X total) - 15:19:22
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
			message += `, ${mod[i]}`;
			sum += Number(mod);
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

//Initiative Tracker
function getLocalStorage () {
	// Retrieve local storage and convert into a format printInitiative can use
		// Split by '$%', then by ':', store as array of objects w/ name & init keys
	try {
		if ( !localStorage.initiative ) { return false };
		const storage = localStorage.initiative.split('$%');
		const initiative = [];
		for (let i = 0; i < storage.length; i++) {
			const item = storage[i].split(': ');
			const obj = {
				name: item[0],
				init: item[1]
			}
			initiative.push(obj);
		}
		return initiative;
	} catch (err) { handler(err); }
}

function addToInitiativeList () {
	//
	try {
		if (!name.value) { throw new Error('No name was entered') };
		if (!init.value || isNaN(init.value)) { throw new Error('Please enter a valid initiative'); }
		const input = {
			name: name.value,
			init: init.value
		}
		initiative.unshift(input);
		initiative.sort((a, b) => b.init - a.init);
		clearInitInputs();
		return printInitiative();
	} catch (err) {
		handler(err);
		return printInitiative();
	}
}

function sortInitiative () {
	console.log('Depricated button');
}

function clearByName () {
	try {
		const input = name.value.toLowerCase();
		let found = false;
		for (let i = 0; i < initiative.length; i++) {
			if (input === initiative[i].name.toLowerCase()) {
				initiative.splice(i, 1);
				found = true;
			}
		}
		if (!found) throw new Error('Name given was not found');
		clearInitInputs();
	} catch (err) {
		handler(err);
	} finally {
		return printInitiative();
	}
}

function clearInitiative () {
	initiative.length = 0;
	delete localStorage.initiative;
	return '';
}

function printInitiative () {
	let message = '';
	let storage = '';
	for (let i = 0; i < initiative.length; i++) {
		if (i !== 0) {
			message += ', ';
			storage += '$%';
		};
		message += `${initiative[i].name}: ${initiative[i].init}`;
		storage += `${initiative[i].name}: ${initiative[i].init}`;
	}
	localStorage.initiative = storage;
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
	let message = `Error: ${err.message}`;
	print(message);
	console.log(err);
	return false;
}
