var OurTouchEvents = function(){
    var listActiveTouches = new Array();
    var activeTouch = null;

    var OurTouch = function(eventsAndCallbacks){
        this.id;
        
        this.eventsAndCallbacks = eventsAndCallbacks;

        this.htmlObj;

        this.firstX;
        this.firstY;

        this.startPressing;
    }
    
    this.addTouchEvent = function (listHtmlObj, eventsAndCallbacks){
        var ourTouch = new OurTouch(eventsAndCallbacks);
        
        
        do{
            ourTouch.id = Math.floor(Math.random() * 100);
        }while(notUniqueId(ourTouch.id));

        listActiveTouches.push(ourTouch);
        
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

    this.removeTouchEvent = function(htmlObj){
        htmlObj.removeEventListener("touchstart", touchStart, false);
        htmlObj.removeEventListener("touchend", touchEnd, false);
    }

    function touchStart(event, ourTouch){
        ourTouch.startPressing = new Date().getTime();
        ourTouch.htmlObj = event.target;
    }

    function touchMove(event, ourTouch){
    }

    function touchEnd(event, ourTouch){
    }
    
    function notUniqueId(id){
        for(var i = 0; i < listActiveTouches.length; i++){
            if(listActiveTouches[i].id == id){
                return true;
            }
        }
        return false;
    }
}

