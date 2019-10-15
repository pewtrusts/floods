(function(){
    // wrapped in an IIFE to avoid polluting global context
    var buttons = document.querySelectorAll('.js-mm-button');
    var items = document.querySelectorAll('.js-mm-section');
    var navAnchors = document.querySelectorAll('.mm-category--anchor:not(.mm-category--anchor-top');
    var scrollPosition = 0;
    var scrollDirection;
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
    }
    function navClickHandler(){
        var section = +this.dataset.section;
        navAnchors[section].scrollIntoView(false);
    }
    // using `for` loop to avoid need for NodeList.forEach polyfill
    for ( var i = 0; i < buttons.length; i++ ){
        buttons[i].addEventListener('click', function(e){
            e.stopPropagation();
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
        entries.forEach(function(entry){
            scrollDirection = window.pageYOffset < scrollPosition ? 'up' : window.pageYOffset > scrollPosition ? 'down' : scrollDirection;
            scrollPosition = window.pageYOffset;
            if (((entry.target.dataset.direction === 'down' && scrollDirection === 'down') || (entry.target.dataset.direction === 'up' && scrollDirection === 'up')) && entry.isIntersecting ){
                if ( activeLink ) {
                    activeLink.classList.remove('is-active');
                }
                if ( entry.target.dataset.anchor !== "-1" ){
                    navLinks[entry.target.dataset.anchor].classList.add('is-active');
                }
            }
        });
    }
    var observer = new IntersectionObserver(observerCallback);
    var anchors = document.querySelectorAll('.mm-category--anchor');
    for ( var k = 0; k < anchors.length; k++ ){
        observer.observe(anchors[k]);
    }
        // click events
    for ( var l = 0; l < navLinks.length; l++ ){ // using `for` loop to avoid need for NodeList.forEach polyfill
        navLinks[l].addEventListener('click', navClickHandler);
    }
})()

