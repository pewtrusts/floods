import './styles.scss';

import data from './data.csv';
import metadata from './metadata.csv';
import * as d3 from 'd3-collection';

var nestedData = d3.nest().key(d => d.section).entries(data);

var frag = document.createDocumentFragment();
nestedData.forEach(nest => {
    var section = document.createElement('section');
    var hed = document.createElement('h2');
    var container = document.createElement('div');
    container.className = 'mm-item-container';

    var match = metadata.find(d => d.section === nest.key);
    hed.textContent = match.hed;
    if ( match.dek ){
        hed.insertAdjacentHTML('beforeend', `: <span>${match.dek}</span>`);
    }
    var description = document.createElement('p');
    description.textContent = match.description;
   
    section.appendChild(hed);
    section.appendChild(description);
   
    nest.values.forEach(item => {
        var itemSect = document.createElement('section');
        itemSect.className = 'mm-section';
        var content = document.createElement('div');
        content.className = 'mm-section-content';
        var front = document.createElement('div');
        front.className = 'mm-front';
        var itemHed = document.createElement('h3');
        itemHed.textContent = item.hed; // TO DO: add item hed to csv
        var button = document.createElement('a');
        button.href = '#'; // TO DO : ADD URLS TO CSV
        button.textContent = 'Get the brief';
        front.appendChild(itemHed);
        front.appendChild(button);
        
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

        back.appendChild(backHed);
        back.appendChild(list);

        content.appendChild(front);
        content.appendChild(back);

        itemSect.appendChild(content);

        container.appendChild(itemSect);

    });
    section.appendChild(container);
    frag.appendChild(section);
});
document.querySelector('#pew-app').appendChild(frag);
