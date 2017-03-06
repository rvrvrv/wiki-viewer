/*jshint browser: true, esversion: 6*/
/* global $ */
$(document).ready(function() {

	//Retrieve search results from Wikipedia
	function performSearch(theURL) {
		$('.results').hide();
		$.getJSON(theURL, function (data) {
			//Store results in new arrays
			var titles = data[1];
			var infos = data[2];
			var links = data[3];

			//Check for no results
			if (data[1].length === 0) {
				$('.results').append('<div class="resultsRowTitle">No results found</div>');
			} else {
				for (let i = 0; i < titles.length; i++) {
					$('.results').append(`<div class="resultsRowTitle"><a href="${links[i]}" target="_blank">${titles[i]}</a></div>`);
					$('.results').append(`<div class="resultsRowInfo">${infos[i]}</div>`);
				}
			}
			//Display all results smoothly
			$('.results').append(`Retrieved from: ${theURL}<br>`);
			$('.results').show();
		});
	}

	//Widen search box
	function expandSearchBox() {
		$('#searchBox').css('box-shadow', '0px 12px 20px 5px rgba(0, 100, 150, .6)');
		$('#searchBox').css('width', '380px');
		$('#searchBtn').fadeIn('fast');
	}

	//Upon click, expand the search box
	$('#searchBox').click(expandSearchBox);

	//Upon keypress, expand the search box
	$('#searchBox').keydown(expandSearchBox);

	//Open random entry in new tab
	$('#randomBtn').click(() => {
		this.blur();
		window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank');
	});

	//Perform the search
	$('#searchBtn').click(() => {

		//Trim to remove white spaces on each side
		let txt = $('#searchBox').val().trim();
		$('#searchBox').val(txt).trigger('change');

		//Only perform search if field is filled
		if (txt !== null && txt !== '') {
			//Clear results, shorten box, and perform search
			$('.results').empty();
			$('#searchBox').css('width', (txt.length * 11.6 + 28) + 'px');
			let URL = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&search=${txt}&format=json&callback=?`;
			performSearch(URL);
		}
	});

});
