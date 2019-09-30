(function(){
    var buttons = document.querySelectorAll('.js-mm-button');
    var items = document.querySelectorAll('.js-mm-section');
    function itemMouseHandler(){
        this.classList.remove('is-selected');
        this.removeEventListener('mouseleave', itemMouseHandler);
    }
    function itemClickHandler(){
        this.classList.toggle('is-selected');
        this.addEventListener('mouseleave', itemMouseHandler)
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
    

})()

