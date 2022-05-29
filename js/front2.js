enableEnterKey("login", "loginButton");
enableEnterKey("review", "reviewButton");

let person = {};
let loggedIn = false;

const updateStats = async () => {
    stat = await lifescope_getter("stats", 1111);
    document.getElementById("numOfPeople").innerHTML = `${stat.numOfPeople} people`;
    document.getElementById("avgAge").innerHTML = `average age of ${stat.avgAge} years`;
}
updateStats();

function createPerson() {
    person.id = uuid();
    person.nickname = document.getElementById("nickname").value;
    person.age = document.getElementById("age").value;
    person.sex = sex; // from front1.js..
}

const createDataObject = async () => {
    person.data = {};
    person.data.sleep = document.getElementById("sleep").value;
    person.data.work = document.getElementById("work").value;
    person.data.ageOfRetirement = document.getElementById("ageOfRetirement").value;
    person.data.media = document.getElementById("media").value;
    person.data.admin = document.getElementById("admin").value;

    let received = await lifescope_getter("person", person.id);

    // working key example: 62935ba5299817d925c42aec

    // check if id exists
    if (received == "404") {
        await lifescope_poster("person", person);
    } else {
        await lifescope_putter("person", received.id, person);
    }
    
}

function setKey() {
    if (loggedIn) {
        document.getElementById("key").innerHTML = document.getElementById("login").value;
    } else {
        document.getElementById("key").innerHTML = person.id;
    }
}

function clickButtonIfLoggedIn(button) {
    if (loggedIn) {
        document.getElementById(button).click();
    }
}

const restorePerson = async () => {

    let received = await lifescope_getter("person", document.getElementById("login").value);

    // working key example: 62935ba5299817d925c42aec

    // check if id (parameter) exists
    if (received != "404" && document.getElementById("login").value != "") {

        console.log(received);

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

        resetError('login');
        document.getElementById("login-instruction").classList.remove('hidden');

        loggedIn = true;
    
    } else {
        printError('login', 'Please provide a valid key!');
    }

}

function postReview() {
    console.log("post review");
}
