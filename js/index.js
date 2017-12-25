/* global $ */
$(document).ready(() => {
  // Global vars
  const $sBox = $('#searchBox');
  const $rslts = $('.results');
  let txt = '';
  let lastSearch = '';

  // Retrieve search results from Wikipedia
  function performSearch(query) {
    $rslts.empty();
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&search=${query}&format=json&callback=?`;
    $.getJSON(url, (data) => {
      // Store results in new arrays
      const titles = data[1];
      const infos = data[2];
      const links = data[3];

      // Check for no results
      if (!data[1]) $rslts.append('<div class="entry"><div class="title">No results found.</div></div>');
      else {
        titles.forEach((t, i) => {
          $rslts.append(`
            <div class="entry">
              <div class="title"><a href="${links[i]}" target="_blank">${titles[i]}</a></div>
              <div class="info">${infos[i]}</div>
            </div>
            `);
        });
      }
    })
      .done(() => {
        // Display all results smoothly
        $rslts.append(`Retrieved from: ${url}<br>`);
        $rslts.removeClass('fadeOutUp').addClass('fadeInDown');
      })
      .fail(() => {
        $rslts.append('<div class="entry"><div class="title">An error has occurred. Please try again later.</div></div>');
      });
  }

  // Upon keypress or mouse click, expand the search box
  $sBox.keyup(() => $sBox.focus());
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
    if (txt.toLowerCase() !== lastSearch.toLowerCase() && txt !== '') {
      lastSearch = txt.toLowerCase();
      $sBox.css('width', `${(txt.length + 1) * 12}px`);
      $rslts.removeClass('fadeInDown').addClass('fadeOutUp');
      setTimeout(() => performSearch(txt), 500);
    }
  });
});
