// ==UserScript==
// @name         Anilist - behind banner
// @namespace    http://tampermonkey.net/
// @version      24.06.07.1916
// @description  Get banner to each show you are behind on
// @author       Stinolez
// @match        https://anilist.co/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Stinolez/tampermonkey/main/scripts/anilist-behind-banner.js
// @updateURL    https://raw.githubusercontent.com/Stinolez/tampermonkey/main/scripts/anilist-behind-banner.js
// @license GPL-3.0
// ==/UserScript==

(function() {
  'use strict';

  const delay = 3000 // 3s
      , refresh = 60000 // 60s (if refresh is set to <=0, it won't refresh)
      , debug = 0
      , highlights = [  'Ookami to Koushinryou: MERCHANT MEETS THE WISE WOLF'
                      , 'Elf-san wa Yaserarenai.'
                      , 'Madougushi Dahlia wa Utsumukanai'
                      , 'Shoushimin Series'
                      , 'Shinmai Ossan Bouken-sha, Saikyou Party ni Shinu Hodo Kitaerarete Muteki ni Naru.'
                      , 'Maou Gun Saikyou no Majutsushi wa Ningen datta'
                     ];

  // Setting first run with delay
  const myTimeout = setTimeout(behindShows, delay);

  // Debug help function
  function debugOutput(msg) {
     if (debug === 1) {
       console.log(msg)
     }
  }

  // highlight function
  function highlight() {

    // Constants
    const css = 'position: absolute; background: #36cf7b; font-weight: bold; padding: 4px 8px; left: 4px; top: 4px; color: #001b7c; font-size: 15px; border-radius: 50%;';

    // Remove previous badge
    removeElementsByClass('extraFlag');

    // Get List of titles
    let titles = document.querySelectorAll('div.list-preview div.media-preview-card a.title');

    // Debug output
    debugOutput(titles);

    // Go through all shows
    for (let i = 0; i < titles.length; i++) {

      // Get the individual show and how much behind you are
      let title = titles[i].innerText;

      if(highlights.indexOf(title) != -1) {

        // Create the banner
        let banner = document.createElement('div');
        banner.classList = 'extraFlag';
        banner.style = css;
        banner.innerText = 'D';

        // Put the banner into the show
        titles[i].parentNode.parentNode.append(banner);

      }

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

    // Constants
    const css = 'position: absolute; background: #ffa319; font-weight: bold; padding: 4px 8px; right: 4px; top: 4px; color: #001b7c; font-size: 15px; border-radius: 50%;';

    // Always put function start into console
    console.log('User script (behind shows) run: ' + new Date().toISOString());

    // Remove previous badge
    removeElementsByClass('customBehind');

    // Get all behind shows and define style for the banner
    let shows = document.querySelectorAll('div.list-preview div.isBehind')
      , total = 0;

    // Debug output
    debugOutput(shows);

    // Go through all shows
    for (let j = 0; j < shows.length; j++) {

      // Get the individual show and how much behind you are
      let ind = shows[j].closest('div.media-preview-card')
        , behind = ind.querySelectorAll('div.info-header div')[0].innerText.split(' ')[0];

      // Debug output
      debugOutput(ind);
      debugOutput(behind);

      // Create the banner
      let banner = document.createElement('div');
      banner.classList = 'customBehind';
      banner.style = css;
      banner.innerText = behind;

      // Put the banner into the show
      ind.append(banner);

      // Adding to the total
      total += Number(behind);
      debugOutput(total);

    }

    // Getting the element for section header to put total behind
    try {
      let header = document.querySelectorAll('div.list-preview div.isBehind')[0].closest('div.list-preview-wrap').querySelector('div.section-header h2');
      debugOutput(header)

      if (header.innerHTML.indexOf('behind') === -1) {
        header.innerHTML += ' <span style="color:red;">(' + total + ' episodes behind)</span>';
      } else {
        header.innerHTML = header.innerHTML.replace(/[0-9]+/gm, total);
      }
    } catch(err) {
      debugOutput(err);
    }

    // Adding numbers to the "Anime in Progress" section
    let xpath = "//h2[text()[contains(., 'Anime in Progress')]]"
      , matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      , total2 = 0;

    if(matchingElement) {
      let showList = matchingElement.parentElement.parentElement.querySelectorAll('div.list-preview div.media-preview-card');

      // Debug output
      debugOutput(showList);

      // Go through all shows
      for (let j = 0; j < showList.length; j++) {

        // Get the individual show and how much behind you are
        let ind = showList[j]
          , count = ind.querySelector('div.info > div').innerText.split(' ')[1].split('/')
          , behind = ind.querySelectorAll('div.info-header div')[0]
          , countdown = ind.querySelectorAll('div.countdown')[0]
          , ep = (Number(count[1]) - Number(count[0]));

        // Debug output
        debugOutput(ind);
        debugOutput(count);
        debugOutput(ep);
        debugOutput(behind);

        // Count behind if any
        if (behind) {
          ep = Number(behind.innerText.split(' ')[0]);
        } else if (countdown) {
          ep = 0;
        }

        // Create the banner
        let banner = document.createElement('div');
        banner.classList = 'customBehind';
        banner.style = css;
        banner.innerText = (isNaN(ep) ? 'N/A' : ep);

        // Put the banner into the show
        ind.append(banner);

        // Adding to the total
        total2 += (isNaN(ep) ? 0 : ep);
        debugOutput(total2);

      }
    }

    // Getting the element for section header to put total behind
    try {
      if (matchingElement.innerHTML.indexOf('behind') === -1) {
        matchingElement.innerHTML += ' <span style="color:red;">(' + total2 + ' episodes behind)</span>';
      } else {
        matchingElement.innerHTML = matchingElement.innerHTML.replace(/[0-9]+/gm, total2);
      }
    } catch(err) {
      debugOutput(err);
    }

    // Call highlight function
    highlight();

    // Consecutive runs with refresh rate
    if (refresh > 0) {
      const myTimeout = setTimeout(behindShows, refresh);
    }
  }

})();
