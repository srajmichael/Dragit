import './styles/dragit.css';


const DRAGGING_CLASS = 'dragging';

let elementBeingDragged = null
let currentlyDraggingElement = false;

let draggableHousings = getStartingDraggableHousings();

function getStartingDraggableHousings(){
    let housings = document.querySelectorAll('.draggable-housing');
    return Array.prototype.slice.call(housings);
}



 /**
  * @TODO change dragging listeners to window
  * @TOD make functions rely on getElementBeingDragged()
  */

/**
 * DRAGGABLE PLACEHOLDER 
 */
const draggingPlaceholderElement = document.createElement('DIV');
draggingPlaceholderElement.id = 'dragging-placeholder';

function getDraggingPlaceholderElement(){
    return draggingPlaceholderElement;
}

function insertPlaceholderBeforeDraggable(draggableElement){
    const placeholder = getDraggingPlaceholderElement();
    draggableElement.parentNode.insertBefore(placeholder,draggableElement);
}

function replacePlaceholderWithDraggable(draggableElement){
    const placeholder = getDraggingPlaceholderElement();
    placeholder.parentNode.replaceChild(draggableElement, placeholder);
}

/**
 * ./DRAGGABLE PLACEHOLDER 
 */


 /**
 * CURRENTLY DRAGGING 
 */
let currentlyDragging = null;

function setElementBeingDragged(element){
    elementBeingDragged = element;
}

function getElementBeingDragged(){
    return elementBeingDragged;
}




/**
 * ./CURRENTLY DRAGGING 
 */


 /**
 * MOUSE DISTANCE FROM ELEMENT TOP LEFT
 */
let eventDistanceFromDraggingTopLeft = {x: 0, y: 0};

function setEventDistanceFromDraggingTopLeftForMouse(element, event){
    eventDistanceFromDraggingTopLeft = eventDistanceFromTopLeftOfElementForMouse(element, event);
}

function getEventDistanceFromDraggingTopLeft(){
    return eventDistanceFromDraggingTopLeft;
}

function setEventDistanceFromDraggingTopLeftForTouch(element, event){
    eventDistanceFromDraggingTopLeft = eventDistanceFromTopLeftOfElementForTouch(element, event);
}

function eventDistanceFromTopLeftOfElementForMouse(element, event){
    let eventX = event.clientX;
    let eventY = event.clientY;
    let rect = element.getBoundingClientRect();
    let elementTop = rect.top;
    let elementLeft = rect.left;

    let newY = eventY - elementTop;
    let newX = eventX - elementLeft;
    return {
        x: newX,
        y: newY
    }
    
}
function eventDistanceFromTopLeftOfElementForTouch(element, event){
    let eventX = event.touches[0].clientX;
    let eventY = event.touches[0].clientY;
    let rect = element.getBoundingClientRect();
    let elementTop = rect.top;
    let elementLeft = rect.left;

    let newY = eventY - elementTop;
    let newX = eventX - elementLeft;
    return {
        x: newX,
        y: newY
    }
    
}
/**
 * ./MOUSE DISTANCE FROM ELEMENT TOP LEFT
 */



/**
 * MISC HELPER FUNCTIONS
 */

function getSinglePointXYFromEvent(event, index = null){
    let type = event.type;
    if(type === 'touch'){
        if(index === null){
            index = 0;
        }
        return {x: event.touches[touchIndex].clientX, y: event.touches[touchIndex].clientY}
    }
    return {x: event.clientX, y: event.clientY}
}


function setElementPositionAndSizeFromBoundingClientRect(element){
    let rect = element.getBoundingClientRect();
    element.style.height = rect.height + 'px';
    element.style.width = rect.width + 'px';
    element.style.top = rect.top + 'px';
    element.style.left = rect.left + 'px';
}

function unsetElementPositionAndSizeFromBoundingClientRect(element){
    element.style.height = '';
    element.style.width = '';
    element.style.top = '';
    element.style.left = '';
}

function setElementLocationandFixedState(element){
    setElementPositionAndSizeFromBoundingClientRect(element);
    element.style.position = 'fixed';
}

function unsetElementLocationandFixedState(element){
    unsetElementPositionAndSizeFromBoundingClientRect(element);
    element.style.position = 'relative';
}

function getElementIndex(element){
    let parent = element.parentNode;
    let children = parent.children;
    for(let i = 0; i < children.length; i++){
        if(children[i] === element){
            return i;
        }
    }
    return -1;
}

function appendElementToBody(element){
    document.body.appendChild(element);  
}

function pointIsInsideElement(point, element){
    let rect = element.getBoundingClientRect();
    let left = rect.left;
    let right = rect.left + rect.width;
    let top = rect.top;
    let bottom = rect.top + rect.height;

    return (left <= point.x) && (point.x <= right) && (top <= point.y) && (point.y <= bottom);
}
/**
 * ./MISC HELPER FUNCTIONS
 */


/**
 * DRAGGABLE EVENTS
 */

 //start
 function dragStartInitializer(draggingElement, event){
    draggingElement.classList.add(DRAGGING_CLASS);
    setElementBeingDragged(draggingElement);
    addDraggingEventToDraggedElement();
    setElementLocationandFixedState(draggingElement);
    insertPlaceholderBeforeDraggable(draggingElement);
    appendElementToBody(draggingElement);
}

function handleOnDraggableDragStartForMouse(event){
    let draggingElement = this;
    setElementBeingDragged(draggingElement);
    setEventDistanceFromDraggingTopLeftForMouse(draggingElement, event);
    dragStartInitializer(draggingElement, event);
    currentlyDraggingElement = true;
}   

function handleOnDraggableDragStartForTouch(event){
    event.preventDefault();
    let draggingElement = this;
    setElementBeingDragged(draggingElement);
    setEventDistanceFromDraggingTopLeftForTouch(draggingElement, event);
    dragStartInitializer(draggingElement, event);
    currentlyDraggingElement = true;
}  


function addDraggableDragStartEventListener(draggableElement){
    draggableElement.addEventListener('mousedown',handleOnDraggableDragStartForMouse);
    draggableElement.addEventListener('touchstart',handleOnDraggableDragStartForTouch);
}

function addDraggingEventToDraggedElement(){
    let dragging = getElementBeingDragged();
    dragging.addEventListener('mousemove', handleBeingDraggedEvent);
}
function removeDraggingEventToDraggedElement(){
    let dragging = getElementBeingDragged();
    dragging.removeEventListener('mousemove', handleBeingDraggedEvent);
}
function handleBeingDraggedEvent(event){
    let housing = getHoveredOverHousing(event);
    console.log(housing)
}


//end
function dragEndInitializer(){
    let dragging = getElementBeingDragged();
    dragging.classList.remove(DRAGGING_CLASS);
    removeDraggingEventToDraggedElement()
    setElementBeingDragged(null);
    unsetElementLocationandFixedState(dragging);
    replacePlaceholderWithDraggable(dragging);
    currentlyDraggingElement = false;
}
function handleOnDraggableDragEndForMouse(event){
    if(currentlyDraggingElement){
        dragEndInitializer();
    }
}

function handleOnDraggableDragEndForTouch(event){
    event.preventDefault();
    if(currentlyDraggingElement){
        dragEndInitializer();
    }
}

//dragging
function handleOnDraggingForTouch(event){
    if(currentlyDraggingElement){
        handleCurrentlyDraggingElementWithTouch(event);
    }
}

function handleOnDraggingForMouse(event){
    if(currentlyDraggingElement){
        handleCurrentlyDraggingElementWithMouse(event);
    }
}

function handleCurrentlyDraggingElementWithMouse(e){
    let element = getElementBeingDragged();
    let mouseDistance = getEventDistanceFromDraggingTopLeft();
    let left = e.clientX - mouseDistance.x;
    let top = e.clientY - mouseDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}

function handleCurrentlyDraggingElementWithTouch(e){
    // e.preventDefault();
    let element = getElementBeingDragged();
    let touchDistance = getEventDistanceFromDraggingTopLeft();
    let left = e.touches[0].clientX - touchDistance.x;
    let top = e.touches[0].clientY - touchDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}
/**
 * ./DRAGGABLE EVENTS
 */


/**
 * HOUSING EVENTS
 */


/**
 * ./HOUSING EVENTS
 */





 /**
  * @TODO 
  */


document.body.addEventListener('mousemove', handleOnDraggingForMouse, false);
document.body.addEventListener('touchmove', handleOnDraggingForTouch, false);
document.body.addEventListener('touchend', handleOnDraggableDragEndForTouch, false);
document.body.addEventListener('mouseup',handleOnDraggableDragEndForMouse, false);







function makeElementDraggable(element){
    addDraggableDragStartEventListener(element);
}



let draggables = document.querySelectorAll('.draggable');

for(let i = 0; i < draggables.length; i++){
    makeElementDraggable(draggables[i]);
}




function getHoveredOverHousing(event){
    const point = getSinglePointXYFromEvent(event, 0);
    let housings = draggableHousings;
    for(let i = 0; i < housings.length; i++){
        if(pointIsInsideElement(point, housings[i])){
            return housings[i];
        }
    }
    return null;
}




function insertPlaceholderBefore(element){
    let placeholder = getDraggingPlaceholderElement();
    element.parentNode.insertBefore(placeholder, element);
}


function insertPlaceholderAfter(element){
   let index = getElementIndex(element);
   let children = element.parentNode.children;
   let placeholder = getDraggingPlaceholderElement();

   if(children.length - 1 == index){
    element.parentNode.appendChild(placeholder);
   }else{
    element.parentNode.insertBefore(placeholder, children[index + 1]);
   }
}

function getCenterPointOfDraggedElement(){
    let dragging = getElementBeingDragged();
    return getCenterPointOfElement(dragging);
}

function getCenterPointOfElement(element){
    let rect = element.getBoundingClientRect();
    let centerX = (rect.width / 2) + rect.left;
    let centerY = (rect.height / 2) + rect.top;
    return {x: centerX, y: centerY};
}




document.getElementById('house').addEventListener('mousemove', function(e){
    if(currentlyDraggingElement){
        let house = this;
        let children = house.children;
        let point = getCenterPointOfDraggedElement();
        let placeholder = getDraggingPlaceholderElement(); 
    
        for(let i = 0; i < children.length; i++){
            if(pointIsInsideElement(point, children[i])){
                let rect = children[i].getBoundingClientRect();
                let center = getCenterPointOfElement(children[i]);
                if(center.y > point.y){
                    if(i !== 0){
                        if(children[i-1] !== placeholder){
                            insertPlaceholderBefore(children[i]);
                        }
                    }else{
                        insertPlaceholderBefore(children[i]);
                    }
                }else{
                    if(i !== children.length - 1){
                        if(children[i+1] !== placeholder){
                            insertPlaceholderAfter(children[i]);
                        }
                    }else{
                        insertPlaceholderAfter(children[i]);
                    }
                    
                }
            }
        }
    }


})





