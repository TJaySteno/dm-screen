//HTML elements
//Left div
//Dice
const diceDiv = document.querySelector('.dice');
	const diceButtons = diceDiv.firstElementChild.querySelectorAll('button');
	const rollButton = Array.from(diceButtons).shift();
	const diceInput = rollButton.previousElementSibling;

//Trash Talk
const left = document.querySelector('.left');

const trashTalk = document.querySelector('.trash-talk');
	const trash = trashTalk.firstElementChild.lastElementChild;
	const trashTalkSelect = trash.previousElementSibling;

//Display
const display = document.querySelector('.display');

//Right div
//Initiative Tracker
const initiativeTracker = document.querySelector('.initiative');
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
	
//Other Resources
const links = document.querySelector('.links');
	const linkButton = links.firstElementChild.lastElementChild;
	const linkSelect = linkButton.previousElementSibling;

//Tables
const tables = document.querySelector('.tables');
	const select = tables.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
	const button = select.nextElementSibling;
	const img = button.nextElementSibling.nextElementSibling;

//Event listeners
	//Left div
trash.addEventListener('click', function () { print(getTrashTalk()); });
rollButton.addEventListener('click', function () { 
	print(getInputValues(diceInput.value)); 
});
for (let i = 1; i < diceButtons.length; i++) {
	diceButtons[i].addEventListener('click', function () { print(rollDice(`1d${diceButtons[i].value}`, [1], [diceButtons[i].value])) });
}

linkButton.addEventListener('click', function () {
	if (linkSelect.value) { window.open(linkSelect.value, '_blank') }
});

	//Right div
addInit.addEventListener('click', function () { initDisplay.innerHTML = addToList() });
sortInit.addEventListener('click', function () { initDisplay.innerHTML = sortInitiative() });
clearByNameInit.addEventListener('click', function () { initDisplay.innerHTML = clearByName() });
clearInit.addEventListener('click', function () { initDisplay.innerHTML = clearInitiative() });

button.addEventListener('click', function () {
	const input = select.value;
	img.src = `./images/${input}.jpg`;
});

//Print function
function print (message) { display.innerHTML = message; }