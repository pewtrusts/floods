(function(){
    // wrapped in an IIFE to avoid polluting global context
    var buttons = document.querySelectorAll('.js-mm-button');
    var items = document.querySelectorAll('.js-mm-section');
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
    var navLinks = document.querySelectorAll('.mm-nav-link');
    function observerCallback(entries){
        var activeLink = document.querySelector('.mm-nav-link.is-active');
        entries.forEach(function(entry){
            if ( entry.isIntersecting ){
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
})()

