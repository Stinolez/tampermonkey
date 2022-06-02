// ==UserScript==
// @name         Anilist - behind banner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get banner to each show you are behind on
// @author       Stinolez
// @match        https://anilist.co/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const myInterval = setInterval(behindShows, 10000)
      , debug = 0;

  // Debug help function
  function debugOutput(msg) {
     if (debug === 1) {
       console.log(msg)
     }
  }

  // Help function to remove elements by classname
  function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  // Function to show the behind shows as badge on homepage
  function behindShows() {

    // Remove previous badge
    removeElementsByClass('customBehind');

    // Get all behind shows and define style for the banner
    var shows = document.querySelectorAll('div.list-preview div.isBehind')
      , css = 'position: absolute; background: #ffa319; font-weight: bold; padding: 4px 8px; right: 4px; top: 4px; color: #001b7c; font-size: 15px; border-radius: 50%;';

    // Debug output
    debugOutput(shows);
    debugOutput(css);

    // Go through all shows
    for (var j = 0; j < shows.length; j++) {

      // Get the individual show and how much behind you are
      var ind = shows[j].closest('div.media-preview-card');
      var behind = ind.querySelectorAll('div.info-header div')[0].innerText.split(' ')[0];

      // Debug output
      debugOutput(ind);
      debugOutput(behind);

      // Put the banner into the show
      ind.innerHTML += '<div class="customBehind" style="' + css + '">' + behind + '</div>';

    }
  }

})();