const get_reviews = async () => {
	const reviews = await lifescope_getter('review');
	for (i = 0; i < reviews.length; i++) {

		// Create div for single review.
		let review = document.createElement('div');
		review.classList.add('infobox', 'reviewbox');

		// Create html tags for review.
		let nickname = document.createElement('p');
		nickname.innerHTML = reviews[i].nickname;

		let content = document.createElement('p');
		content.innerHTML = reviews[i].content;

		let date = document.createElement('span');
		date.innerHTML = reviews[i].date;

		review.append(date, nickname, content);

		// Add review to page.
		document.getElementById('container-review').appendChild(review);
	}
}

const deleteReview = async () => {
	let id = document.getElementById('delete-review-input').value
	delete_review = await lifescope_deleter('review', id);

	// Display / Hide error message.
	error_div = document.getElementById('delete-review-error')
	success_div = document.getElementById('delete-review-success')
	if (delete_review == '404') {
		error_div.classList.remove('hidden');
	} else {
		console.log('found')
		error_div.classList.add('hidden');
		success_div.classList.remove('hidden');
	}
}

