/*
change dice to simple input
	'1d20+4' or '2d6+7'
	slice strings in order to 

charts: improvising dmg, trap save dcs, attack bonuses against PCs(?), dmg severity by level, pot of healing breakdowns, concentration checks, PCs passive perception, name generator

DM binder: prep notes, rules cheat sheet, books nearby, breakdown of current and past sessions, sheets for custom npcs, monsters may/will/have encounter(ed), breakdowns of various locations (npcs, factions, etc), lists of names (m/f, every race)

notepad: cool moments from PCs (maybe to award bonus experience, cool item, etc), NPCs/locations/etc you just made up

other: miniatures, dice, timer (to up the ante; give players a limited time to sort things out), wet erase markers, status markers (pog-like things? pieces of paper? pop tabs?), music (phone and bluetooth speaker), spell size templates

fighter lvl 1 - http://media.wizards.com/downloads/dnd/StarterSet_Charactersv2.pdf
PHB errata - http://media.wizards.com/2017/dnd/downloads/PH-Errata.pdf
MM errata - http://dnd.wizards.com/sites/default/files/media/MM-Errata.pdf
DMG errata - http://dnd.wizards.com/sites/default/files/media/DMG-Errata.pdf
5e conversion guide - http://media.wizards.com/2015/downloads/dnd/DnD_Conversions_1.0.pdf
DM basic rules - http://dnd.wizards.com/products/tabletop/dm-basic-rules
Magic items by rarity - http://media.wizards.com/2014/downloads/dnd/MagicItemsRarity_printerfriendly.pdf
Monsters by CR - http://media.wizards.com/2014/downloads/dnd/MM_MonstersCR.pdf
Monsters by type - http://media.wizards.com/2015/downloads/dnd/DnD_MonstersByType_1.0.pdf
Spell lists (class, school, level) - http://media.wizards.com/2015/downloads/dnd/DnD_SpellLists_1.01.pdf
Ranger revised - http://media.wizards.com/2016/dnd/downloads/UA_RevisedRanger.pdf
Prestige classes - http://media.wizards.com/2015/downloads/dnd/UA_Rune_Magic_Prestige_Class.pdf
Light, dark, underdark - https://media.wizards.com/2015/downloads/dnd/02_UA_Underdark_Characters.pdf
Feats - http://media.wizards.com/2016/downloads/DND/UA-Feats-V1.pdf
Quick characters - http://media.wizards.com/2016/downloads/DND/UA_Quick_PCs_SFG.PDF
Encounter building - http://media.wizards.com/2016/dnd/downloads/Encounter_Building.pdf
Barbarian primal paths - http://media.wizards.com/2016/dnd/downloads/UA_Barbarian.pdf
Bard colleges - http://media.wizards.com/2016/dnd/downloads/UA_Bard.pdf
Cleric domains - http://media.wizards.com/2016/dnd/downloads/UA_Cleric.pdf
Druid circles and Wild Shape - http://media.wizards.com/2016/dnd/downloads/UA_Druid11272016_CAWS.pdf
Martial Archetypes - http://media.wizards.com/2016/dnd/downloads/2016_Fighter_UA_1205_1.pdf
Monastic traditions - http://media.wizards.com/2016/dnd/downloads/M_2016_UAMonk1_12_12WKWT.pdf
Sacred Oaths - http://dnd.wizards.com/articles/unearthed-arcana/paladin-sacred-oaths
Artificer - http://media.wizards.com/2016/dnd/downloads/1_UA_Artificer_20170109.pdf
Ranger/Rogue add-ons - http://media.wizards.com/2016/dnd/downloads/2017_01_UA_RangerRogue_0117JCMM.pdf
Mass combat - http://media.wizards.com/2017/dnd/downloads/2017_UAMassCombat_MCUA_v1.pdf
Traps revisited - http://media.wizards.com/2017/dnd/downloads/0227_UATraps.pdf
Mystic (psyonic) - http://media.wizards.com/2017/dnd/downloads/UAMystic3.pdf
Downtime - http://media.wizards.com/2017/dnd/downloads/UA_Downtime.pdf
Exploration, social, combat exp - http://media.wizards.com/2017/dnd/downloads/UA-ThreePillarXP.pdf
Eladrin & Gith - https://media.wizards.com/2017/dnd/downloads/UA-Eladrin-Gith.pdf
*/


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
	console.log(numOfDice);
	console.log(dieSides);
	console.log(modifier);
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
	for (let i = 0; i < mod.length; i++) {
		message += `, +${mod[i]}`;
		sum += mod;
	};
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

//Trash Talk
function getTrashTalk () {
	const input = trashTalkSelect.value.toUpperCase();
	let raceData = data[input];
	let message = '<ul>';
	let prompt;
	if (input === 'HALFELF' || input === 'HALFORC') {
		const subrace = input[4]+input[5]+input[6];
		do {
			prompt = window.prompt(`Are you a 'human', an '${subrace.toLowerCase()}', or 'neither'? Just enter the first letter.`).toUpperCase();
		} while ( prompt !== 'H' && prompt !== subrace[0] && prompt !== 'N' && 
							prompt !== 'HUMAN' && prompt !== subrace && prompt !== 'NEITHER' );
		if (prompt != subrace[0] && prompt != subrace) {
			raceData = raceData.concat(data[subrace]);
		} else if (prompt != 'H' && prompt != 'HUMAN') {
			raceData = raceData.concat(data['HUMAN']);
		}
	}
	const length = raceData.length;
	for (let i = 0; i < 5; i++) {
		let random = d(length)-1;
		message += `<li>${raceData[random]}</li>`;
	}
	message += '</ul>';
	return message;
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