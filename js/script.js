const lifeExpectancy = 75 // years

let weeksToLive = 0;
let age = 0;
let ageOfRetirement = 0;

let viewportWidth = window.innerWidth;

/**
 * Delays execution of a function.
 */
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function debounce(func){
  let timer;
  return function(event){
    if(timer) clearTimeout(timer);
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
 * checks if the input is an integer and edits the chosen error statement accordingly
 */
function validateInt(text, errorId) {
    if (isNaN(parseInt(text))) {
        document.getElementById(errorId).innerHTML = `Please enter an integer!`;
        return false;
    }
    else { 
        document.getElementById(errorId).innerHTML = ``;
        return true;
    }
}

/**
 * checks if the input is a float and edits the chosen error statement accordingly
 */
 function validateFloat(text, errorId) {
    if (isNaN(parseFloat(text))) {
        document.getElementById(errorId).innerHTML = `Please enter a number!`;
        return false;
    } else {
        document.getElementById(errorId).innerHTML = ``;
        return true;
    }
}

/**
 * checks if the input is between 0 and 24 and edits the chosen error statement accordingly
 */
function validate24(inputNumber, errorId) {
    if (parseFloat(inputNumber) > 0 && parseFloat(inputNumber) < 24.00) {
        document.getElementById(errorId).innerHTML = ``;
        return true;
    } else {
        document.getElementById(errorId).innerHTML = `Please enter a number between 0 and 24!`;
        return false;
    }
}

function validateRange(mode, numOfWeeks, category, errorId) {
    if (mode === 'insert') {
        if (numOfWeeks >= dataset[dataset.length - 1].count) {
            document.getElementById(errorId).innerHTML = `Please enter a smaller number! You don't have that much time ;)`;
            return false;
        } else {
            document.getElementById(errorId).innerHTML = ``;
            return true;
        }
    }
    if (mode === 'update') {
        existingDots = 0;
        for ( let i=0; i<dataset.length; i++ ) {
            if ( dataset[i].category == category ) {
                existingDots = dataset[i].count
            }
        }
        if (numOfWeeks >= dataset[dataset.length - 1].count + existingDots) {
            document.getElementById(errorId).innerHTML = `Please enter a smaller number! You don't have that much time ;)`;
            return false;
        } else {
            document.getElementById(errorId).innerHTML = ``;
            return true;
        }
    }
    
}

/**
 * sets the reload position to top
 */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


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
 * Updates waffle chart options based on viewport width.
 */
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
 * connects input and belonging button so that enter key triggers a click
 */
function enableEnterKey (inputId, buttonId) {
    var input = document.getElementById(inputId);

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
    if (event.key == 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById(buttonId).click();
    }    }); 
}

//connecting all inputs and buttons
enableEnterKey("age", "ageButton");
enableEnterKey("sleep", "sleepButton");
enableEnterKey("travelling", "travellingButton");
enableEnterKey("working", "workingButton");
enableEnterKey("ageOfRetirement", "workingButton");

/**
 * constructs waffle chart after age input
 * This function is considered to be called exclusively on the landing page (because of the hard-coded changePage()).
 */
function constructWaffle() {
	let age = document.getElementById("age").value;
    
    // only constructs the waffle chart (and changes the page) if input is an ineger
    if (validateInt(age, 'error-landing-page')) {
        document.getElementById('error-landing-page').innerHTML = ``;
        let ageInWeeks = yearsToWeeks(age);
        weeksToLive = yearsToWeeks(lifeExpectancy - parseInt(age));

        updateWaffleOptions(viewportWidth);
        if (age < 75) {
            dataset.push({category: "lived", count: ageInWeeks, color: "#fd6041"});
            dataset.push({category: "to live", count: weeksToLive, color: "#0c5374"});
            
            // delays chart load to wait for scrolling to next position
            delay(500).then(() => 
                DotMatrixChart( dataset, chart_options )
            );
        }

        changePage('landing-page', 'page1');

        document.getElementById("introduction1").innerHTML = `According to ~~Quelle~~ your life expectancy is ${lifeExpectancy} years.`
        document.getElementById("introduction2").innerHTML = `So <b>${weeksToPercentage(ageInWeeks)} %</b> of your life are already over!`

        // TODO: else {print "Congratulations, your reached a very nice age."} 
    }
}


/** 
 * updates waffle chart
 */
function updateWaffle(category, color, errorId) { 
    let input = document.getElementById(category).value;

    // only updates the waffle chart if input has the type float
    if (validateFloat(input, errorId)) { 
        document.getElementById(errorId).innerHTML = ``;   
        let numOfWeeks = 0;
        
        // mostly input is hours per day (see else)... exception: working (hours per week):
        if (category === "working") {
            // sets (global variable) ageOfRetirement
            let aor = document.getElementById("ageOfRetirement").value;
            if (validateInt(aor, "error-aor")) {ageOfRetirement = parseInt(aor);}

            // proportion: input (working hours per week) / 168 (hours per week) = numOfWeeks / working weeks until retirement (47 * (ageOfRetirement - age))
            numOfWeeks = parseInt(input / 168 * 47 * (ageOfRetirement - age));
        } else {
            if ( validate24(input, errorId)) {
                // proportion: numOfHours / 24 = numOfWeeks / weeksToLive
                numOfWeeks = parseInt(input / 24 * weeksToLive);
            } else { return }
        }

        // checks if category is part of dataset
        if ( JSON.stringify(dataset).indexOf(category) > -1 ) {
            if (validateRange("update", numOfWeeks, category, errorId)) {
                for ( let i=0; i<dataset.length; i++ ) {
                    if ( dataset[i].category == category ) {
                        // calcs diff from given input and existing value
                        diff = dataset[i].count - numOfWeeks;
                        dataset[dataset.length - 1].count += diff;
                        dataset[i].count = numOfWeeks;
                    }
                }
            }
        } else {
            if (validateRange("insert", numOfWeeks, category, errorId)) {
                // adds new category at index n-1
                dataset.splice( dataset.length - 1, 0, {category: category, count: numOfWeeks, color: color} );
                dataset[dataset.length - 1].count -= numOfWeeks;
            }

        }
        DotMatrixChart( dataset, chart_options );
    }
}


