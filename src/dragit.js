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
let mouseDistanceFromDraggingTopLeft = {x: 0, y: 0};

function setMouseDistanceFromDraggingTopLeft(element, event){
    mouseDistanceFromDraggingTopLeft = eventDistanceFromTopLeftOfElement(element, event);
}

function getMouseDistanceFromDraggingTopLeft(){
    return mouseDistanceFromDraggingTopLeft;
}

function setMouseDistanceFromDraggingTopLeftTouch(element, event){
    mouseDistanceFromDraggingTopLeft = eventDistanceFromTopLeftOfElementTouch(element, event);
}

function eventDistanceFromTopLeftOfElement(element, event){
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
function eventDistanceFromTopLeftOfElementTouch(element, event){
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

const useMouseEvents = true;
let mouseIsDown = false;

function handleOnDraggableDragStart(event){
    let draggable = this;
    draggable.classList.add(DRAGGING_CLASS);
    setCurrentlyDragging(draggable);
    setMouseDistanceFromDraggingTopLeft(draggable, event)
    setElementLocationandFixedState(draggable);
    insertPlaceholderBeforeDraggable(draggable);
    appendElementToBody(draggable);
    addDraggableDragEvent(draggable);
}

function handleOnDraggableDragStartTouch(event){
    event.preventDefault();
    let draggable = this;
    draggable.classList.add(DRAGGING_CLASS);
    setCurrentlyDragging(draggable);
    setMouseDistanceFromDraggingTopLeftTouch(draggable, event)
    setElementLocationandFixedState(draggable);
    insertPlaceholderBeforeDraggable(draggable);
    appendElementToBody(draggable);
    addDraggableDragEvent(draggable);
}


function handleOnDraggableDragEnd(event){
    let draggable = this;
    draggable.classList.remove(DRAGGING_CLASS);
    setCurrentlyDragging(null);
    unsetElementLocationandFixedState(draggable);
    removeDraggableDragEvent(draggable);
    replacePlaceholderWithDraggable(draggable);
}

function handleOnDraggableDragEndTouch(event){
    event.preventDefault();
    let draggable = this;
    draggable.classList.remove(DRAGGING_CLASS);
    setCurrentlyDragging(null);
    unsetElementLocationandFixedState(draggable);
    removeDraggableDragEvent(draggable);
    replacePlaceholderWithDraggable(draggable);
}

function addDraggableDragEvent(element){
    if(useMouseEvents){
        element.addEventListener('mousemove', dragCurrentlyDraggingElement);
        element.addEventListener('touchmove', dragCurrentlyDraggingElementTouch);
        
    }else{
        element.addEventListener('drag', dragCurrentlyDraggingElement);
    }
    
}

function removeDraggableDragEvent(element){
    if(useMouseEvents){
        element.removeEventListener('mousemove', dragCurrentlyDraggingElement);
        element.removeEventListener('touchmove', dragCurrentlyDraggingElementTouch);
    }else{
        element.removeEventListener('drag', dragCurrentlyDraggingElement);
    }
    
}

function dragCurrentlyDraggingElement(e){
    let element = this;
    let mouseDistance = getMouseDistanceFromDraggingTopLeft();
    let left = e.clientX - mouseDistance.x;
    let top = e.clientY - mouseDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}
function dragCurrentlyDraggingElementTouch(e){
    e.preventDefault();
    let element = this;
    let mouseDistance = getMouseDistanceFromDraggingTopLeft();
    let left = e.touches[0].clientX - mouseDistance.x;
    let top = e.touches[0].clientY - mouseDistance.y;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}

function addDraggableDragStartEventListener(draggableElement){
    if(useMouseEvents){
        draggableElement.addEventListener('mousedown',handleOnDraggableDragStart);
        draggableElement.addEventListener('touchstart',handleOnDraggableDragStartTouch);
    }else{
        draggableElement.addEventListener('dragstart',handleOnDraggableDragStart);
    }
}

function addDraggableDragEndEventListener(draggableElement){
    if(useMouseEvents){
        draggableElement.addEventListener('mouseup',handleOnDraggableDragEnd);
        draggableElement.addEventListener('touchend',handleOnDraggableDragEndTouch);
    }else{
        draggableElement.addEventListener('dragend',handleOnDraggableDragEnd);
    }
}
/**
 * ./DRAGGABLE EVENTS
 */

function makeElementDraggable(element){
    if(!useMouseEvents){
        element.draggable = 'true';
    }
    
    addDraggableDragStartEventListener(element);
    addDraggableDragEndEventListener(element);
}



let draggables = document.querySelectorAll('.draggable');

for(let i = 0; i < draggables.length; i++){
    makeElementDraggable(draggables[i]);
}