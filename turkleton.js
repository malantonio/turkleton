/*jslint plusplus:true,indent:4,white:true*/
'use strict';

var results = []
  , headers = []
  , qs
    ;

if ( document.location.search !== '' || document.location.hash !== '' ) {
    if ( document.location.search && /(&?[qs]=([\w\d]+)){2}/.test(document.location.search) ) {
        main(document.location.search.replace(/^\?/, ''));
    } else if ( document.location.hash && /(&?[qs]=([\w\d]+)){2}/.test(document.location.hash) ) {
        main(document.location.hash.replace(/^#\?/, ''));
    }
}

document.addEventListener('submit', function (e) {
    e.preventDefault();
    main();
});

function main(qs) {
    var s = document.getElementById('scope').value
      , q = document.getElementById('query').value
      , capt = document.querySelector('caption')
      , tbody = document.querySelector('tbody')
      , thead = document.querySelector('thead')
      , xhr = new XMLHttpRequest()
      , qs = qs || (s && q ? ('s=' + s + '&q=' + q) : null)
      , data, i, tr, td, len
      ;

    if ( !q && !qs ) { return; }

    clearOutChildren(thead);
    clearOutChildren(tbody);

    appendToURL(qs);

    xhr.open('GET', 'search.php?' + qs);
    xhr.send();
    xhr.onreadystatechange = function () {
        if ( xhr.readyState === 4 ) {
            var data = JSON.parse(xhr.responseText)
              , len = data.count
              , key, qs_split
                ;

            if ( !q && qs ) {
                qs_split = qs.split('&');
                q = qs_split[0].match(/q=/) ? qs_split[0].replace('q=', '') : qs_split[1].replace('q=', '');
                s = qs_split[1].match(/s=/) ? qs_split[1].replace('s=', '') : qs_split[0].replace('s=', '');
            }

            results = data.results;

            capt.innerHTML = 'Your '
                           + getScopeText(s)
                           + ' search for <code>' + q + '</code> returned ' 
                           + len + ' results'
                           ;

            if ( len === 0 ) { return; }

            if ( headers.length === 0 ) {
                // get header names
                for ( key in results[0] ) {
                    headers.push(key);
                }
            }

            fillTableHeaders();
            buildTable(results);

        }
    };
}

function appendToURL (qs) {
    var loc = document.location
      , base = loc.hostname
      , path = loc.pathname
      , base_url = base + path
        ;

    if ( history && history.pushState ) {
        history.pushState(null, null, '?' + qs);
    } else {
        loc.hash = '#' + qs;
    }
}

function buildTable (data) {
    var tbody = document.getElementsByTagName('tbody')[0]
      , len = data.length
      , tr, td, i;

    for ( i = 0; i < len; i++ ) {
        tr = document.createElement('tr');
        headers.forEach(function(f) {
            td = document.createElement('td');
            td.textContent = results[i][f];
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    }
}

function clearOutChildren (el) {
    while ( el.hasChildNodes() ) {
        el.removeChild(el.firstChild);
    }
}

function getScopeText (scope) {
    switch (scope) {
        case 'kw': return 'keyword';
        case 'ti': return 'title';
        case 'au': return 'author';
    }
}

function fillTableHeaders () {
    var thead = document.getElementsByTagName('thead')[0]
      ;

    headers.forEach(function (col) {
        var th = document.createElement('th')
          , abbr = col.replace(/\./g, '').replace(/\s/g, '_')
          ;
   
        th.dataset.sort = abbr;
        th.className = 'sort-asc';
        th.textContent = col.replace('_', ' ');
        th.onclick = sortList;
        thead.appendChild(th);
    });
}

/**
 *  event trigger for th clicks
 */

function sortList(e) {
    var el = e.target
      , direction = el.className.replace('sort-', '') === 'asc' ? 'desc' : 'asc'
      , tbody = document.getElementsByTagName('tbody')[0]
      , field = el.dataset.sort
      ;

    clearOutChildren(tbody);

    if ( direction == 'asc' ) {
        results.sort(sortAsc);
    } else {
        results.sort(sortDesc);
    }

    buildTable(results);

    el.className = 'sort-' + direction;

    function sortAsc(a,b) {
        if ( a[field] === b[field] ) { return 0; }
        return a[field] < b[field] ? -1 : 1;
    }

    function sortDesc(a,b) {
        if ( a [field] === b[field] ) { return 0; }
        return a[field] > b[field] ? -1 : 1;
    }

}
