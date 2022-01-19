/**
 * Variables 
 */

let lifeExpectancy = 0; // years

let weeksToLive = 0;
let age = 0;
let sex = '';
let ageOfRetirement = 0;

let dataset = [];
let chart_options = {
	dot_radius : 5,
	no_of_circles_in_a_row: 70,
	dot_padding_left : 1.5,
	dot_padding_right : 1.5,
	dot_padding_top : 1.5,
	dot_padding_bottom : 1.5,
	div_selector: '#dotmatrix',
	chart_title: 'Life expectancy:',
	tooltip: true 
}

let finalChartOptions = { ...chart_options };
finalChartOptions.tooltip = false;
finalChartOptions.chart_title = 'Free time:';
let finalDataset = [];

/* Color palette */
let colorBlack		= "#333333";
let bgColor				= "#F8F1E5";
let colorLived		= "#FFA237";
let colorSleep		= "#93D360";
let colorWork			= "#FF3509";
let colorMedia		= "#50D1A3";
let colorAdmin		= "#AC2941";
let colorCustom1	= "#64C6C9";
let colorCustom2	= "#E8337F";
let colorCustom3	= "#5DCB89";
let colorCustom4	= "#E84C09";
let colorCustom5	= "#91CFD1";
let colorCustom6	= "#FF8800";
let colorCustom7	= "#5DCB8A";
let colorToLive		= "#167278";


/**
 * Sets reload position to top.
 */
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}

/**
 * Checks if screen is to small on load.
 */
window.addEventListener('load', () => {
	toggleMobileOverlay(window.innerWidth, window.innerHeight);
});

/**
 * Checks if screen is to small.
 */
function toggleMobileOverlay(vw, vh) {
	if(vw < 1060 || vh < 900) {
		showElement('mobile-overlay');
	} else {
		hideElement('mobile-overlay');
	}
}

/**
 * Listens to resize event and changes scrolling position and
 * chart setup accordingly.
 */
window.addEventListener('resize', debounce(function(e) {
	let viewportWidth = window.innerWidth;
	let viewportHeight = window.innerHeight;
	document.getElementsByClassName('active')[0].scrollIntoView( {behavior: 'smooth'} );
	DotMatrixChart(dataset, chart_options);
	toggleMobileOverlay(viewportWidth, viewportHeight);
}));


/**
 * Listens to keydown event and prevent tab key from working (with exceptions ond work page and custom).
 */
window.addEventListener("keydown", (e) => {
    if ((e.shiftKey == false && e.key == "Tab") && event.target.id != "work" && event.target.id != "customCategory") {
      e.preventDefault();
    }
  });

window.addEventListener("keydown", (e) => {
    if ((e.shiftKey && e.key == "Tab") && event.target.id != "ageOfRetirement" && event.target.id != "custom") {
      e.preventDefault();
    }
  });


/**
 * Enables submitting input data via enter key. 
 */
function enableEnterKey (inputId, buttonId) {
	let input = document.getElementById(inputId);

	input.addEventListener("keyup", function(event) {
		if (event.key == 'Enter') {
			document.getElementById(buttonId).click();
		}    
	}); 
}

enableEnterKey("age", "ageButton");
enableEnterKey("sleep", "sleepButton");
enableEnterKey("work", "workButton");
enableEnterKey("ageOfRetirement", "workButton");
enableEnterKey("media", "mediaButton");
enableEnterKey("admin", "adminButton");
enableEnterKey("customCategory", "customButton");
enableEnterKey("custom", "customButton");


/**
 * Debounces execution of a function. 
 */
function debounce(func) {
	let timer;
	return function(event) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(func,200,event);
	};
}

function changePage(from, to) {
	let nextPage = document.getElementById(to);
	nextPage.scrollIntoView({behavior: 'smooth'});
	nextPage.classList.add('active');
	document.getElementById(from).classList.remove('active');
}

function showElement(id) {
	let element = document.getElementById(id);
	element.classList.remove('hidden');
}

function hideElement(id) {
	let element = document.getElementById(id);
	element.classList.add('hidden');
}

function setContent(id, content) {
	let element = document.getElementById(id);
	element.innerHTML = content;
}

function setColor(id, color) {
    let element = document.getElementById(id);
    element.style.setProperty("--span-bg", color);
}

function fadeIn(id) {
	document.getElementById(id).classList.add('fade');
}

function setSex(input) {
	sex = input;
	let btnMale = document.getElementById('male');
	let btnFemale = document.getElementById('female');
	if (sex == 'male') {
		btnMale.classList.add('selected');
		btnFemale.classList.remove('selected');
	} else {
		btnMale.classList.remove('selected');
		btnFemale.classList.add('selected');
	}
}

const yearsToWeeks = (years) => parseInt(years) * 52;
const weeksToYears = (weeks) => (weeks / 52).toFixed(1);
const weeksToPercentage = (weeks) => (weeks / yearsToWeeks(lifeExpectancy) * 100).toFixed(1)


/**
 * Validates integer and returns integer or false if validation fails.
 */
function getValidInt(value) {
	if ( !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)) ) {
		return parseInt(value);
	}
	return false;
}

function getValidFloat(value) {
	return ( !isNaN(Number(value)) ) ? Number(value) : false;
}

function validate24(value) {
	return (getValidFloat(value) > 0 && getValidFloat(value) < 24);
}


/**
 * Checks if input isn't bigger than life expectancy.
 */
function validateRange(mode, numOfWeeks, category) {
	if (mode === 'insert') {
		return (numOfWeeks >= dataset[dataset.length - 1].count) ? false : true; 
	}
	if (mode === 'update') {
		existingDots = 0;
		for ( let i=0; i<dataset.length; i++ ) {
			if ( dataset[i].category == category ) {
				existingDots = dataset[i].count
			}
		}
		return (numOfWeeks >= dataset[dataset.length - 1].count + existingDots) ? false : true;
	}
}


/**
 * Prints/resets error messages.
 */
function printError(cat, msg, custom) {
	let error = "";
	if (custom) {
		error = document.getElementById('error-custom');
	} else {
		error = document.getElementById('error-' + cat);
	}
	error.classList.remove('hidden');
	error.innerHTML = msg;
}

function resetError(cat, custom) {
	let error = "";
	if (custom) {
		error = document.getElementById('error-custom');
	} else {
		error = document.getElementById('error-' + cat);
	}
	error.classList.add('hidden');	
	error.innerHTML = '';
}


/**
 * Builds initial waffle chart based on age and sex input.
 */
function initWaffle() {

	resetError('start');
	age = getValidInt(document.getElementById('age').value);

	if ( age > 0 ) {
		if (sex != '') {
			let url = "https://raw.githubusercontent.com/isabelvonah/lifescope/main/data/lifeexp_male.csv";
			if ( sex == 'female' ) { 
				url = "https://raw.githubusercontent.com/isabelvonah/lifescope/main/data/lifeexp_female.csv"	
			}
			showElement('waffle-wrap');

			d3.csv(url, function(data) {
				lifeExpectancy = Math.round( (data[new Date().getFullYear() - 1951][age]) ) + age;

				weeksToLive = yearsToWeeks(lifeExpectancy - age);
				let ageInWeeks = yearsToWeeks(age);

				dataset.push( {category: "lived", count: ageInWeeks, color: colorLived} );
				dataset.push( {category: "to live", count: weeksToLive, color: colorToLive} );

				DotMatrixChart( dataset, chart_options );

				changePage('landing-page', 'introduction-page');
				fadeIn('dotmatrix');
				fadeIn('fact-intro');
				fadeIn('info-intro');

				setContent('fact-intro', 
					`<span id='fact1'> ${ageInWeeks} weeks </span> of your life have already passed. 
					Yet, according to statistics, there are <span id='fact2'> ${weeksToLive} more weeks </span> awaiting you.`
				);
				setColor('fact1', colorLived);
				setColor('fact2', colorToLive);

			});

		} else {
			printError('start', 'Please select female or male');
		}
	} else {
		printError('start', 'Please enter your age in years...');
	}
}


/**
 * Returns single category object from dataset.
 */
function getCatObj(cat) {
	return dataset.filter(obj => { return obj.category == cat });
}


/**
 * Prints highlighted fact.
 */
function printFact(category) {
	let catObj = getCatObj(category);
	switch(category) {
		case 'sleep':
			console.log(dataset);
			setContent('fact-sleep', `Alright, you will sleep for another <span>${catObj[0].count} weeks</span>.`);
      setColor('fact-sleep', colorSleep);
			fadeIn('fact-sleep');
			break;
		case 'work':
			setContent('fact-work', `You have <span>${catObj[0].count} weeks</span> of work ahead of you.`);
      setColor('fact-work', colorWork);
			fadeIn('fact-work');
			break;
		case 'media':
			setContent('fact-media', `Your media consumtion sums up to around <span>${catObj[0].count} weeks</span>.`);
      setColor('fact-media', colorMedia);
			fadeIn('fact-media');
			break;
		case 'admin':
			setContent('fact-admin', `These small things will cost you another <span>${catObj[0].count} weeks</span>.`);
      setColor('fact-admin', colorAdmin);
			fadeIn('fact-admin');
			break;
	}
}


/** 
 * Updates waffle chart.
 */
function updateWaffle(category, color, custom=false) { 
	let numOfWeeks = 0;
	let input = "";

	if (custom) {
		input = getValidFloat(document.getElementById("custom").value);
	} else {
		input = getValidFloat(document.getElementById(category).value);
	}

	if (category == 'sleep' || category == 'media' || category == 'admin' || custom) {

		if(validate24(input) || (input === 0 && category != 'sleep')) {
			resetError(category, custom);
			numOfWeeks = Math.round(input / 24 * weeksToLive);
		} else {
			printError(category, 'Please enter a valid number of hours', custom);
			return;
		}

	} else if (category == 'work') {

		ageOfRetirement = getValidInt(document.getElementById('ageOfRetirement').value);

		if ((input && input < 168 && ageOfRetirement) || input === 0) {
			resetError(category, custom);

			if (ageOfRetirement > age) {
				numOfWeeks = Math.round(input / 168 * 47 * (ageOfRetirement - age));
			} 

		} else {
			printError(category, 'Please enter a valid number of working hours and age of retirement', custom);
      return;
		}

	} 

	// Checks if category exists and input isn't to big.
	if ( JSON.stringify(dataset).indexOf(category) > -1 && validateRange("update", numOfWeeks, category) ) {
		for ( let i=0; i<dataset.length; i++ ) {
			if ( dataset[i].category == category ) {
				diff = dataset[i].count - numOfWeeks;
				dataset[dataset.length - 1].count += diff;
				dataset[i].count = numOfWeeks;
			}
		}
		printFact(category);
		if (!custom) {
			showElement('arrow-' + category);
		}
	} else if (validateRange("insert", numOfWeeks, category)) {
		dataset.splice( dataset.length - 1, 0, {category: category, count: numOfWeeks, color: color} );
		dataset[dataset.length - 1].count -= numOfWeeks;
		printFact(category);
		if (!custom) {
			showElement('arrow-' + category);
		}
	} else {
		printError(category, "Please enter a smaller number");
	}

	DotMatrixChart( dataset, chart_options );
}


/**
 * Handles colors for custom categories before updateWaffle().
 */
let colors = [colorCustom7, colorCustom6, colorCustom5, colorCustom4, colorCustom3, colorCustom2, colorCustom1];

function updateWaffleCustom() {
	let customCategory = document.getElementById('customCategory').value;

	// Checks if category exists and updates or inserts category.
	if ( JSON.stringify(dataset).indexOf(customCategory) > -1) {
		for ( let i=0; i<dataset.length; i++ ) {
			if ( dataset[i].category == customCategory ) {
				updateWaffle(customCategory, dataset[i].color, true);
			}
		}
	} else {        
		updateWaffle(customCategory,colors.pop(), true);
	}
}


/**
 * Constructs a new chart containing just the last category when navigating to final page.
 */
function constructFinalWaffle() {
	finalDataset = [];
	finalDataset.push({category: "free time", count: dataset[dataset.length -1].count, color: colorToLive});

	setContent('fact-summary', `That's it, you have <span>${finalDataset[0].count} weeks</span> of free time left.`)
    setColor('fact-summary', colorToLive);
	DotMatrixChart( finalDataset, finalChartOptions);

}


/**
 * Adds or removes weeks based on selected button. 
 */
function setDepriButton(selected, id, weeks) {
	let yes = document.getElementById(id + '-yes');
	let no = document.getElementById(id + '-no');

	if (weeks + 80 <= weeksToLive) {
		resetError('depri');
		if (selected) {
			if (!yes.classList.contains('selected')) {
				finalDataset[0].count -= weeks;
			}
			yes.classList.add('selected');
			no.classList.remove('selected');
		} else {
			if (!no.classList.contains('selected')) {
				finalDataset[0].count += weeks;
			}
			no.classList.add('selected');
			yes.classList.remove('selected');
		}
	} else {
		printError('depri', "Ups, there are less than 0 weeks left. That doesn't seem right, we know... Sorry, but our rough calculations aren't made for edge cases like yours.");
	}
	DotMatrixChart(finalDataset, finalChartOptions);
}
