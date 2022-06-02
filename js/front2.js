// function of front1.js that makes clicking via enter key (while input key is focused) possible.
enableEnterKey("login", "loginButton");
enableEnterKey("review", "reviewButton");

// new object for storing values for api functions
let person = {};
// tracker if user is new on website or "logged in" with the lifeScope key
let loggedIn = false;


/**
 * Loads the stats for the landing-page (on every reload).
 */
const loadStats = async () => {
    stat = await lifescope_getter("stats", 1);
    reviews = await lifescope_getter("review");
    document.getElementById("numOfPeople").innerHTML = `${stat.numOfPeople} people`;
    document.getElementById("avgAge").innerHTML = `average age of ${stat.avgAge.toFixed(2)} years`;
    document.getElementById("numOfReviews").innerHTML = `${reviews.length} reviews`;
}
loadStats();

/**
 * Updates the stats after adding a new person.
 */
const updateStats = async () => {
    stats = await lifescope_getter("stats", 1);
		ageSum = stats.numOfPeople * stats.avgAge;
		newStats = {"id": 1,} 
    newStats.numOfPeople = stats.numOfPeople + 1;
    newStats.avgAge = (ageSum + parseInt(person.age))/newStats.numOfPeople;
    await lifescope_putter("stats", 1, newStats);
}

/**
 * Creates new person entry (without an API-Call).
 */
function createPerson() {
    if(!loggedIn) {
        person.id = uuid();
    }
    person.nickname = document.getElementById("nickname").value;
    person.age = document.getElementById("age").value;
    person.sex = sex; // from front1.js..
}

/**
 * Adds or updates data object of person entry and updates database accordingly.
 */
const updateDataObject = async () => {

    // update person
    person.data = {};
    person.data.sleep = document.getElementById("sleep").value;
    person.data.work = document.getElementById("work").value;
    person.data.ageOfRetirement = document.getElementById("ageOfRetirement").value;
    person.data.media = document.getElementById("media").value;
    person.data.admin = document.getElementById("admin").value;

    // get-call of person table
    let received = await lifescope_getter("person", person.id);

    // check if id doesn't exist yet
    if (received == "404") {
        await lifescope_poster("person", person);
        updateStats();
    } // if it does
    else {
        await lifescope_putter("person", received.id, person);
    }
}

/**
 * Refills values after lifeScope Key entry and sets loggedIn to True.
 */
const restorePerson = async () => {

    let received = await lifescope_getter("person", document.getElementById("login").value);

    // check if id exists
    if (received != "404" && document.getElementById("login").value != "") {

        person.id = received.id;

        // fills in the received data
        document.getElementById("nickname").value = received.nickname;
        document.getElementById("age").value = received.age;
        
        if (received.sex == "female") {
            document.getElementById("female").classList.add('selected');
            document.getElementById("male").classList.remove('selected');
            setSex("female");
        } else if (received.sex == "male") {
            document.getElementById("male").classList.add('selected');
            document.getElementById("female").classList.remove('selected');
            setSex("male")
        } else {
            document.getElementById("male").classList.remove('selected');
            document.getElementById("female").classList.remove('selected');
        }

        document.getElementById("sleep").value = received.data.sleep;
        document.getElementById("work").value = received.data.work;
        document.getElementById("ageOfRetirement").value = received.data.ageOfRetirement;
        document.getElementById("media").value = received.data.media;
        document.getElementById("admin").value = received.data.admin;

        // hides error-msg (in case)
        resetError('login');
        // adds confirmation msg and instruction to click through pages
        document.getElementById("login-instruction").classList.remove('hidden');

        loggedIn = true;
    
    } else {
        printError('login', 'Please provide a valid key!');
    }

}

/**
 * Clicks given butten if logged in.
 * Is positioned on every Down-Arrow before an input-field.
 */
function clickButtonIfLoggedIn(button) {
    if (loggedIn) {
        document.getElementById(button).click();
    }
}

/**
 * Sets the key on the finalPage1.
 * If the values are restored, it can be found in the login-field, else it's the newly created person.id.
 */
function setKey() {
    if (loggedIn) {
        document.getElementById("key").innerHTML = document.getElementById("login").value;
    } else {
        document.getElementById("key").innerHTML = person.id;
    }
}

/**
 * Posts or puts review, depending if there's already a review of that id.
 */
const postReview = async () => {

    review = {
        id: person.id,
        content: document.getElementById("review").value,
        nickname: person.nickname,
        date: new Date().toISOString().split('T')[0]
    };

    received = await lifescope_getter("review", person.id);

    if (received != "404" && review != "") {
        await lifescope_putter("review", person.id, review);
    } else {
        await lifescope_poster("review", review);
    }

    document.getElementById("review-posted").classList.remove('hidden');
}
