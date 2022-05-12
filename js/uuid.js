/*
 * UUID function by jankuca.
 * https://gist.github.com/jankuca/789412/7a56331f2fefca71b9264385d9aec5fa40b82810
 * 
 * Adaptions: Removed browser version, since navigator.appVersion property is deprecated.
 */

const uuid = function () {
	let a, c, d;
	let time = Math.round(new Date().getTime() / 1000);
	let href = window.location.href;
	
	// a - unix timestamp
	a = time.toString(16).substring(0, 8);

	// c - url
	c = (href.length * href.length * href.length).toString(16).substring(0, 4);

	// d - random
	d = Math.random().toString().substring(2);
	d = parseInt(d, 10);
	d = d.toString(16).substring(0, 12);

	return [a, c, d].join('');
};