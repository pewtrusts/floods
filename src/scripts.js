(function(){
    // wrapped in an IIFE to avoid polluting global context
    var buttons = document.querySelectorAll('.js-mm-button');
    var items = document.querySelectorAll('.js-mm-section');
    var navAnchors = document.querySelectorAll('.mm-category--anchor');
   // var nav = document.querySelector('.mm-category-nav');
   function GTMPush(eventLabel) {
       var dataLayer = window.dataLayer || null;
       if (dataLayer) {
           dataLayer.push({ 'event': 'Interactive Click', 'eventData': eventLabel });
       }
   }
    function itemMouseHandler(){
        var _this = this;
        this.classList.remove('is-selected');
        this.removeEventListener('mouseleave', itemMouseHandler);
        setTimeout(function(){
            _this.classList.remove('back-face-visible');
        }, 200);
    }
    function itemClickHandler(){
        var _this = this;
        this.classList.toggle('is-selected');
        this.addEventListener('mouseleave', itemMouseHandler)
        setTimeout(function(){
            _this.classList.toggle('back-face-visible');
        }, 200);
        GTMPush(`Floods|Flip|${this.dataset.item}`);
    }
    function navClickHandler(e){
        e.preventDefault();
        var section = +this.dataset.section;
        navAnchors[section].scrollIntoView(section === 3);
        GTMPush('Floods|Navigate|' + section);
    }
    // using `for` loop to avoid need for NodeList.forEach polyfill
    for ( var i = 0; i < buttons.length; i++ ){
        buttons[i].addEventListener('click', function(e){
            e.stopPropagation();
            GTMPush('Floods|GetBrief|' + this.dataset.name);
        });
    }
    // using `for` loop to avoid need for NodeList.forEach polyfill
    for ( var j = 0; j < items.length; j++ ){
        items[j].addEventListener('click', itemClickHandler);
    }

    //nav links
    var navLinks = document.querySelectorAll('.mm-nav-link');
        
        // set up observers
    function observerCallback(entries){
        var activeLink = document.querySelector('.mm-nav-link.is-active');
        var numberIntersecting = 0;
        entries.forEach(function(entry){
            if ( entry.isIntersecting ){
                if ( activeLink ) {
                    activeLink.classList.remove('is-active');
                }
                numberIntersecting++;
                navLinks[entry.target.dataset.anchor].classList.add('is-active');
                if ( entry.target.dataset.anchor == 3 ){
                    document.body.classList.add('nav-is-fixed');
                } else {
                    document.body.classList.remove('nav-is-fixed');
                }
            }

        });
        if ( numberIntersecting === 0 && activeLink && activeLink !== navLinks[3] ){
                activeLink.classList.remove('is-active');
                document.body.classList.remove('nav-is-fixed');
            }
    }
    var observer = new IntersectionObserver(observerCallback);
    var anchors = document.querySelectorAll('.mm-anchor');
    for ( var k = 0; k < anchors.length; k++ ){
        observer.observe(anchors[k]);
    }
        // click events
    for ( var l = 0; l < navLinks.length; l++ ){ // using `for` loop to avoid need for NodeList.forEach polyfill
        navLinks[l].addEventListener('click', navClickHandler);
    }
    var overviewLink = document.querySelector('#mm-overview-link');
    overviewLink.addEventListener('click', function(e){
        e.preventDefault();
        navAnchors[3].scrollIntoView(true);
        GTMPush(`Floods|Navigate|3`);
    });
})()

