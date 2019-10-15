/* global process */
import './styles.scss';

import data from './data.csv';
import metadata from './metadata.csv';
import overview from './overview.html';
import * as d3 from 'd3-collection';

var appContainer = document.querySelector('#pew-app');
if ( process.env.NODE_ENV === 'development' ){
    document.querySelector('.js-main-primary > section').insertAdjacentHTML('afterend', overview);
}
var nestedData = d3.nest().key(d => d.section).entries(data);



var frag = document.createDocumentFragment();
var navSection = document.createElement('section');
navSection.className = 'mm-category mm-category-nav';
var nav = document.createElement('nav');
nav.className = 'mm-nav';
nav.setAttribute('aria-label','in-page navigation');
nestedData.forEach((nest, i) => {
    var link = document.createElement('a');
    link.className = 'mm-nav-link mm-nav-link-' + i;
    link.setAttribute('data-section', i);
    link.textContent = metadata.find(d => d.section === nest.key).short;
    nav.appendChild(link);
});
navSection.appendChild(nav);
appContainer.insertAdjacentElement('afterbegin', navSection);
nestedData.forEach((nest, i) => {
    var section = document.createElement('section');
    section.className = 'mm-category mm-category-' + i;
    var sectionAnchor = document.createElement('a');
    sectionAnchor.className = 'mm-category--anchor mm-category--anchor-' + i;
    sectionAnchor.setAttribute('data-anchor', i);
    var topAnchor = document.createElement('a');
    topAnchor.className = 'mm-category--anchor mm-category--anchor-top';
    topAnchor.setAttribute('data-anchor', -1);
    var outerContainer = document.createElement('div');
    outerContainer.className = 'mm-outer-container';
    var hedContainer = document.createElement('div');
    hedContainer.className = 'rich-text';
    var hed = document.createElement('h2');
    hed.className = 'with_nav';
    hedContainer.appendChild(hed);
    var container = document.createElement('div');
    container.className = 'mm-item-container';

    var match = metadata.find(d => d.section === nest.key);
    hed.textContent = match.hed;
    if ( match.dek ){
        hed.insertAdjacentHTML('beforeend', `: <span>${match.dek}</span>`);
    }
    var description = document.createElement('p');
    description.textContent = match.description;
   
    outerContainer.appendChild(hedContainer);
    outerContainer.appendChild(description);
   
    nest.values.forEach((item, idx) => {
        var itemSect = document.createElement('section');
        itemSect.className = `mm-section mm-section-${idx + 1} js-mm-section`;
        var content = document.createElement('div');
        content.className = 'mm-section-content';
        var front = document.createElement('div');
        front.className = 'mm-front';
        var img = document.createElement('img');
        front.innerHTML = '<svg class="mm-flip-icon" viewBox="0 0 30 21" xmlns="http://www.w3.org/2000/svg"><g><path d="M10.06 9.29a.8.8 0 0 0-1.15 0l-2.67 2.6a9.97 9.97 0 0 1-.12-1.36 8.9 8.9 0 0 1 9-8.79c1.43 0 2.79.33 4.06.95.4.2.91.03 1.1-.36a.78.78 0 0 0-.37-1.06A10.63 10.63 0 0 0 15.12.14 10.53 10.53 0 0 0 4.61 12.13L1.7 9.29a.8.8 0 0 0-1.15 0c-.34.32-.34.83 0 1.12l4.18 4.08c.15.15.36.24.57.24.22 0 .43-.09.58-.24l4.18-4.08a.8.8 0 0 0 0-1.12z"></path><path d="M29.73 10.59L25.58 6.5a.8.8 0 0 0-1.16 0l-4.18 4.08a.76.76 0 0 0 0 1.12.8.8 0 0 0 1.15 0l2.67-2.6c.06.44.12.89.12 1.36a8.9 8.9 0 0 1-9 8.79 9.18 9.18 0 0 1-4.06-.95.82.82 0 0 0-1.09.36.78.78 0 0 0 .36 1.06 10.8 10.8 0 0 0 4.82 1.13A10.53 10.53 0 0 0 25.73 8.87l2.9 2.84c.16.15.37.24.58.24.21 0 .43-.09.58-.24.27-.3.27-.8-.06-1.12z"></path></g></svg>'
        front.appendChild(img);
        img.setAttribute('srcset', `/-/media/post-launch-images/2019/10/${item.lo_res} 1x, /-/media/post-launch-images/2019/10/${item.hi_res} 2x`);
        img.setAttribute('width','100%');
        img.setAttribute('height','100%');
        img.setAttribute('loading','lazy');
        var frontInner = document.createElement('div');
        frontInner.className = 'mm-front-inner';
        var itemHed = document.createElement('h3');
        itemHed.textContent = item.hed; 
        var button = document.createElement('a');
        button.className = 'js-mm-button';
        button.href = item.url; 
        button.textContent = 'Get the brief';
        frontInner.appendChild(itemHed);
        frontInner.appendChild(button);
        
        front.appendChild(frontInner);

        var back = document.createElement('div');
        back.className = 'mm-back';
        var backHed = document.createElement('p');
        backHed.className = 'mm-back-header';
        backHed.textContent = item.name;
        var list = document.createElement('dl');
        ['Problem', 'Solution', 'Outcome'].forEach(d => {
            var term = document.createElement('dt');
            term.textContent = d;
            list.appendChild(term);
            var definition = document.createElement('dd');
            definition.textContent = item[d.toLowerCase()]
            list.appendChild(definition);
        });
        var backButton = document.createElement('a');
        backButton.className = 'js-mm-button';
        backButton.href = item.url; 
        backButton.textContent = 'Get the brief';

        back.appendChild(backHed);
        back.appendChild(list);
        back.appendChild(backButton);

        content.appendChild(front);
        content.appendChild(back);

        itemSect.appendChild(content);

        container.appendChild(itemSect);
        outerContainer.appendChild(container);

    });
    if ( i === 2 ){
        var lessons = document.createElement('h2');
        lessons.className = 'mm-lessons-learned';
        lessons.textContent = 'Read more about lessons learned';
        var llButton = document.createElement('a')
        llButton.className = 'mm-ll-button';
        llButton.textContent = 'discover';
        llButton.href="#";
        outerContainer.appendChild(lessons);
        outerContainer.appendChild(llButton);
    }
    if ( i === 0 ){
        section.appendChild(topAnchor);
    }
    section.appendChild(sectionAnchor);
    section.appendChild(outerContainer);
    frag.appendChild(section);
});
appContainer.appendChild(frag);
