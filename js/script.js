/**
 * variables
 */

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
    timer = setTimeout(func,50,event);
  };
}

function changePage(from, to) {
	nextPage = document.getElementById(to);
  nextPage.scrollIntoView({behavior: "smooth"});
	nextPage.classList.add('active');
	document.getElementById(from).classList.remove('active');
}

function showButton(id) {
  let element = document.getElementById(id);
  element.classList.remove("hidden");
}

function yearsToWeeks(years) {
	return parseInt(years) * 52
}

function weeksToYears(weeks) {
	return (weeks / 52).toFixed(1)
}

function weeksToPercentage(weeks) {
	return (weeks / yearsToWeeks(lifeExpectancy) * 100).toFixed(1)
}


/**
 * sets the reload position to top
 */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


window.addEventListener("resize",debounce(function(e){
  document.getElementsByClassName('active')[0].scrollIntoView({behavior: "smooth"});
}));

let weeksToLive = 0;

/**
 * constructs waffle chart after age input
 */
function constructWaffle() {
	let age = document.getElementById("age").value;
	let ageInWeeks = yearsToWeeks(age);
	weeksToLive = yearsToWeeks(lifeExpectancy - parseInt(age));

	if (age < 75) {
		dataset.push({category: "lived", count: ageInWeeks, color: "#fb8d46"});
		dataset.push({category: "to live", count: weeksToLive, color: "#0c5374"});
		
		// delays chart load to wait for scrolling to next position
		delay(500).then(() => 
			DotMatrixChart( dataset, chart_options )
		);
	}

	// TODO: else {print "Congratulations, your reached a very nice age."} 
}

/** 
 * add a category without changing the number of dots
 * */
function splitWeeksToLive(category, color) { 
	let hoursOfActivity = document.getElementById(category).value;
	let lostWeeks = parseInt(hoursOfActivity / 24 * weeksToLive);

	//reduces free time in last category and adds new category
	dataset[dataset.length - 1].count -= lostWeeks;
	dataset.splice(dataset.length - 1, 0, {category: category, count: lostWeeks, color: color});
	DotMatrixChart( dataset, chart_options );
}
