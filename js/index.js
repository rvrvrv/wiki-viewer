/*jshint browser: true, esversion: 6*/
/* global $ */
$(document).ready(function () {
	//Global vars
	var $input = $('#searchBox');
	var $rslts = $('.results');
	var txt = '';
	var lastSearch = '';

	//Retrieve search results from Wikipedia
	function performSearch(theURL) {
		$rslts.hide();
		$.getJSON(theURL, (data) => {
				//Store results in new arrays
				let titles = data[1];
				let infos = data[2];
				let links = data[3];

				//Check for no results
				if (data[1].length === 0) {
					$rslts.append('<div class="resultsRowTitle">No results found</div>');
				} else {
					for (let i = 0; i < titles.length; i++) {
						$rslts.append(`<div class="resultsRowTitle"><a href="${links[i]}" target="_blank">${titles[i]}</a></div>`);
						$rslts.append(`<div class="resultsRowInfo">${infos[i]}</div>`);
					}
				}
			})
			.done(() => {
				//Display all results smoothly
				$rslts.append(`Retrieved from: ${theURL}<br>`);
				$rslts.slideDown('slow');
			})
			.fail(() => {
				$rslts.append('<div class="resultsRowTitle">An error has occurred. Please try again later.</div>');
			});
	}

	//Widen search box to accommodate text
	function expandSearchBox() {
		$input.css('box-shadow', '0px 12px 20px 5px rgba(0, 100, 150, .6)');
		$input.css('width', '380px');
		$('#searchBtn').fadeIn('fast');
	}

	//Upon click, expand the search box
	$input.click(expandSearchBox);

	//Upon keypress, expand the search box
	$input.keydown(expandSearchBox);

	//Open random entry in new tab
	$('#randomBtn').click(() => {
		this.blur();
		window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank');
	});

	//Search button click-handling
	$('#searchBtn').click(() => {
		//Trim input field to remove white spaces on each side
		txt = $input.val().trim();
		$input.val(txt).trigger('change');

		//Prevent duplicate/invalid requests
		if (txt !== lastSearch && txt !== '') {
			lastSearch = txt;
			$rslts.empty();
			$input.css('width', (txt.length * 11.6 + 28) + 'px');
			let URL = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&search=${txt}&format=json&callback=?`;
			performSearch(URL);
		}
	});

});
