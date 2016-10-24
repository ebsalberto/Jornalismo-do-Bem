/*
 * Bad News Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Bad News from the web page.
 * Currently working for: g1.com.br
 */

// Variables

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

var regex = /Maduro/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('traficante'),\
:contains('morte de'),\
:contains('morta por'),\
:contains('morto por'),\
:contains('morto pelo'),\
:contains('morta pelo'),\
:contains('autor do crime'),\
:contains('raptado'),\
:contains('sequestrado por'),\
:contains('são morto'),\
:contains('é morto'),\
:contains('ser morta')\
";


// Functions
function filterMild() {
	console.log("Filtering Bad News with Mild filter...");
	return $(selector).filter(".feed-post-body-title").closest('.bastian-feed-item');
	return $(selector).filter(".highlight-text").closest('.highlight');
}

function filterDefault () {
	console.log("Filtering Bad News with Default filter...");
	return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering Bad News with Vindictive filter...");
	return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else if (filter == "aggro") {
	   return filterDefault();
   } else {
     return filterMild();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	//elements.fadeOut("fast");
	elements.replaceWith("<h2>Notícia removida</h2>")
}


// Implementation
if (search) {
   console.log("Bad news found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", badnews: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " badnews.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
