var OurTouchEvents = function(){
    var listOurTouchEvent = new Array();
    var activeOurTouchEvent = null;
    var eventStartType;
    var eventMoveType;
    var eventEndType;
    var eventCancelType;
    var isPointer = false;
    if(window.MSPointerEvent){
        eventStartType = "MSPointerDown";
        eventMoveType = "MSPointerMove";
        eventEndType = "MSPointerUp";
        eventCancelType = "MSPointerCancel";
        isPointer = true;
    }else if(window.PointerEvent){
        eventStartType = "pointerdown";
        eventMoveType = "pointermove";
        eventEndType = "pointerup";
        eventCancelType = "pointercancel";
        isPointer = true;
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
        this.listRemovedOurTouches = new Array();
        
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
        
        this.deactivetedTouchesToString = function(){
            var string = "this our touch event id : " + this.id + "\n";
            for(var i = 0; i < this.removedOurTouches.length; i++){
                string += this.removedOurTouches[i].attrToString() + "\n";
            }
            return string;
        }
        
        this.removeOurTouchEvent = function(){
            var size = this.listHtmlObj.length;
            for(var i = 0; i < size; i++){
                this.listHtmlObj[i].removeEventListener(eventStartType, function(e){touchStart(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener(eventMoveType, function(e){touchMove(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener(eventEndType, function(e){touchEnd(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener(eventCancelType, function(e){touchEnd(e, ourTouchEvent)}, false);
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
        this.id = ((isPointer) ? touch.pointerId : touch.identifier);
        this.target = touch.target;
        this.startPressing = new Date().getTime();
        this.stopPressing = null;
        this.firstTouch = false;
        this.active = true;
        
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
            return "{\nid : " + this.id + "\nisFirstTouch : " + this.firstTouch + "\ntarget id : " + this.target.id + "\nstartPressing :\t" + this.startPressing + "\nstopPressing :\t" + this.stopPressing + "\nfirstScreenX :\t" + this.firstScreenX + "\tfirstScreenY :\t" + this.firstScreenY + "\ncurreScreenX :\t" + this.screenX + "\tcurreScreenY :\t" + this.screenY + "\nfirstPageX :\t" + this.firstPageX + "\tfirstPageY :\t" + this.firstPageY + "\ncurrePageX :\t" + this.pageX + "\tcurrePageY :\t" + this.pageY + "\nfirstClientX :\t" + this.firstClientX + "\tfirstClientY :\t" + this.firstClientY + "\ncurreClientX :\t" + this.clientX + "\tcurreClientY :\t" + this.clientY + "\n}";
        }
    }
    
    this.addTouchEvent = function (listHtmlObj, eventsAndCallbacks){
        var localList;
        if(listHtmlObj.constructor.toString().indexOf("Array") > -1 || listHtmlObj.constructor.toString().indexOf("NodeList") > -1){
            localList = listHtmlObj;
        }else{
            localList = new Array();
            localList.push(listHtmlObj);
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
        var newTouches;
        var listNewOurTouch = new Array();
        var newOurTouch;
        if(isPointer){
            newTouches = new Array();
            newTouches.push(event);
        }else{
            newTouches = event.changedTouches;
        }
        for(var i = 0; i < newTouches.length; i++){
            newOurTouch = new OurTouch(newTouches[i]);
            if(activeOurTouchEvent.listOurTouches.length <= 0){
                newOurTouch.firstTouch = true;
            }else{
                newOurTouch.firstTouch = false;
            }
            activeOurTouchEvent.listOurTouches.push(newOurTouch);
            listNewOurTouch.push(newOurTouch);
        }
        activeOurTouchEvent.stillActive = true;
        event.stopPropagation();
        if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("start")){
            activeOurTouchEvent.eventsAndCallbacks.start(event, activeOurTouchEvent, listNewOurTouch);
        }
    }

    function touchMove(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var touches;
        if(isPointer){
            touches = new Array();
            touches.push(event);
        }else{
            touches = event.changedTouches;
        }
        var size = touches.length;
        var ourTouchesMoved = new Array();
        var ourTouch;

        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch((isPointer) ? touches[i].pointerId : touches[i].identifier);
            if(index >= 0){
                ourTouch = activeOurTouchEvent.listOurTouches[index];
                ourTouch.update(touches[i]);
                ourTouchesMoved.push(ourTouch);
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
        event.stopPropagation();
        if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("moving")){
            activeOurTouchEvent.eventsAndCallbacks.moving(event, activeOurTouchEvent, ourTouchesMoved);
        }
    }

    function touchEnd(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var ourTouch;
        
        var touches;
        if(isPointer){
            touches = new Array();
            touches.push(event);
        }else{
            touches = event.changedTouches;
        }
        var size = touches.length;
        var deactivatedTouches = new Array();
        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch((isPointer) ? touches[i].pointerId : touches[i].identifier);
            if(index >= 0){
                ourTouch = activeOurTouchEvent.listOurTouches[index];
                ourTouch.stopPressing = new Date().getTime();
                ourTouch.active = false;
                ourTouch.update(touches[i]);
                deactivatedTouches.push(ourTouch);
                activeOurTouchEvent.listRemovedOurTouches.push(ourTouch);
                activeOurTouchEvent.listOurTouches.splice(index, 1);
            }else{
                console.log("touch not founded");
            }
        }
        
        if(activeOurTouchEvent.listOurTouches.length <= 0){
            activeOurTouchEvent.stillActive = false;
        }
        event.stopPropagation();
        
        for(var i = 0; i < deactivatedTouches.length; i++){
        ourTouch = deactivatedTouches[i];
            if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("tap") && ourTouch.stopPressing - ourTouch.startPressing <= 300 && Math.abs(Math.abs(ourTouch.firstScreenX - ourTouch.screenX) - Math.abs(ourTouch.firstScreenY - ourTouch.screenY)) <= 5){
                activeOurTouchEvent.eventsAndCallbacks.tap(event, activeOurTouchEvent, deactivatedTouches);
            }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeLeft") && ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenX - ourTouch.screenX >= 50){
                activeOurTouchEvent.eventsAndCallbacks.swipeLeft(event, activeOurTouchEvent, deactivatedTouches);
            }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeRight") && ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenX - ourTouch.screenX <= -50){
                activeOurTouchEvent.eventsAndCallbacks.swipeRight(event, activeOurTouchEvent, deactivatedTouches);
            }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeUp") && ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenY - ourTouch.screenY >= 50){
                activeOurTouchEvent.eventsAndCallbacks.swipeUp(event, activeOurTouchEvent, deactivatedTouches);
            }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeDown") && ourTouch.stopPressing - ourTouch.startPressing <= 500 && ourTouch.firstScreenY - ourTouch.screenY <= -50){
                activeOurTouchEvent.eventsAndCallbacks.swipeDown(event, activeOurTouchEvent, deactivatedTouches);
            }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("holded") && Math.abs(Math.abs(ourTouch.firstScreenX - ourTouch.screenX) - Math.abs(ourTouch.firstScreenY - ourTouch.screenY)) <= 5){
                activeOurTouchEvent.eventsAndCallbacks.holded(event, activeOurTouchEvent, deactivatedTouches);
            }
        }
    }
    
    function touchCancel(event, ourTouchEvent){
        console.log("touch canceled");
        var touches;
        if(isPointer){
            touches = new Array();
            touches.push(event);
        }else{
            touches = event.changedTouches;
        }
        var size = touches.length;
        for(var i = 0; i < size; i++){
            var index = ourTouchEvent.findOurTouch((isPointer) ? touches[i].pointerId : touches[i].identifier);
            if(index >= 0){
                ourTouchEvent.listOurTouches.splice(index,1);
            }else{
                console.log("touch not founded");
            }
        }
        if(ourTouchEvent.listOurTouches.length <= 0){
            ourTouchEvent.stillActive = false;
        }
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
