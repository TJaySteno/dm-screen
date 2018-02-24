/*** DICE ROLLER ***/
/* Define HTML Elements */
const diceDiv = document.querySelector('#dice');
	const diceButtons = diceDiv.firstElementChild.querySelectorAll('button');
	const rollButton = Array.from(diceButtons).shift();
	const diceInput = rollButton.previousElementSibling;

	rollButton.addEventListener('click', function () { rollForInputValues(diceInput.value); });
	/* Add listener here for 'enter' */
	for (let i = 1; i < diceButtons.length; i++) {
		diceButtons[i].addEventListener('click', function () {
			print( rollDice( `1d${diceButtons[i].value}`, [1], [diceButtons[i].value] ) )
				// (display value, number of dice, die sides)
		});
	}

function d (sides) { return Math.floor(Math.random() * sides ) + 1; };

// Reads and prints for user-inputed roll value
function rollForInputValues (val) {
	try {
		if (!val) throw new Error('Please enter a roll value');

		// Separate input into sections based on instances of '+'
		const rolls = val.split('+');
		rolls.forEach( function (val,ind) {
			// Split based on '-'. Replace number values in new array with negative values.
			if (val.includes('-')) {
				const arr = rolls.splice(ind, 1)[0].split('-');
				arr.forEach( function (v) {
					if (!v.includes('d')) v = `-${v}`;
					rolls.splice(ind, 0, v);
				});
			}
		});

		// Create arrays to pass into 'rollDice'
			/* NOTE: Might be easier to read if 'rollDice' refactored to simply take an array of dice; [1d8, 1d6, etc] instead of 2 arrays */
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

		// Reset input field
		diceInput.value = '';
		diceInput.focus();

		// Roll and print
		print( rollDice(val, numOfDice, dieSides, modifier) );

	} catch (err) { handler(err); }
}

// Returns a readable message to display based while making dice rolls
	// Template: '(1d8+1d6+5): 8, 6, 5 (19 total) - 12:34:56'
function rollDice (dispVal, numArr, sidesArr, modArr) {
	let message = `(${dispVal}):`;
	let sum = 0;

	// For each value in 'numArr'...
	numArr.forEach( function (val, ind) {
		// Add a comma to 'message' for entry after the first one
		if (ind !== 0) { message += `,` };

		// Roll dice 'val' number of times; add rolls to 'message', and update 'sum' along the way
		for (let j = 0; j < val; j++) {
			const roll = d(sidesArr[ind]);
			message += ` ${roll}`;
			sum += roll;
		}
	});

	// If a modifier has been passed in, update 'sum' and 'message' accordingly
	if (modArr) {
		modArr.forEach( function (val) {
			message += `, ${val}`;
			sum += Number(val);
		});
	}

	// Finish 'message' with final 'sum' and a time stamp
	message += ` (${sum} total)`;
	message += timeStamp();
	// Pass to 'allRollsMessage' to tack on previous rolls and save to localStorage
	message = allRollsMessage(message);
	return message;
}

// Template time stamp: ' - 12:34:56'
function timeStamp (message) {
	let date = new Date();
	return ` - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// Construct a printable message from a new roll and up to 4 previous rolls
function allRollsMessage (newRoll) {
	previousRolls.unshift(newRoll);
	if (previousRolls.length > 5) { previousRolls.pop(); };
	let message = '<ol>';
	previousRolls.forEach( function (val) { message += `<li>${val}</li>`; });
	message += '</ol>';
	return message;
}

const previousRolls = [];



/*** DISPLAY ***/
const display = document.querySelector('#display');

function print (message) { display.innerHTML = message };



/*** PC TRACKER ***/
/* NOTE: move init display into pc tracker */
  // 12 | Ronin, dwarf cleric etc.
		// <span class='initiative'>12</span> | etc
		// span.addEventListener('click', editInitiative);
			// alterButton(addPCbutton, 'Fight!', addPC, setInitiativeOrder);
				// function setInitiativeOrder () {
				// 	attribute numbers to 'myPCs'
				// 	sort
				// 	print
				// 	revert 'addPCbutton'
				// }

/* Define HTML Elements */
const PCtrackerDiv = document.querySelector('#pc-tracker');
	const PCdiv = PCtrackerDiv.firstElementChild.firstElementChild.nextElementSibling;
	const PCtextarea = PCdiv.nextElementSibling;
	const addPCbutton = PCtextarea.nextElementSibling.nextElementSibling.nextElementSibling;
	const editPCbutton = addPCbutton.nextElementSibling;
	const removePCbutton = editPCbutton.nextElementSibling;


/* Original Event Listeners */
addPCbutton.addEventListener('click', addPC);
editPCbutton.addEventListener('click', editPC);
removePCbutton.addEventListener('click', removePC);


/* PC Storage */
// Retrieve previously stored PCs or create an empty array
const myPCs = [];
if (localStorage.pc) {
	getStorage(localStorage.pc, 'pc');
	printPCs();
}

// Take a string from local storage and convert it into an array
	// PC storage template: 'Player 1 name, details$%Player 2 name, details$%etc'
function getStorage (storage, type) {
	const storageSplit = storage.split('$%');

	// Separate initiative into name and init if needed, then push into 'array'
		// Init array template: [{name: 'P1', init: 1], [name: 'P2', init: 2], etc]
	storageSplit.forEach( function (val, ind) {
		if ( type === 'pc' ) myPCs.push(val);
		else {
			const itemSplit = val.split(': ');
			const item = {
				name: itemSplit[0],
				init: itemSplit[1]
			}
			initiative.push(item);
		};
	});
}


/* Add New PCs */
// Takes input, add it to PC array, store array in local storage, and print to page; called by 'Add PC' button
function addPC () {
	try {
		// To avoid bugs, disallow this function if currently editing or deleting PCs
		if (editPCbutton.textContent != 'Edit PC' || removePCbutton.textContent != 'Remove PC') return false;

		// Take input, add 'strong' tag to name, add to 'myPCs' array, and print the new array
		const input = PCtextarea.value.trim();
		if (!input) throw new Error('No PC information entered');
		const re = /(\w+),\s/;
		const message = input.replace(re, `<strong>$1,</strong> `);
		myPCs.push(message);
		printPCs();

		// Reset input field
		PCtextarea.value = '';
		PCtextarea.focus();

	} catch (err) { handler(err) };
}


/* Edit Existing PCs */
// Creates inline 'edit' buttons; called by 'Edit PC' button
function editPC () {
	// To avoid bugs, disallow function if currently deleting PCs or if no PCs are being displayed
	if (removePCbutton.textContent != 'Remove PC') return false;
	if (!PCdiv.childNodes.length) return false;

	// Change text content to 'Cancel' and alter alter event listeners
	alterButton(editPCbutton, 'Cancel', editPC, removeInlineButtons);

	// Add an 'edit' button to the div for each PC
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10000';
		b.className = 'inline-button';
		b.addEventListener('click', createEditDiv);
		pcDivs[i].appendChild(b);
	};
}

// Remove all inline buttons, and replace <p> element with <input>; called by an inline 'edit' button
function createEditDiv () {
	const target = this.parentNode;
	removeInlineButtons();

	alterButton(editPCbutton, 'Save Changes', removeInlineButtons, storeRevision);

	const textInput = document.createElement('input');
	textInput.type = 'text';
	textInput.className = 'edit-pc';
	textInput.value = target.textContent;
	PCdiv.replaceChild(textInput, target);
}

// Format and store the revision in 'myPCs', reprint 'myPCs', and revert 'Edit PC' button to original state
function storeRevision () {
	// Give 'strong' tags to the name in the new input
	const re = /(\w+),\s/;
	const input = PCdiv.querySelector('input').value;
	const message = input.replace(re, `<strong>$1,</strong> `);

	// Replace old entry with the revision
	PCdiv.childNodes.forEach( function (val, ind) {
		if (val.className === 'edit-pc') myPCs[ind] = message;
	});
	printPCs();

	alterButton(editPCbutton, 'Edit PC', storeRevision, editPC);
}


/* Delete Existing PCs */
// Creates inline 'delete' buttons; called by 'Remove PC' button
function removePC () {
	// To avoid bugs, disallow function if currently editing PCs or if no PCs are being displayed
	if (editPCbutton.textContent !== 'Edit PC') return false;
	if (!PCdiv.childNodes.length) return false;

	// Change text content to 'Cancel' and alter alter event listeners
	alterButton(removePCbutton, 'Cancel', removePC, removeInlineButtons);

	// Add a 'delete' button to the div for each PC
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10006';
		b.className = 'inline-button';
		b.addEventListener('click', deletePcFromArray);
		pcDivs[i].appendChild(b);
	};
}

// Inline 'delete' button will remove an entry from 'myPCs', reprint the array, and revert 'Remove PC' button
function deletePcFromArray () {
	const pc = this.previousSibling.textContent;
	myPCs.splice(myPCs.indexOf(pc), 1);
	printPCs();
	alterButton(removePCbutton, 'Remove PC', removeInlineButtons, removePC);
}


/* General Purpose PC Tracker Functions */
// Change a button text content and event listeners
function alterButton (button, newText, oldListener, newListener) {
	button.textContent = newText;
	button.removeEventListener('click', oldListener);
	button.addEventListener('click', newListener);
}

// Removes edit or remove buttons, reverts 'Cancel' button to 'Edit PC' or 'Remove PC'
function removeInlineButtons () {
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) { pcDivs[i].querySelector('button').remove() };

	if (editPCbutton.textContent === 'Cancel') alterButton(editPCbutton, 'Edit PC', removeInlineButtons, editPC);
	if (removePCbutton.textContent === 'Cancel') alterButton(removePCbutton, 'Remove PC', removeInlineButtons, removePC);
}

// Display PC array to page and save to local storage
function printPCs () {
	let children = PCdiv.childNodes;
	for (let i = children.length; i > 0; --i) { PCdiv.removeChild(children[i-1]) };
	for (let i = 0; i < myPCs.length; i++) {
		const p = document.createElement('p');
		p.className = 'hanging-indent';
		p.innerHTML = myPCs[i];
		PCdiv.appendChild(p);
	}
	storePlayerCharacters();
}

// Convert array items into strings for storage
function storePlayerCharacters () {
	if (!myPCs.length) return;
	let string = '';
	myPCs.forEach( function (pc) {
		if (string.length) string += '$%';
		string += pc;
	});
	localStorage.pc = string;
}





/*** INITIATIVE TRACKER */
/* Define HTML Elements */
const initiativeTracker = document.querySelector('#initiative');
	// Tracker left side
	const leftDiv = initiativeTracker.firstElementChild.firstElementChild.nextElementSibling;
	const name = leftDiv.firstElementChild.nextElementSibling;
	const init = name.nextElementSibling.nextElementSibling;
	// Tracker right side
	const rightDiv = leftDiv.nextElementSibling;
	const addInit = rightDiv.firstElementChild;
	const placeholder = addInit.nextElementSibling;
	const clearByNameInit = placeholder.nextElementSibling.nextElementSibling;
	const clearInit = clearByNameInit.nextElementSibling;
	// Tracker display
	const initDisplay = rightDiv.nextElementSibling.nextElementSibling;


/* Event Listeners */
addInit.addEventListener('click', addToInitiativeList );
placeholder.addEventListener('click', function () { return false } ); // Presently has no function, will likely remove
clearByNameInit.addEventListener('click', clearByName );
clearInit.addEventListener('click', clearInitiative );


/* Initiative Storage */
// Get stored initiative values or create an empty array for new ones
const initiative = [];
if (localStorage.initiative) {
	getStorage(localStorage.initiative, 'init');
	printInitiative();
}

/* Initiative User Interface */
// Take inputs, sort into 'initiative' array, update to localStorage, and print to page
function addToInitiativeList () {
	try {
		// Check for valid inputs
		if (!name.value) throw new Error('Please enter a name');
		if (!init.value || isNaN(init.value)) throw new Error('Please enter a valid initiative');

		// Store inputs, add them to 'initiative' array, and sort
		const input = {
			name: name.value,
			init: init.value
		}
		initiative.unshift(input);
		initiative.sort((a, b) => b.init - a.init);

		// Reset inputs and print
		clearInitInputs();
		printInitiative();

	} catch (err) {
		handler(err);
		printInitiative();
	}
}

// Placeholder button

// Clear a specific name based on current 'name.value'
	/* Unnecessary? */
function clearByName () {
	try {
		const input = name.value.toLowerCase();
		let found = false;
		initiative.forEach( function (person, i) {
			if (input === person.name.toLowerCase()) {
				initiative.splice(i, 1);
				found = true;
			}
		});
		if (!found) throw new Error('Name given was not found');
		clearInitInputs();
	} catch (err) {
		handler(err);
	} finally {
		printInitiative();
	}
}

// Clear all initiative values
function clearInitiative () {
	initiative.length = 0;
	delete localStorage.initiative;
	initDisplay.textContent = '';
}

// Convert 'initiative' array into readable message to display, and decodable message to store
function printInitiative () {
	let message = '';
	let storage = '';

	initiative.forEach( function (person, ind) {
		// Add a separator before every entry after the first
		if (ind !== 0) {
			message += ', ';
			storage += '$%';
		};
		message += `${person.name}: ${person.init}`;
		storage += `${person.name}: ${person.init}`;
	});

	localStorage.initiative = storage;
	initDisplay.textContent = message;
}

// Reset initiative inputs
function clearInitInputs () {
	name.value = '';
	init.value = '';
	name.focus();
}




/*** CALCULATOR ***/
// BUG: Pressing '+-' button is full of bugs
	// '56' then '+-' shows '-0'; evaluates to '-056' on '='
// NOTE: Add commas at proper places
	// Create a printCalc function to call
	// It will add commas to a new variable w/o altering calc.input or .rootNum

/* Define HTML Elements */
const calcDiv = document.querySelector('#calculator');
	const calcTable = calcDiv.firstElementChild.firstElementChild;

		const calcNodes = {
			calcDisp: calcTable.querySelector('input'),
			calcNum: calcTable.querySelectorAll('.number'),
			calcOp: calcTable.querySelectorAll('.operator'),
			calcOther: calcTable.querySelectorAll('.calc-func')
		}

		// Add event listeners for numbers and operators
		calcNodes.calcNum.forEach(
			function (node) { node.addEventListener('click', numberClick) });
		calcNodes.calcOp.forEach(
			function (node) { node.addEventListener('click', operatorClick) });

		// Add functionality to other buttons
			// CE, clear entry; display 0, reset calc.input, keep calc.rootNum
			calcNodes.calcOther[0].addEventListener('click', function () {
				e.preventDefault();
				calcNodes.calcDisp.value = 0;
				calc.input = '';
			});
			// C, clear; reset all values
			calcNodes.calcOther[1].addEventListener('click', function () {
				e.preventDefault();
				calcNodes.calcDisp.value = 0;
				calc.input = '';
				calc.rootNum = 0;
				calc.operator = 'plus';
			});
			// Backspace; remove last number from calc.input and display new value or 0
			calcNodes.calcOther[2].addEventListener('click', function () {
				e.preventDefault();
				calc.input = calc.input.substring(0, calc.input.length-1);
				if (calc.input) calcNodes.calcDisp.value = calc.input;
				else calcNodes.calcDisp.value = 0;
			});
			// Negation button; add or remove a '-' before rootNum
			/* NOTE: Display '-' more consistenly when dealing with negative nums */
			calcNodes.calcOther[3].addEventListener('click', function () {
				e.preventDefault();
				if (calc.rootNum[0] === '-') calc.rootNum = calc.rootNum.substring(1, calc.rootNum.length);
				else calc.rootNum = '-' + calc.rootNum;
				calcNodes.calcDisp.value = calc.rootNum;
			});

const calc = {
	rootNum: 0,
	input: '',
	operator: 'plus'
}

function numberClick (e) {
	e.preventDefault();

	// If '=' was just clicked, reset calc values
	if (calc.operator === 'equals') {
		calc.rootNum = 0;
		calc.operator = 'plus';
	}

	// Add number to calc.input, adding a 0 before solitary decimals
		// 'else if' statement prevents stringing multiple zeroes
	if (e.target.value !== '0') {
		if (e.target.value === '.' && calc.input === '') calc.input += '0';
		calcNodes.calcDisp.value = calc.input += e.target.value;
	} else if (calc.input !== '0') {
		calcNodes.calcDisp.value = calc.input += e.target.value;
	}
};

function operatorClick (e) {
	e.preventDefault();

	// Perform equation: [ rootNum (operator) input ]
	if (calc.input !== '') {
		switch (calc.operator) {
			case 'plus':
				if (calc.operator != 'equals') calc.rootNum += Number(calc.input);
				break;
			case 'minus':
				if (calc.operator != 'equals') calc.rootNum -= Number(calc.input);
				break;
			case 'times':
				if (calc.operator != 'equals') calc.rootNum *= Number(calc.input);
				break;
			case 'divide':
				if (calc.operator != 'equals') calc.rootNum /= Number(calc.input);
				break;
			case 'equals':
				if (calc.operator != 'equals') calc.rootNum = Number(calc.input);
				break;
			// default:
			// 	console.error('somethings wrong');
		}
	}

	// Display new value, set next operator, and reset input value
	calcNodes.calcDisp.value = calc.rootNum;
	calc.operator = e.target.name;
	calc.input = '';
}




/*** TABLE LOADER ***/
const tableLoader = document.querySelector('#tables');
	const tableSelect = tableLoader.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
	const tableButton = tableSelect.nextElementSibling;

tableButton.addEventListener('click', function () {
	if (tableSelect.value) img.src = `./images/${tableSelect.value}.jpg`;
	else img.display = 'none';
});




/*** LINKS TO OTHER RESOURCES ***/
const links = document.querySelector('#links');
	const linkButton = links.lastElementChild;
	const linkSelect = linkButton.previousElementSibling;

linkButton.addEventListener('click', function () { if (linkSelect.value) window.open(linkSelect.value, '_blank') });





/*** ERROR HANDLER ***/
function handler (err) {
	let message = `Error: ${err.message}`;
	print(message);
	console.error(err);
	return false;
}



/*** FOR THE FUTURE ***/
/* Make a button in header, a table in (tables), or selection in (links) that posts an alert giving tips on using the site */
	// PC tracker: double click initiative to change for next fight
	// Email for bugs, fixes, Suggestions
// Calculator
	// Button in header?
	// Just below or take place of init tracker?
// SRD Reference
	// Takes input, looks it up on SRD
	// open5e.com
