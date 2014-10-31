var OurTouchEvents = function(){
    var listOurTouches = new Array();
    var activeOurTouchEvent = null;

    var OurTouchEvent = function(listHtmlObjP, eventsAndCallbacksP){
        this.id;
        this.listHtmlObj = listHtmlObjP;
        this.eventsAndCallbacks = eventsAndCallbacksP;
        this.stillActive;
        this.listOurTouches = new Array();
        
        this.findOurTouch = function(id){
            for(var i = 0; i < this.listOurTouches.length; i++){
                if(this.listOurTouches[i].getId() == id){
                    return i;
                }
            }
            return -1;
        }
        
        this.touchesToString = function(){
            console.log("this id : " + this.id);
            for(var i = 0; i < this.listOurTouches.length; i++){
                console.log(this.listOurTouches[i].attrToString() + "\n");
            }
        }
        
        this.removeOurTouchEvent = function(){
            var size = this.listHtmlObj.length;
            for(var i = 0; i < size; i++){
                this.listHtmlObj[i].removeEventListener("touchstart", function(e){touchStart(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchmove", function(e){touchMove(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchend", function(e){touchEnd(e, ourTouchEvent)}, false);
                this.listHtmlObj[i].removeEventListener("touchcancel", function(e){touchEnd(e, ourTouchEvent)}, false);
            }
            
            size = this.listOurTouches.length;
            for(var i = 0; i < size; i++){
                if(listOurTouches[i].id == this.id){
                    listOurTouches.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    var OurTouch = function(touch, first){
        var id = touch.identifier;
        var target = touch.target;
        var startPressing = new Date().getTime();
        var stopPressing = null;
        var firstTouch = first;
        
        var firstScreenX = touch.screenX;
        var firstScreenY = touch.screenY;
        var firstPageX = touch.pageX;
        var firstPageY = touch.pageY;
        var firstClientX = touch.clientX;
        var firstClientY = touch.clientY;
        
        this.screenX = touch.screenX;
        this.screenY = touch.screenY;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
        this.clientX = touch.clientX;
        this.clientY = touch.clientY;
        
        this.getId = function(){
            return id;
        }
        
        this.getTarget = function(){
            return target;
        }
        
        this.isFirstTouch = function(){
            return firstTouch;
        }
        
        this.getStartPressing = function(){
            return startPressing;
        }
        
        this.setStopPressing = function(){
            stopPressing = new Date().getTime();
        }
        
        this.getStopPressing = function(){
            return stopPressing;
        }
        
        this.getFirstScreenX = function(){
            return firstScreenX;
        }
        
        this.getFirstScreenY = function(){
            return firstScreenY;
        }
        
        this.getFirstPageX = function(){
            return firstPageX;
        }
        
        this.getFirstPageY = function(){
            return firstPageY;
        }
        
        this.getFirstClientX = function(){
            return firstClientX
        }
        
        this.getFirstClientY = function(){
            return firstClientY;
        }
        
        this.attrToString = function(){
            return "{id : " + id + "\nisFirstTouch : " + firstTouch + "\ntarget id : " + target.id + "\nstartPressing : " + startPressing + "\nstopPressing : " + stopPressing + "\nfirstScreenX : " + firstScreenX + "\nfirstScreenY : " + firstScreenY + "\nfirstPageX : " + firstPageX + "\nfirstPageY : " + firstPageY + "\nfirstClientX : " + firstClientX + "\nfirstClientY : " + firstClientY + "\nscreenX : " + this.screenX + "\nscreenY : " + this.screenY + "\npageX : " + this.pageX + "\npageY : " + this.pageY + "\nclientX : " + this.clientX + "\nclientY : " + this.clientY + "}";
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

        listOurTouches.push(ourTouchEvent);
        
        var size = localList.length;
        for(var i = 0; i < size; i++){
            localList[i].addEventListener("touchstart", function(e){touchStart(e, ourTouchEvent)}, false);
            localList[i].addEventListener("touchmove", function(e){touchMove(e, ourTouchEvent)}, false);
            localList[i].addEventListener("touchend", function(e){touchEnd(e, ourTouchEvent)}, false);
            localList[i].addEventListener("touchcancel", function(e){touchEnd(e, ourTouchEvent)}, false);
        }
    }

    function touchStart(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var listNewOurTouch = new Array();
        var newOurTouch;
        for(var i = 0; i < event.changedTouches.length; i++){
            if(activeOurTouchEvent.listOurTouches.length <= 0){
                newOurTouch = new OurTouch(event.changedTouches[i], true);
                activeOurTouchEvent.listOurTouches.push(newOurTouch);
                listNewOurTouch.push(newOurTouch);
            }else{
                newOurTouch = new OurTouch(event.changedTouches[i], false);
                activeOurTouchEvent.listOurTouches.push(newOurTouch);
                listNewOurTouch.push(newOurTouch);
            }
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
        var touchesMoved = new Array()
        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch(touches[i].identifier);
            if(index >= 0){
                activeOurTouchEvent.listOurTouches[index].screenX = touches[i].screenX;
                activeOurTouchEvent.listOurTouches[index].screenY = touches[i].screenY;
                activeOurTouchEvent.listOurTouches[index].pageX = touches[i].pageX;
                activeOurTouchEvent.listOurTouches[index].pageY = touches[i].pageY;
                activeOurTouchEvent.listOurTouches[index].clientX = touches[i].clientX;
                activeOurTouchEvent.listOurTouches[index].clientY = touches[i].clientY;
                touchesMoved.push(activeOurTouchEvent.listOurTouches[index]);
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
                activeOurTouchEvent.listOurTouches[index].setStopPressing();
                activeOurTouchEvent.listOurTouches[index].screenX = touches[i].screenX;
                activeOurTouchEvent.listOurTouches[index].screenY = touches[i].screenY;
                activeOurTouchEvent.listOurTouches[index].pageX = touches[i].pageX;
                activeOurTouchEvent.listOurTouches[index].pageY = touches[i].pageY;
                activeOurTouchEvent.listOurTouches[index].clientX = touches[i].clientX;
                activeOurTouchEvent.listOurTouches[index].clientY = touches[i].clientY;
                deactivatedTouches.push(activeOurTouchEvent.listOurTouches[index]);
                activeOurTouchEvent.listOurTouches.splice(index, 1);
            }else{
                console.log("touch not founded");
            }
        }
        
        if(!activeOurTouchEvent.stillActive){
            var ourTouch;
            for(var i = 0; i < deactivatedTouches.length; i++){
                ourTouch = deactivatedTouches[i];
                if(ourTouch.isFirstTouch){
                    if(ourTouch.getStopPressing() - ourTouch.getStartPressing() <= 300 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("tap")){
                        activeOurTouchEvent.eventsAndCallbacks.tap(event, activeOurTouchEvent);
                    }else if(ourTouch.getStopPressing() - ourTouch.getStartPressing() <= 500 && ourTouch.getFirstScreenX - ourTouch.screenX >= 75 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeRight")){
                        activeOurTouchEvent.eventsAndCallbacks.swipeRight(event, activeOurTouchEvent);
                    }else if(ourTouch.getStopPressing() - ourTouch.getStartPressing() <= 500 && ourTouch.getFirstScreenX - ourTouch.screenX <= -75 && activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("swipeLeft")){
                        activeOurTouchEvent.eventsAndCallbacks.swipeLeft(event, activeOurTouchEvent);
                    }else if(activeOurTouchEvent.eventsAndCallbacks.hasOwnProperty("holded")){
                        activeOurTouchEvent.eventsAndCallbacks.holded(event, activeOurTouchEvent);
                    }
                }
            }
        }
    }
    
    function notUniqueId(id){
        var size = listOurTouches.length;
        for(var i = 0; i < size; i++){
            if(listOurTouches[i].id == id){
                return true;
            }
        }
        return false;
    }
}