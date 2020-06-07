import './styles/dragit.css';


const DRAGGING_CLASS = 'dragging';

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

function setCurrentlyDragging(element){
    currentlyDragging = element;
}

function getCurrentlyDragging(){
    return currentlyDragging;
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
/**
 * ./MISC HELPER FUNCTIONS
 */


/**
 * DRAGGABLE EVENTS
 */
function dragStartInitializer(draggable, event){
    draggable.classList.add(DRAGGING_CLASS);
    setCurrentlyDragging(draggable);
    setElementLocationandFixedState(draggable);
    insertPlaceholderBeforeDraggable(draggable);
    appendElementToBody(draggable);
    addDraggableDragEvent(draggable);
}

function dragEndInitializer(draggable, event){
    draggable.classList.remove(DRAGGING_CLASS);
    setCurrentlyDragging(null);
    unsetElementLocationandFixedState(draggable);
    removeDraggableDragEvent(draggable);
    replacePlaceholderWithDraggable(draggable);
}

function handleOnDraggableDragStartForMouse(event){
    let draggable = this;
    setEventDistanceFromDraggingTopLeftForMouse(draggable, event);
    dragStartInitializer(draggable, event);
}   

function handleOnDraggableDragStartForTouch(event){
    event.preventDefault();
    let draggable = this;
    setEventDistanceFromDraggingTopLeftForTouch(draggable, event);
    dragStartInitializer(draggable, event);
}  

function handleCurrentlyDraggingElementWithMouse(e){
    let element = this;
    let mouseDistance = getEventDistanceFromDraggingTopLeft();
    let left = e.clientX - mouseDistance.x;
    let top = e.clientY - mouseDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}

function handleCurrentlyDraggingElementWithTouch(e){
    e.preventDefault();
    let element = this;
    let touchDistance = getEventDistanceFromDraggingTopLeftTouch();
    let left = e.touches[0].clientX - touchDistance.x;
    let top = e.touches[0].clientY - touchDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}

function handleOnDraggableDragEndForMouse(event){
    let draggable = this;
    dragEndInitializer(draggable, event);
}

function handleOnDraggableDragEndForTouch(event){
    event.preventDefault();
    let draggable = this;
    dragEndInitializer(draggable, event);
}

function addDraggableDragEvent(element){
    element.addEventListener('mousemove', handleCurrentlyDraggingElementWithMouse);
    element.addEventListener('touchmove', handleCurrentlyDraggingElementWithTouch);
}

function removeDraggableDragEvent(element){
    element.removeEventListener('mousemove', handleCurrentlyDraggingElementWithMouse);
    element.removeEventListener('touchmove', handleCurrentlyDraggingElementWithTouch); 
}

function addDraggableDragStartEventListener(draggableElement){
    draggableElement.addEventListener('mousedown',handleOnDraggableDragStartForMouse);
    draggableElement.addEventListener('touchstart',handleOnDraggableDragStartForTouch);
}

function addDraggableDragEndEventListener(draggableElement){
    draggableElement.addEventListener('mouseup',handleOnDraggableDragEndForMouse);
    draggableElement.addEventListener('touchend',handleOnDraggableDragEndForTouch);
}
/**
 * ./DRAGGABLE EVENTS
 */

function makeElementDraggable(element){
    addDraggableDragStartEventListener(element);
    addDraggableDragEndEventListener(element);
}



let draggables = document.querySelectorAll('.draggable');

for(let i = 0; i < draggables.length; i++){
    makeElementDraggable(draggables[i]);
}