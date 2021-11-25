const lifeExpectancy = 75 // years

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
        return true;}
}

/**
 * checks if the input is an integer and edits the chosen error statement accordingly
 */
 function validateFloat(text, errorId) {
    if (isNaN(parseFloat(text))) {
        document.getElementById(errorId).innerHTML = `Please enter a number!`;
        return false;
    }
    else { 
        document.getElementById(errorId).innerHTML = ``;
        return true;}
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
let weeksToLive = 0;
let viewportWidth = window.innerWidth;

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
 * constructs waffle chart after age input
 * This function is considered to be called exclusively on the landing page (because of the hard-coded changePage()).
 */
function constructWaffle() {
	let age = document.getElementById("age").value;
    
    // only constructs the waffle chart (and changes the page) if input is an ineger
    if (validateInt(age, 'error-landing-page')) {
        let ageInWeeks = yearsToWeeks(age);
        weeksToLive = yearsToWeeks(lifeExpectancy - parseInt(age));

        updateWaffleOptions(viewportWidth);
        if (age < 75) {
            dataset.push({category: "lived", count: ageInWeeks, color: "#fb8d46"});
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
 * Updates waffle chart. 
 * Adds or updates given category without changing the total number of dots.
 */
function updateWaffle(category, color, errorId) { 
    let numOfHours = document.getElementById(category).value;

    // only updates the waffle chart if input has the type float
    if (validateFloat(numOfHours, errorId)) {        
        let numOfWeeks = parseInt(numOfHours / 24 * weeksToLive);

        // checks if category is part of dataset
        if ( JSON.stringify(dataset).indexOf(category) > -1 ) {
            for ( let i=0; i<dataset.length; i++ ) {
                if ( dataset[i].category == category ) {
                    // calcs diff from given input and existing value
                    diff = dataset[i].count - numOfWeeks;
                    dataset[dataset.length - 1].count += diff;
                    dataset[i].count = numOfWeeks;
                }
            }
        } else {
            // adds new category at index n-1
            dataset.splice( dataset.length - 1, 0, {category: category, count: numOfWeeks, color: color} );
            dataset[dataset.length - 1].count -= numOfWeeks;
        }
        DotMatrixChart( dataset, chart_options );
    }
}
