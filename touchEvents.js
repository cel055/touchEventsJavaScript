var listActiveTouches = new Array();

var OurTouch = function(eventsAndCallbacks){
    this.eventsAndCallbacks = eventsAndCallbacks;
    
    this.firstX;
    this.firstY;
    
    this.startPressing;
}

function removeTouchEvent(htmlObj){
    htmlObj.removeEventListener("touchstart", touchStart, false);
    htmlObj.removeEventListener("touchend", touchEnd, false);
}

function touchStart(event, ourTouch){
}

function touchMove(event, ourTouch){
}

function touchEnd(event, ourTouch){
}

function addTouchEvent(listHtmlObj, eventsAndCallbacks){
    var ourTouch = new OurTouch(eventsAndCallbacks);
    
    if(listHtmlObj.constructor.toString().indexOf("Array") > -1){
        for(var i = 0; i < listHtmlObj.length; i++){
            listHtmlObj[i].addEventListener("touchstart", function(e){touchStart(e, ourTouch)}, false);
            listHtmlObj[i].addEventListener("touchmove", function(e){touchMove(e, ourTouch)}, false);
            listHtmlObj[i].addEventListener("touchend", function(e){touchEnd(e, ourTouch)}, false);
            listHtmlObj[i].addEventListener("touchcancel", function(e){touchEnd(e, ourTouch)}, false);
        }
    }else{
        listHtmlObj.addEventListener("touchstart", function(e){touchStart(e, ourTouch)}, false);
        listHtmlObj.addEventListener("touchmove", function(e){touchMove(e, ourTouch)}, false);
        listHtmlObj.addEventListener("touchend", function(e){touchEnd(e, ourTouch)}, false);
        listHtmlObj.addEventListener("touchcancel", function(e){touchEnd(e, ourTouch)}, false);
    }
}