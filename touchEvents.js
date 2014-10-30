var OurTouchEvents = function(){
    var listOurTouches = new Array();
    var activeOurTouchEvent = null;

    var OurTouchEvent = function(eventsAndCallbacks){
        this.id;
        this.eventsAndCallbacks = eventsAndCallbacks;
        this.stillActive;
        this.listOurTouches = new Array();
        
        this.findOurTouch = function(id){
            for(var i = 0; i < listOurTouches.length; i++){
                if(listOurTouches[i].getId() == id){
                    return i;
                }
            }
            return -1;
        }
        
        this.touchesToString = function(){
            console.log("this id : " + this.id);
            for(var i = 0; i < this.listOurTouches.length; i++){
                console.log(this.listOurTouches[i].attrToString + "\n");
            }
        }
    }
    
    var OurTouch = function(touch){
        var id = touch.identifier;
        var target = touch.target;
        var startPressing = new Date().getTime();
        var stopPressing = null;
        
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
            return "{id : " + id + "\ntarget id : " + target.id + "\nstartPressing : " + startPressing + "\nstopPressing : " + stopPressing + "\nfirstScreenX : " + firstScreenX + "\nfirstScreenY : " + firstScreenY + "\nfirstPageX : " + firstPageX + "\nfirstPageY : " + firstPageY + "\nfirstClientX : " + firstClientX + "\nfirstClientY : " + firstClientY + "\nscreenX : " + this.screenX + "\nscreenY : " + this.screenY + "\npageX : " + this.pageX + "\npageY : " + this.pageY + "\nclientX : " + this.clientX + "\nclientY : " + this.clientY + "}";
        }
    }
    
    this.addTouchEvent = function (listHtmlObj, eventsAndCallbacks){
        var ourTouchEvent = new OurTouchEvent(eventsAndCallbacks);
        
        
        do{
            ourTouchEvent.id = Math.floor(Math.random() * 100);
        }while(notUniqueId(ourTouchEvent.id));

        listOurTouches.push(ourTouchEvent);
        
        if(listHtmlObj.constructor.toString().indexOf("Array") > -1){
            var size = listHtmlObj.length;
            for(var i = 0; i < size; i++){
                listHtmlObj[i].addEventListener("touchstart", function(e){touchStart(e, ourTouchEvent)}, false);
                listHtmlObj[i].addEventListener("touchmove", function(e){touchMove(e, ourTouchEvent)}, false);
                listHtmlObj[i].addEventListener("touchend", function(e){touchEnd(e, ourTouchEvent)}, false);
                listHtmlObj[i].addEventListener("touchcancel", function(e){touchEnd(e, ourTouchEvent)}, false);
            }
        }else{
            listHtmlObj.addEventListener("touchstart", function(e){touchStart(e, ourTouchEvent)}, false);
            listHtmlObj.addEventListener("touchmove", function(e){touchMove(e, ourTouchEvent)}, false);
            listHtmlObj.addEventListener("touchend", function(e){touchEnd(e, ourTouchEvent)}, false);
            listHtmlObj.addEventListener("touchcancel", function(e){touchEnd(e, ourTouchEvent)}, false);
        }
    }

    this.removeTouchEvent = function(htmlObj){
        htmlObj.removeEventListener("touchstart", touchStart, false);
        htmlObj.removeEventListener("touchend", touchEnd, false);
    }

    function touchStart(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        activeOurTouchEvent.stillActive = true;
        for(var i = 0; i < event.changedTouches.length; i++){
            activeOurTouchEvent.listOurTouches.push(new OurTouch(event.changedTouches[i]));
        }
    }

    function touchMove(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var touches = event.changedTouches;
        var size = touches.length;
        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch(touches[i].identifier);
            if(index >= 0){
                activeOurTouchEvent.listOurTouches[index].screenX = touches[i].screenX;
                activeOurTouchEvent.listOurTouches[index].screenY = touches[i].screenY;
                activeOurTouchEvent.listOurTouches[index].pageX = touches[i].pageX;
                activeOurTouchEvent.listOurTouches[index].pageY = touches[i].pageY;
                activeOurTouchEvent.listOurTouches[index].clientX = touches[i].clientX;
                activeOurTouchEvent.listOurTouches[index].clientY = touches[i].clientY;
            }else{
                console.log("touch not founded");
            }
        }
    }

    function touchEnd(event, ourTouchEvent){
        activeOurTouchEvent = ourTouchEvent;
        var touches = event.changedTouches;
        var size = touches.length;
        var deactivatedTouches = new Array();
        for(var i = 0; i < size; i++){
            var index = activeOurTouchEvent.findOurTouch(touches[i].identifier);
            if(index >= 0){
                activeOurTouchEvent.listOurTouches[index].setStopPressing();
                deactivatedTouches.push(activeOurTouchEvent.listOurTouches[index]);
                activeOurTouchEvent.listOurTouches.splice(index, 1);
            }else{
                console.log("touch not founded");
            }
        }
        if(event.touches.length <= 0){
            activeOurTouchEvent.stillActive = false;
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

