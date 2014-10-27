var toque = null;

var Toque = function(tapCallBack, leftCallBack, rightCallBack){
    this.begin;
    this.touch;
    this.tap = tapCallBack;
    this.swipeLeft = leftCallBack;
    this.swipeRight = rightCallBack;

    this.copyTouch = function(touch){
        this.touch = {identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY}
    }
}

function addTouchEvent(htmlObj, listCallbacks){
    toque = new Toque(listCallbacks[0], listCallbacks[1], listCallbacks[2]);
    htmlObj.addEventListener("touchstart", touchStart, false);
    htmlObj.addEventListener("touchend", touchEnd, false);
}

function removeTouchEvent(htmlObj){
    htmlObj.removeEventListener("touchstart", touchStart, false);
    htmlObj.removeEventListener("touchend", touchEnd, false);
    toque = null;
}

function touchStart(evento){
    toque.begin = new Date().getTime();
    toque.copyTouch(evento.changedTouches[0]);
}

function touchEnd(evento){
    if(new Date().getTime() - toque.begin <= 500 && toque.touch.pageX - evento.changedTouches[0].screenX >= 75){
        console.log("swipe right event");
        toque.swipeRight();
    }else if(new Date().getTime() - toque.begin <= 500 && toque.touch.pageX - evento.changedTouches[0].screenX <= -75){
        console.log("swipe left event");
        toque.swipeLeft();
    }else{
        console.log("outra coisa que não o swipe");
        toque.tap();
    }
}