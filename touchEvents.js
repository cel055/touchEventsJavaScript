var OurTouchEvents = function(){
    var listOurTouchEvent = new Array();
    var activeOurTouchEvent = null;
    var eventStartType;
    var eventMoveType;
    var eventEndType;
    var eventCancelType;
    if(window.MSPointerEvent){
        eventStartType = "MSPointerDown";
        eventMoveType = "MSPointerMove";
        eventEndType = "MSPointerUp";
        eventCancelType = "MSPointerCancel";
    }else if(window.PointerEvent){
        eventStartType = "pointerdown";
        eventMoveType = "pointermove";
        eventEndType = "pointerup";
        eventCancelType = "pointercancel";
    }else{
        eventStartType = "touchstart";
        eventMoveType = "touchmove";
        eventEndType = "touchend";
        eventCancelType = "touchcancel";
    }

    var OurTouchEvent = function(listHtmlObjP, eventsAndCallbacksP){
        this.id;
        this.listHtmlObj = listHtmlObjP;
        this.eventsAndCallbacks = eventsAndCallbacksP;
        this.stillActive;
        this.listOurTouches = new Array();
        
        this.findOurTouch = function(id){
            for(var i = 0; i < this.listOurTouches.length; i++){
                if(this.listOurTouches[i].id == id){
                    return i;
                }
            }
            return -1;
        }
        
        this.touchesToString = function(){
            var string = "this our touch event id : " + this.id + "\n";
            for(var i = 0; i < this.listOurTouches.length; i++){
                string += this.listOurTouches[i].attrToString() + "\n";
            }
            return string;
        }
        
        this.removeOurTouchEvent = function(){
            var size = this.listHtmlObj.length;
            for(var i = 0; i < size; i++){
                this.listHtmlObj[i].removeEventListener("touchstart", function(e){touchStart(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchmove", function(e){touchMove(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchend", function(e){touchEnd(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchcancel", function(e){touchEnd(e, ourTouchEvent)}, false);
            }
            
            size = listOurTouchEvent.length;
            for(var i = 0; i < size; i++){
                if(listOurTouchEvent[i].id == this.id){
                    listOurTouchEvent.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    var OurTouch = function(touch){
        this.id = ((window.TouchEvent) ? touch.identifier : touch.pointerId);
        this.target = touch.target;
        this.startPressing = new Date().getTime();
        this.stopPressing = null;
        this.firstTouch = false;
        
        this.firstScreenX = touch.screenX;
        this.firstScreenY = touch.screenY;
        this.firstPageX = touch.pageX;
        this.firstPageY = touch.pageY;
        this.firstClientX = touch.clientX;
        this.firstClientY = touch.clientY;
        
        this.screenX = touch.screenX;
        this.screenY = touch.screenY;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
        this.clientX = touch.clientX;
        this.clientY = touch.clientY;
        this.firstMove = true;
        
        this.update = function(touch){
            this.screenX = touch.screenX;
            this.screenY = touch.screenY;
            this.pageX = touch.pageX;
            this.pageY = touch.pageY;
            this.clientX = touch.clientX;
            this.clientY = touch.clientY;
        }
        
        this.attrToString = function(){
            return "{id : " + this.id + "\nisFirstTouch : " + this.firstTouch + "\ntarget id : " + this.target.id + "\nstartPressing : " + this.startPressing + "\nstopPressing : " + this.stopPressing + "\nfirstScreenX : " + this.firstScreenX + "\nfirstScreenY : " + this.firstScreenY + "\nfirstPageX : " + this.firstPageX + "\nfirstPageY : " + this.firstPageY + "\nfirstClientX : " + this.firstClientX + "\nfirstClientY : " + this.firstClientY + "\nscreenX : " + this.screenX + "\nscreenY : " + this.screenY + "\npageX : " + this.pageX + "\npageY : " + this.pageY + "\nclientX : " + this.clientX + "\nclientY : " + this.clientY + "}";
        }
    }
    
    this.addTouchEvent = function (listHtmlObj, eventsAndCallbacks){
        var localList;
        if(listHtmlObj.constructor.toString().indexOf("Array") > -1){
            localList = new Array();
            localList.push(listHtmlObj);
        }else{
            localList = listHtmlObj;
        }
        var ourTouchEvent = new OurTouchEvent(localList, eventsAndCallbacks);
        
        
        do{
            ourTouchEvent.id = Math.floor(Math.random() * 100);
        }while(notUniqueId(ourTouchEvent.id));

        listOurTouchEvent.push(ourTouchEvent);
        
        var size = localList.length;
        for(var i = 0; i < size; i++){
            localList[i].addEventListener(eventStartType, function(e){touchStart(e, ourTouchEvent)}, false);
            localList[i].addEventListener(eventMoveType, function(e){touchMove(e, ourTouchEvent)}, false);
            localList[i].addEventListener(eventEndType, function(e){touchEnd(e, ourTouchEvent)}, false);
            localList[i].addEventListener(eventCancelType, function(e){touchCancel(e, ourTouchEvent)}, false);
        }
    }

    function touchStart(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var listNewOurTouch = new Array();
        var newOurTouch;
        for(var i = 0; i < event.changedTouches.length; i++){
            newOurTouch = new OurTouch(event.changedTouches[i]);
            if(activeOurTouchEvent.listOurTouches.length <= 0){
                newOurTouch.firstTouch = true;
            }else{
                newOurTouch.firstTouch = false;
            }
            activeOurTouchEvent.listOurTouches.push(newOurTouch);
            listNewOurTouch.push(newOurTouch);
        }
        activeOurTouchEvent.stillActive = true;
        if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("start")){
            activeOurTouchEvent.eventsAndCallbacks.start(event, activeOurTouchEvent, listNewOurTouch);
        }
    }

    function touchMove(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var touches = event.changedTouches;
        var size = touches.length;
        var touchesMoved = new Array();
        var ourTouch;

        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch(touches[i].identifier);
            if(index >= 0){
                ourTouch = activeOurTouchEvent.listOurTouches[index];
                ourTouch.update(touches[i]);
                touchesMoved.push(ourTouch);
                if(ourTouch.firstMove){
                    if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("moving")){
                        event.preventDefault();
                    }else if((activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeRight") || activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeLeft")) && Math.abs(ourTouch.firstScreenX - ourTouch.screenX) >= 10){
                        event.preventDefault();
                    }else if((activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeUp") || activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeDown")) && Math.abs(ourTouch.firstScreenY - ourTouch.screenY) >= 10){
                        event.preventDefault();
                    }
                    ourTouch.firstMove = false;
                }
            }else{
                console.log("touch not founded");
            }
        }
        if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("moving")){
            activeOurTouchEvent.eventsAndCallbacks.moving(event, activeOurTouchEvent, touchesMoved);
        }
    }

    function touchEnd(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        
        if(event.touches.length <= 0){
            activeOurTouchEvent.stillActive = false;
        }
        
        var touches = event.changedTouches;
        var size = touches.length;
        var deactivatedTouches = new Array();
        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch(touches[i].identifier);
            if(index >= 0){
                activeOurTouchEvent.listOurTouches[index].stopPressing = new Date().getTime();
                activeOurTouchEvent.listOurTouches[index].update(touches[i]);
                deactivatedTouches.push(activeOurTouchEvent.listOurTouches[index]);
//                activeOurTouchEvent.listOurTouches.splice(index, 1);
            }else{
                console.log("touch not founded");
            }
        }
        
        if(!activeOurTouchEvent.stillActive){
            var ourTouch;
            for(var i = 0; i < deactivatedTouches.length; i++){
                ourTouch = deactivatedTouches[i];
                if(ourTouch.firstTouch){
                    if(ourTouch.stopPressing - ourTouch.startPressing <= 100 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("tap") && Math.abs(ourTouch.firstScreenX - ourTouch.screenX) <= 5 && Math.abs(ourTouch.firstScreenY - ourTouch.screenY) <= 5){
                        activeOurTouchEvent.eventsAndCallbacks.tap(event, activeOurTouchEvent);
                    }else if(ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenX - ourTouch.screenX >= 50 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeRight")){
                        activeOurTouchEvent.eventsAndCallbacks.swipeRight(event, activeOurTouchEvent);
                    }else if(ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenX - ourTouch.screenX <= -50 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeLeft")){
                        activeOurTouchEvent.eventsAndCallbacks.swipeLeft(event, activeOurTouchEvent);
                    }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("holded")){
                        activeOurTouchEvent.eventsAndCallbacks.holded(event, activeOurTouchEvent);
                    }
                }
            }
            activeOurTouchEvent.listOurTouches = new Array();
        }
    }
    
    function touchCancel(event, ourTouchEvent){
        console.log("touch canceled");
    }

    function notUniqueId(id){
        var size = listOurTouchEvent.length;
        for(var i = 0; i < size; i++){
            if(listOurTouchEvent[i].id == id){
                return true;
            }
        }
        return false;
    }
}
