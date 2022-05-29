// Example review object
let testreview  = {
	id: 22342,
	content: "changed a review",
	nickname: "testuser22",
	date: "2022-12-12"
}

/**
 * Sends POST request to lifescope api.
 * 
 * @param {String} endpoint Lifescope api endpoint.
 * @param {Object} data Data object which should be posted.
 */
const lifescope_poster = async (endpoint, data) => {
	
	// Define options for request. 
	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};

	// Build api endpoint url based on function args.
	let url = `https://343505-26.web.fhgr.ch/api/lifescope/${endpoint}`;

	const response = await fetch(url, options);

	if (response.ok) {
			return response.json();
	} else {
			return response.status;
	}

}


/**
 * Sends GET request to lifescope api.
 * 
 * @param {String} endpoint Lifescope api endpoint.
 * @param {Integer} id Optional parmeter used for get request.
 */
const lifescope_getter = async (endpoint, id = '') => {

	// Build api endpoint url based on function args.
	const url = `https://343505-26.web.fhgr.ch/api/lifescope/${endpoint}/${id}`;

	const response = await fetch(url);

	if (response.ok) {
			return response.json();
	} else {
			return response.status;
	}

}


/**
 * Sends PUT request to lifescope api.
 * 
 * @param {String} endpoint Lifescope api endpoint.
 * @param {Integer} id ID of the object to be updated.
 * @param {Object} data Data object which contains updated data.
 */
const lifescope_putter = async (endpoint, id, data) => {

	// Define options for request. 
	let options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};

	// Build api endpoint url based on function args.
	let url = `https://343505-26.web.fhgr.ch/api/lifescope/${endpoint}/${id}`;

	const response = await fetch(url, options);

	if (response.ok) {
			return response.json();
	} else {
			return response.status;
	}

}


/**
 * Sends DELETE request to lifescope api.
 * 
 * @param {String} endpoint Lifescope api endpoint.
 * @param {Integer} id ID of the object to be deleted.
 */
const lifescope_deleter = async (endpoint, id) => {

	// Define options for request. 
	let options = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// Build api endpoint url based on function args.
	let url = `https://343505-26.web.fhgr.ch/api/lifescope/${endpoint}/${id}`;

	const response = await fetch(url, options);

	if (response.ok) {
			return response.json();
	} else {
			return response.status;
	}

}



// Call functions

// lifescope_poster('review', testreview);
// lifescope_getter('review')
// lifescope_getter('review', 22)
// lifescope_putter('review', 22, testreview)
// lifescope_deleter('review', 22)
