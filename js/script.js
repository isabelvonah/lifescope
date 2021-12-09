let lifeExpectancy = 0; // years

let weeksToLive = 0;
let age = 0;
let ageOfRetirement = 0;

let dataset = [];
let chart_options = {
	dot_radius : 4.5,
	no_of_circles_in_a_row: 70,
	dot_padding_left : 2,
	dot_padding_right : 2,
	dot_padding_top : 2,
	dot_padding_bottom : 2,
	div_selector: '#dotmatrix',
	tooltip: true 
 }


/**
 * Sets reload position to top.
 */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


/**
 * Updates waffle chart options based on viewport width.
 */
let viewportWidth = window.innerWidth;

function updateWaffleOptions(viewportWidth) {
	if (viewportWidth < 1550) {
		chart_options.dot_radius = 3.5;
		chart_options.dot_padding_left = 1;
		chart_options.dot_padding_right = 1;
		chart_options.dot_padding_top = 1;
		chart_options.dot_padding_bottom = 1;
	} else {
		chart_options.dot_radius = 5;
		chart_options.dot_padding_left = 1.5;
		chart_options.dot_padding_right = 1.5;
		chart_options.dot_padding_top = 1.5;
		chart_options.dot_padding_bottom = 1.5;
	}
}


/**
 * Delays execution of a function.
 */
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function debounce(func) {
  let timer;
  return function(event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func,200,event);
  };
}

function changePage(from, to) {
	let nextPage = document.getElementById(to);
  nextPage.scrollIntoView({behavior: "smooth"});
	nextPage.classList.add('active');
	document.getElementById(from).classList.remove('active');
}

function showButton(id) {
  let element = document.getElementById(id);
  element.classList.remove("hidden");
}

const yearsToWeeks = (years) => parseInt(years) * 52;
const weeksToYears = (weeks) => (weeks / 52).toFixed(1);
const weeksToPercentage = (weeks) => (weeks / yearsToWeeks(lifeExpectancy) * 100).toFixed(1)


/**
 * Validator functions.
 */
function validateInt(value) {
	return Number.isInteger(value);
}

function validateFloat(value) {
	return !isNaN(value)
}

function validate24(value) {
	return (validateFloat(value) && value > 0 && value < 24);
}

/**
 *
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
function printError(cat, msg) {
  let error = document.getElementById('error-' + cat);
	error.innerHTML = msg;
}

function resetError(cat) {
  let error = document.getElementById('error-' + cat);
	error.innerHTML = '';
}


/**
 * Listens to resize event and changes scrolling position and
 * chart setup accordingly.
 */
window.addEventListener("resize",debounce(function(e){
	let viewportWidth = window.innerWidth;
	document.getElementsByClassName('active')[0].scrollIntoView({behavior: "smooth"});
	updateWaffleOptions(viewportWidth);
	DotMatrixChart( dataset, chart_options )
}));

/**
 * Builds initial waffle chart based on age and sex input.
 */
function buildWaffle(data) {

    let currentLifeExpectancy = data[new Date().getFullYear() - 1951][age];
    console.log(currentLifeExpectancy);
    lifeExpectancy = Math.round(currentLifeExpectancy) + age;
    console.log(lifeExpectancy);

    resetError('start');
    updateWaffleOptions(viewportWidth);
    let ageInWeeks = yearsToWeeks(age);
    console.log(age, lifeExpectancy);
    weeksToLive = yearsToWeeks(lifeExpectancy - age);

    dataset.push( {category: "lived", count: ageInWeeks, color: "#fd6041"} );
    dataset.push( {category: "to live", count: weeksToLive, color: "#0c5374"} );
    // Waits for finished scrolling event before building chart.
    delay(500).then(() => 
        DotMatrixChart( dataset, chart_options )
    );

}

/**
 * Evaluates age and sex input and (if validated) builds waffle chart.
 */
function constructWaffle() {
	age = parseInt(document.getElementById('age').value);
    let female = document.getElementById('female').checked;
    console.log(female)

	if (validateInt(age) && age > 0 && female) {

        d3.csv("../data/lifeexp_female.csv", function(data) {
            buildWaffle(data);
        });
        changePage('landing-page', 'page1');

    } else if (validateInt(age) && age > 0 && female===false) {

        d3.csv("../data/lifeexp_male.csv", function(data) {
            buildWaffle(data)
        });
        changePage('landing-page', 'page1');

    } else {
			printError('start', 'Please enter your age in years...');
		}
}


/** 
 * Updates waffle chart.
 */
function updateWaffle(category, color) { 
	let input = document.getElementById(category).value;
	let numOfWeeks = 0;
	
	if (category == 'sleep' || category == 'travelling') {

		input = parseFloat(input);
		if(validate24(input)) {
			resetError(category);
      numOfWeeks = Math.round(input / 24 * weeksToLive);
		} else {
			printError(category, 'Please enter a valid number of hours');
			return;
		}

	} else if (category == 'working') {

		ageOfRetirement = parseInt(document.getElementById('ageOfRetirement').value);
		input = parseFloat(input);

		if (validateFloat(input) && input < 168 && validateInt(ageOfRetirement)) {
			resetError(category);
			if (ageOfRetirement > age) {
				numOfWeeks = Math.round(input / 168 * 47 * (ageOfRetirement - age));
			} 
		} else {
			printError(category, 'Please enter a valid number of working hours and age of retirement');
			return;
		}

	}

	/**
	 * Checks if category exists and input isn't to big.
	 */
	if ( JSON.stringify(dataset).indexOf(category) > -1 && validateRange("update", numOfWeeks, category) ) {
		for ( let i=0; i<dataset.length; i++ ) {
			if ( dataset[i].category == category ) {
				diff = dataset[i].count - numOfWeeks;
				dataset[dataset.length - 1].count += diff;
				dataset[i].count = numOfWeeks;
			}
		}
	} else if (validateRange("insert", numOfWeeks, category)) {
		dataset.splice( dataset.length - 1, 0, {category: category, count: numOfWeeks, color: color} );
		dataset[dataset.length - 1].count -= numOfWeeks;
	} else {
		printError(category, "Please enter a smaller number, you don't have that much time left...");
	}

	DotMatrixChart( dataset, chart_options );
}


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
enableEnterKey("travelling", "travellingButton");
enableEnterKey("working", "workingButton");
enableEnterKey("ageOfRetirement", "workingButton");


// let finalDataset = [];
// let finalChartOptions = chart_options;

/**
 * constructs a new chart containing just the last category when navigating to final page
function constructFinalWaffle () {
    finalDataset.push({category: "to live", count: dataset[dataset.length -1], color: "#0c5374"});

    finalChartOptions = chart_options;
    finalChartOptions.dot_radius += 1.5;
    finalChartOptions.no_of_circles_in_a_row -= 10;

    DotMatrixChart( finalDataset, chart_options );

    //TODO: Make it work ;)
    //TODO: hide legend...?
}

/**
 * constructs the main chart again when navigating back from final page
function constructWaffleAgain () {

    finalChartOptions.dot_radius -= 1.5;
    finalChartOptions.no_of_circles_in_a_row += 10;

    DotMatrixChart( dataset, chart_options );
}

*/
