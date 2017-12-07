//HTML elements
//Left div
//Dice
const diceDiv = document.querySelector('#dice');
	const diceButtons = diceDiv.firstElementChild.querySelectorAll('button');
	const rollButton = Array.from(diceButtons).shift();
	const diceInput = rollButton.previousElementSibling;

//Display
const display = document.querySelector('#display');

//PC Tracker
const PCtrackerDiv = document.querySelector('#pc-tracker');
	const PCdiv = PCtrackerDiv.firstElementChild.firstElementChild.nextElementSibling;
	const PCtextarea = PCdiv.nextElementSibling;
	const addPCbutton = PCtextarea.nextElementSibling.nextElementSibling.nextElementSibling;
	const editPCbutton = addPCbutton.nextElementSibling;
	const removePCbutton = editPCbutton.nextElementSibling;

//Right div
//Initiative Tracker
const initiativeTracker = document.querySelector('#initiative');
	//Left side
	const leftDiv = initiativeTracker.firstElementChild.firstElementChild.nextElementSibling;
	const name = leftDiv.firstElementChild.nextElementSibling;
	const init = name.nextElementSibling.nextElementSibling;
	//Right side
	const rightDiv = leftDiv.nextElementSibling;
	const addInit = rightDiv.firstElementChild;
	const sortInit = addInit.nextElementSibling;
	const clearByNameInit = sortInit.nextElementSibling.nextElementSibling;
	const clearInit = clearByNameInit.nextElementSibling;
	//Display
	const initDisplay = rightDiv.nextElementSibling.nextElementSibling;

//Tables
const tables = document.querySelector('#tables');
	const select = tables.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
	const button = select.nextElementSibling;
	const img = button.nextElementSibling.nextElementSibling;

//Footer
//Other Resources
const links = document.querySelector('#links');
const linkButton = links.lastElementChild;
const linkSelect = linkButton.previousElementSibling;

//Event listeners
	//Left div
rollButton.addEventListener('click', function () {
	print(getInputValues(diceInput.value));
});
for (let i = 1; i < diceButtons.length; i++) {
	diceButtons[i].addEventListener('click', function () {
		// Print die roll for selected button (value, number of dice, die sides)
		print( rollDice( `1d${diceButtons[i].value}`, [1], [diceButtons[i].value] ) )
	});
}

//PC Tracker

// const storagePC = 'Ronin, cleric$%Draco, monk';
const myPCs = storageToArray(localStorage.pc) || [];

// Take a local storage string and convert it into an array
function storageToArray (storage, type) {
	if (!storage.length) { return false };
	const array = [];
	const storageSplit = storage.split('$%');
	for (let i = 0; i < storageSplit.length; i++) {
		if (type === 'initiative') {
			const itemSplit = storageSplit[i].split(': ');
			const item = {
				name: itemSplit[0],
				init: itemSplit[1]
			}
			array.push(item);
		} else {
			array.push(storageSplit[i]);
		}
	}
	return array;
}

// Convert array items into strings for storage
function setLocalStorage () {
	if (!myPCs.length) return;
	let string = myPCs[0];
	for (let i = 1; i < myPCs.length; i++) { string += `$%${myPCs[i]}` };
	localStorage.pc = string;
}

// **only makes one name bold
// Add PC button will take input, add it to PC array, store array in local storage, and print to page
function addPC () {
	// Take user input and display in the box above
	if (editPCbutton.textContent != 'Edit PC'
			|| removePCbutton.textContent != 'Remove PC')
				return false;
	const input = PCtextarea.value.trim();
	if (!input) return false;
	const re = /(\w+),\s/;
	const message = input.replace(re, `<strong>$1,</strong> `);
	myPCs.push(message);
	PCtextarea.value = '';
	PCtextarea.focus();
	printPCs();
}

// On clicking 'Edit PC' button, create inline 'edit' buttons
function editPC () {
	if (removePCbutton.textContent != 'Remove PC') return false;
	if (!PCdiv.childNodes.length) return false;

	alterButton(editPCbutton, 'Cancel', editPC, removeElementButtons);

	let children = PCdiv.children;
	for (let i = 0; i < children.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10000';
		b.className = 'inline-button';
		b.addEventListener('click', createEditDiv);
		children[i].appendChild(b);
	}
}

// On clicking inline 'edit' button, replace p element with input
function createEditDiv () {
	const element = this.parentNode;
	removeElementButtons();
	alterButton(editPCbutton, 'Save Changes', removeElementButtons, saveEdit);

	const input = document.createElement('input');
	input.type = 'text';
	input.className = 'edit-pc';
	input.value = element.textContent;
	PCdiv.replaceChild(input, element);
}

// On clicking 'Save Changes' button, save input in array and print to page
function saveEdit () {
	const re = /(\w+),\s/;
	const input = PCdiv.querySelector('input').value;
	const message = input.replace(re, `<strong>$1,</strong> `);

	PCdiv.childNodes.forEach( function (v,i) {
		if (v.className === 'edit-pc') myPCs[i] = message;
		console.log(myPCs[i]);
	});

	alterButton(editPCbutton, 'Edit PC', saveEdit, editPC);

	printPCs();
}

function removePC () {
	if (editPCbutton.textContent !== 'Edit PC') return false;
	if (!PCdiv.childNodes.length) return false;

	alterButton(removePCbutton, 'Cancel', removePC, removeElementButtons);

	let children = PCdiv.children;
	for (let i = 0; i < children.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10006';
		b.className = 'inline-button';
		b.addEventListener('click', deletePcFromArray);
		children[i].appendChild(b);
	}
}

// Inline 'delete' button will remove an entry from the array
function deletePcFromArray () {
	const pc = this.previousSibling.textContent;
	myPCs.splice(myPCs.indexOf(pc), 1);
	printPCs();
	alterButton(removePCbutton, 'Remove PC', removeElementButtons, removePC);
}

// Change a button based on passed arguments
function alterButton (element, text, remove, add) {
	element.textContent = text;
	element.removeEventListener('click', remove);
	element.addEventListener('click', add);
}

// Removes edit or remove buttons
function removeElementButtons () {
	let children = PCdiv.children;
	for (let i = 0; i < children.length; i++) { children[i].querySelector('button').remove() };

	if (editPCbutton.textContent === 'Cancel') {
		alterButton(editPCbutton, 'Edit PC', removeElementButtons, editPC)
	};
	if (removePCbutton.textContent === 'Cancel') {
		alterButton(removePCbutton, 'Remove PC', removeElementButtons, removePC)
	};
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
	setLocalStorage();
}

// Print previously saved characters on page load
printPCs();

addPCbutton.addEventListener('click', addPC);
editPCbutton.addEventListener('click', editPC);
removePCbutton.addEventListener('click', removePC);

	//Right div
addInit.addEventListener('click', function () { initDisplay.innerHTML = addToInitiativeList() });
sortInit.addEventListener('click', function () { initDisplay.innerHTML = sortInitiative() });
clearByNameInit.addEventListener('click', function () { initDisplay.innerHTML = clearByName() });
clearInit.addEventListener('click', function () { initDisplay.innerHTML = clearInitiative() });

button.addEventListener('click', function () {
	if (select.value) img.src = `./images/${select.value}.jpg`;
	else img.display = 'none';
});

	//Footer
linkButton.addEventListener('click', function () {
	if (linkSelect.value) { window.open(linkSelect.value, '_blank') }
});

//Print function
function print (message) { display.innerHTML = message; }
