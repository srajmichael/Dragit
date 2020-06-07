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