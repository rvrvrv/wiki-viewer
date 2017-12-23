/* global $ */
$(document).ready(() => {
  // Global vars
  const $sBox = $('#searchBox');
  const $rslts = $('.results');
  let txt = '';
  let lastSearch = '';

  // Retrieve search results from Wikipedia
  function performSearch(theURL) {
    $rslts.empty();
    $rslts.removeClass('fadeOutUp');

    $.getJSON(theURL, (data) => {
      // Store results in new arrays
      const titles = data[1];
      const infos = data[2];
      const links = data[3];

      // Check for no results
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
        // Display all results smoothly
        $rslts.append(`Retrieved from: ${theURL}<br>`);
        $rslts.addClass('fadeInDown');
      })
      .fail(() => {
        $rslts.append('<div class="resultsRowTitle">An error has occurred. Please try again later.</div>');
      });
  }

  // Upon keypress or mouse click, expand the search box
  $sBox.keydown(() => $sBox.focus());
  $sBox.click(() => $sBox.focus());

  // Open random entry in new tab
  $('#randomBtn').click(() => window.open('https://en.wikipedia.org/wiki/Special:Random'));

  // Search button click-handling
  $('#searchBtn').click(() => {
    $sBox.blur();
    // Trim input field to remove white spaces on each side
    txt = $sBox.val().trim();
    $sBox.val(txt).trigger('change');

    // If request is not a duplicate or blank, perform the search
    if (txt !== lastSearch && txt !== '') {
      lastSearch = txt;
      const URL = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&search=${txt}&format=json&callback=?`;
      $sBox.css('width', `${(txt.length * 11.5) + 27}px`);
      $rslts.removeClass('fadeInDown');
      $rslts.addClass('fadeOutUp');
      setTimeout(() => performSearch(URL), 500);
    }
  });
});
