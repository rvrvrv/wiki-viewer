/* global $ */
$(document).ready(() => {
  // Global vars
  const $sBox = $('#searchBox');
  const $sBtn = $('#searchBtn');
  const $sIcn = $('#searchIcon');
  const $rslts = $('.results');
  let lastSearch = '';

  // Toggle search button
  function toggleSearchBtn(enable) {
    // Restore search button to original state
    if (enable) {
      $sIcn.removeClass('fa-circle-o-notch fa-spin').addClass('fa-search');
      $sBtn.removeAttr('disabled');
    } else {
      // Change search icon to animated spinner and disable button
      $sIcn.removeClass('fa-search').addClass('fa-circle-o-notch fa-spin');
      $sBtn.attr('disabled', 'disabled');
    }
  }

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
      if (!data[1].length) $rslts.append('<div class="entry"><div class="title">No results found.</div></div>');
      else {
        // Generate HTML for results
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
        toggleSearchBtn(true);
      })
      .fail(() => {
        // If applicable, display error message and re-enable search button
        $rslts.append('<div class="entry"><div class="title">An error has occurred. Please try again later.</div></div>');
        toggleSearchBtn(true);
      });
  }

  // Search button click-handling
  $('#searchBtn').click(() => {
    // First, update UI
    $sBox.blur();
    toggleSearchBtn();
    // Trim input field to remove white spaces on each side
    const txt = $sBox.val().trim();
    $sBox.val(txt).trigger('change');

    // If request is not a duplicate or blank, perform the search
    if (txt.toLowerCase() !== lastSearch.toLowerCase() && txt !== '') {
      lastSearch = txt.toLowerCase();
      $sBox.css('width', `${(txt.length + 1) * 12}px`);
      $rslts.removeClass('fadeInDown').addClass('fadeOutUp');
      setTimeout(() => performSearch(txt), 500);
    } else toggleSearchBtn(true);
  });
});
