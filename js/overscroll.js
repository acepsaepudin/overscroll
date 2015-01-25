/*!
 * Overscroll.
 *
 * MIT licensed
 * Copyright (C) 2015 Tim Holman, http://tholman.com
 */

/*********************************************
 * Utils
 *********************************************/

function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    for(var i = 0; i < prefixes.length; i++) {
        if(document.createElement('div').style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
}

/*********************************************
 * Overscroll
 *********************************************/

function Overscroll() {

	var scrollPosition   = 0;
	var windowHeight     = 0;
	var shakeYourBody    = document.body;
	var windows95        = window;
	var transform        = getSupportedTransform();

	var elements = {top: [], bottom: []};

    this.init = function() {
    	
		this.window = window;
    	this.onScroll();
    	this.onResize();
    }

    this.bindElement = function(element, position, delta) {

    	// Default delta!
    	delta = delta || 1;

    	// Only bind events once there is something to overscroll.
    	// TODO - Start request animation frame.
    	if( elements.top.length === 0 && elements.bottom.length === 0 ) {
    		this.scrollEvent = this.window.addEventListener("scroll", this.onScroll);
    		this.resizeEvent = this.window.addEventListener("resize", this.onResize);
    	}

    	var elementObject = {domElement: element, height: element.clientHeight, delta: delta};
    	elements[position].push(elementObject);
    }

    this.onScroll = function() {
		scrollPosition = windows95.pageYOffset || shakeYourBody.scrollTop;
		doTheThing();
    }

    this.onResize = function() {
    	windowHeight = windows95.innerHeight;
    }

    // Zhu Li!
    var doTheThing = function() {

    	var i;

    	console.log( scrollPosition, windowHeight );

    	// @TODO: Could this be cleaner, somehow?
    	if( scrollPosition <= 0 ) {
    		for( i = 0; i < elements.top.length; i++ ) {

    			var thisElement = elements.top[i];
    			var movement = ( -scrollPosition * thisElement.delta );

    			// Don't allow element to overreach its height.
    			if( movement > thisElement.height ) {
    				movement = thisElement.height;
    			}

    			thisElement.domElement.style[transform] = 'translateY(' + ( movement ) + 'px )';
    		}
    	} else if ( scrollPosition >= windowHeight ) {

    		for( i = 0; i < elements.bottom.length; i++ ) {	

    			var thisElement = elements.bottom[i];
    			var movement = ( ( scrollPosition - windowHeight ) * thisElement.delta );

    			console.log( scrollPosition - windowHeight );

    			// Don't allow element to overreach its height.
    			if( movement > thisElement.height ) {
    				movement = thisElement.height;
    			}

    			thisElement.domElement.style[transform] = 'translateY(' + (-movement ) + 'px )';
    		}
    	}
    }

    this.init();
}
