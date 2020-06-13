import './styles/dragit.css';

class Dragit{
    state = {
        dragItemClass: 'draggable-default',
        dragHousingClass: 'draggable-housing-default',
        placeholderId: 'dragging-placeholder-default'
    }

    constructor(settings = {}){
        //update state with settings
        for(let key of Object.keys(settings)){
            this.state[key] = settings[key];
        }
        //override these settings if added
        this.state.elementBeingDragged = null;
        this.state.currentlyDraggingElement = null;
        this.state.draggableHousings = Dragit.nodeListToArray(document.querySelectorAll('.' + this.state.dragHousingClass));
        this.state.draggables = Dragit.nodeListToArray(document.querySelectorAll('.' + this.state.dragItemClass));
        this.state.draggingPlaceholderElement = Dragit.createElementWithId('DIV', this.state.placeholderId);
        this.state.eventDistanceFromDraggingTopLeft = {x: 0, y: 0};
        this.state.draggingClass = 'dragging';
        
        //dragit related utilities
        this.elementIsInDraggables = this.elementIsInDraggables.bind(this);
        this.getCenterPointOfDraggedElement = this.getCenterPointOfDraggedElement.bind(this);
        this.getHoveredOverHousing = this.getHoveredOverHousing.bind(this);
        this.insertPlaceholderAfter = this.insertPlaceholderAfter.bind(this);
        this.insertPlaceholderBefore = this.insertPlaceholderBefore.bind(this);
        this.makeElementDraggable = this.makeElementDraggable.bind(this);
        this.manageDraggablePlaceholderPlacementInHousing = this.manageDraggablePlaceholderPlacementInHousing.bind(this);
        this.setElementPositionAndSizeFromBoundingClientRect = this.setElementPositionAndSizeFromBoundingClientRect.bind(this);
        this.unsetElementPositionAndSizeFromBoundingClientRect = this.unsetElementPositionAndSizeFromBoundingClientRect.bind(this);
        this.setElementLocationandFixedState = this.setElementLocationandFixedState.bind(this);
        this.unsetElementLocationandFixedState = this.unsetElementLocationandFixedState.bind(this);
        this.insertPlaceholderBeforeDraggable = this.insertPlaceholderBeforeDraggable.bind(this);
        this.replacePlaceholderWithDraggable = this.replacePlaceholderWithDraggable.bind(this);
        //dragit getters and setters
        this.getElementBeingDragged = this.getElementBeingDragged.bind(this);
        this.setElementBeingDragged = this.setElementBeingDragged.bind(this);
        this.isCurrentlyDraggingElement = this.isCurrentlyDraggingElement.bind(this);
        this.setIsCurrentlyDraggingElement = this.setIsCurrentlyDraggingElement.bind(this);
        this.getDraggableHousings = this.getDraggableHousings.bind(this);
        this.getDraggables = this.getDraggables.bind(this);
        this.getDraggingPlaceholderElement = this.getDraggingPlaceholderElement.bind(this);
        this.getEventDistanceFromDraggingTopLeft = this.getEventDistanceFromDraggingTopLeft.bind(this);
        this.setEventDistanceFromDraggingTopLeft = this.setEventDistanceFromDraggingTopLeft.bind(this);
        this.getDraggingClass = this.getDraggingClass.bind(this);
        this.getDragItemClass = this.getDragItemClass.bind(this);
        this.getDragHousingClass = this.getDragHousingClass.bind(this);
        //dragit setups and breakdowns
        this.setUpDraggingElementForDragStart = this.setUpDraggingElementForDragStart.bind(this);
        this.breakDownDraggingElementForDragEnd = this.breakDownDraggingElementForDragEnd.bind(this);
        //dragit event handlers
        this.handleOnDraggableDragStart = this.handleOnDraggableDragStart.bind(this);
        this.handleOnDraggableDragEnd = this.handleOnDraggableDragEnd.bind(this);
        this.handleCurrentlyDraggingElement = this.handleCurrentlyDraggingElement.bind(this);
        this.handleOnDraggingEvent = this.handleOnDraggingEvent.bind(this);
        //draggit event adders and removers
        this.addDraggableDragStartEventListener = this.addDraggableDragStartEventListener.bind(this);
        this.addDraggingEventToDraggedElement = this.addDraggingEventToDraggedElement.bind(this);
        this.removeDraggingEventToDraggedElement = this.removeDraggingEventToDraggedElement.bind(this);

        this.init = this.init.bind(this);
        this.init();
    }


    /************* UTILITIES *********/
    static appendElementToBody(element){
        document.body.appendChild(element);  
    }

    static createElementWithId(elementType, id){
        const element = document.createElement(elementType);
        element.id = id;
        return element;
    }

    static elementIsInteractiveHtmlElement(element){
        const interactiveElements = ['button', 'a', 'input', 'select'];
        return interactiveElements.includes(element.tagName.toLowerCase());
    }

    /**
     * 
     * @param {Element} element 
     * @param {Event} event 
     * @param {Number} index
     * @returns {Object} Object.x - horizontal distance
     *                   Object.y - vertical distance
     */
    static eventDistanceFromTopLeftOfElement(element, event, index=0){
        let eventX = Dragit.isMouseEvent(event) ? event.clientX : Dragit.isTouchEvent(event) ? event.touches[index].clientX : -1;
        let eventY = Dragit.isMouseEvent(event) ? event.clientY : Dragit.isTouchEvent(event) ? event.touches[index].clientY : -1;
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
     * 
     * @param {Element} element 
     * @return {Object} Object.x - center horizonal point of element
     *                  Object.y - center vertical point of element
     */
    static getCenterPointOfElement(element){
        let rect = element.getBoundingClientRect();
        let centerX = (rect.width / 2) + rect.left;
        let centerY = (rect.height / 2) + rect.top;
        return {x: centerX, y: centerY};
    }

    /**
     * 
     * @param {Element} element 
     * @return {Number} The element index in relation to it's parentNode's children
     */
    static getElementIndex(element){
        let parent = element.parentNode;
        let children = parent.children;
        for(let i = 0; i < children.length; i++){
            if(children[i] === element){
                return i;
            }
        }
        return -1;
    }

    /**
     * 
     * @param {Event} event 
     * @param {Number} touchIndex - indicates which touch index to use if required
     * @return {Object} Object.x - horizontal point of event
     *                  Objecy.y - vertical point of event
     */
    static getSinglePointXYFromEvent(event, touchIndex = 0){
        if(Dragit.isTouchEvent(event)){
            return {x: event.touches[touchIndex].clientX, y: event.touches[touchIndex].clientY}
        }
        return {x: event.clientX, y: event.clientY}
    }

    static isMouseEvent(event){
        return event.type.includes('mouse');
    }

    static isTouchEvent(event){
        return event.type.includes('touch');
    }

    /**
     * 
     * @param {Object} point - Has Object.x and Object.y referring to a horizontal and vertical point
     * @param {Element} element 
     * @returns {Boolean} True if point is within element
     */
    static pointIsInsideElement(point, element){
        let rect = element.getBoundingClientRect();
        let left = rect.left;
        let right = rect.left + rect.width;
        let top = rect.top;
        let bottom = rect.top + rect.height;
    
        return (left <= point.x) && (point.x <= right) && (top <= point.y) && (point.y <= bottom);
    }

    static nodeListToArray(nodeList){
        return Array.prototype.slice.call(nodeList)
    }
    /************* ./UTILITIES *********/


 



    /************* Dragit RELATED UTILITIES *********/
    elementIsInDraggables(element){
        return this.getDraggables().includes(element);
    }

    getCenterPointOfDraggedElement(){
        const dragging = this.getElementBeingDragged();
        return Dragit.getCenterPointOfElement(dragging);
    }

    getHoveredOverHousing(event){
        const point = Dragit.getSinglePointXYFromEvent(event, 0);
        const housings = this.getDraggableHousings();
        for(let i = 0; i < housings.length; i++){
            if(Dragit.pointIsInsideElement(point, housings[i])){
                return housings[i];
            }
        }
        return null;
    }

    insertPlaceholderBefore(element){
        const placeholder = this.getDraggingPlaceholderElement();
        element.parentNode.insertBefore(placeholder, element);
    }
    
    insertPlaceholderAfter(element){
       const index = Dragit.getElementIndex(element);
       const children = element.parentNode.children;
       const placeholder = this.getDraggingPlaceholderElement();
    
       if(children.length - 1 == index){
        element.parentNode.appendChild(placeholder);
       }else{
        element.parentNode.insertBefore(placeholder, children[index + 1]);
       }
    }

    makeElementDraggable(element){
        this.addDraggableDragStartEventListener(element);
    }

    setElementPositionAndSizeFromBoundingClientRect(element){
        const rect = element.getBoundingClientRect();
        element.style.height = rect.height + 'px';
        element.style.width = rect.width + 'px';
        element.style.top = rect.top + 'px';
        element.style.left = rect.left + 'px';
    }
    
    unsetElementPositionAndSizeFromBoundingClientRect(element){
        element.style.height = '';
        element.style.width = '';
        element.style.top = '';
        element.style.left = '';
    }
    
   setElementLocationandFixedState(element){
        this.setElementPositionAndSizeFromBoundingClientRect(element);
        element.style.position = 'fixed';
    }
    
    unsetElementLocationandFixedState(element){
        this.unsetElementPositionAndSizeFromBoundingClientRect(element);
        element.style.position = 'relative';
    }

    insertPlaceholderBeforeDraggable(draggableElement){
        const placeholder = this.getDraggingPlaceholderElement();
        draggableElement.parentNode.insertBefore(placeholder,draggableElement);
    }
    
    replacePlaceholderWithDraggable(draggableElement){
        const placeholder = this.getDraggingPlaceholderElement();
        placeholder.parentNode.replaceChild(draggableElement, placeholder);
    }
    /************* ./Dragit RELATED UTILITIES *********/


    /************* Dragit GETTERS AND SETTERS *********/

    getElementBeingDragged(){
        return this.state.elementBeingDragged;
    }
    setElementBeingDragged(element){
        this.state.elementBeingDragged = element;
    }
    isCurrentlyDraggingElement(){
        return this.state.currentlyDraggingElement;
    }
    setIsCurrentlyDraggingElement(bool){
        this.state.currentlyDraggingElement = bool;
    }
    getDraggableHousings(){
        return this.state.draggableHousings;
    }
    getDraggables(){
        return this.state.draggables;
    }
    getDraggingPlaceholderElement(){
        return this.state.draggingPlaceholderElement;
    }
    getEventDistanceFromDraggingTopLeft(){
        return this.state.eventDistanceFromDraggingTopLeft;
    }
    setEventDistanceFromDraggingTopLeft(element, event){
        this.state.eventDistanceFromDraggingTopLeft = Dragit.eventDistanceFromTopLeftOfElement(element, event);
    }
    getDraggingClass(){
        return this.state.draggingClass;
    }
    getDragItemClass(){
        return this.state.dragItemClass;
    }
    getDragHousingClass(){
        return this.state.dragHousingClass;
    }
    /************* ./Dragit GETTERS AND SETTERS *********/

    /************* Dragit SETUPS AND BREAKDOWNS *********/
    setUpDraggingElementForDragStart(draggingElement){
        draggingElement.classList.add(this.getDraggingClass());
        this.setElementBeingDragged(draggingElement);
        this.addDraggingEventToDraggedElement();
        this.setElementLocationandFixedState(draggingElement);
        this.insertPlaceholderBeforeDraggable(draggingElement);
        Dragit.appendElementToBody(draggingElement);
    }

    breakDownDraggingElementForDragEnd(){
        const dragging = this.getElementBeingDragged();
        dragging.classList.remove(this.getDraggingClass());
        this.removeDraggingEventToDraggedElement()
        this.setElementBeingDragged(null);
        this.unsetElementLocationandFixedState(dragging);
        this.replacePlaceholderWithDraggable(dragging);
    }


    /************* ./Dragit SETUPS AND BREAKDOWNS *********/


    /************* Dragit EVENT HANDLERS *********/
    handleOnDraggableDragStart(event){
        if(!Dragit.elementIsInteractiveHtmlElement(event.target)){
            let draggingElement = event.target;
            
            if(!draggingElement.classList.contains(this.getDragItemClass())){
                draggingElement = event.target.closest('.' + this.getDragItemClass());
            }
            if(draggingElement){
                this.setElementBeingDragged(draggingElement);
                this.setEventDistanceFromDraggingTopLeft(draggingElement, event);
                this.setUpDraggingElementForDragStart(draggingElement, event);
                this.setIsCurrentlyDraggingElement(true);
            }
        }
    }

    handleOnDraggableDragEnd(){
        if(this.isCurrentlyDraggingElement()){
            this.breakDownDraggingElementForDragEnd();
            this.setIsCurrentlyDraggingElement(false);
        }
    }

    handleCurrentlyDraggingElement(event){
        if(this.isCurrentlyDraggingElement()){
            const element = this.getElementBeingDragged();
            const touchDistance = this.getEventDistanceFromDraggingTopLeft();
            const left = Dragit.isTouchEvent(event) ? (event.touches[0].clientX - touchDistance.x) : Dragit.isMouseEvent(event) ? (event.clientX - touchDistance.x) : -1;
            const top = Dragit.isTouchEvent(event) ? (event.touches[0].clientY - touchDistance.y) : Dragit.isMouseEvent(event) ? (event.clientY - touchDistance.y) : -1;
            element.style.top = top + 'px';
            element.style.left = left + 'px';
        }
    }

    handleOnDraggingEvent(event){
        const housing = this.getHoveredOverHousing(event);
        if(housing){
            this.manageDraggablePlaceholderPlacementInHousing(housing);
        }
    }



    manageDraggablePlaceholderPlacementInHousing(housing){
        const children = housing.children;
        const point = this.getCenterPointOfDraggedElement();
        const placeholder = this.getDraggingPlaceholderElement(); 

        if(children.length == 0){
            housing.appendChild(placeholder);
        }else{
            let hasBeenPlaced = false;
            let spotIsPlaceholder = false;
            let wouldReplacePlaceholder = false;
            let isOverDraggable = false;
            let isOverPlaceholder = false;

            for(let i = 0; i < children.length; i++){
                //if point is not in element, ignore it
                if(Dragit.pointIsInsideElement(point, children[i])){
                    const center = Dragit.getCenterPointOfElement(children[i]);

                    if(this.elementIsInDraggables(children[i])){
                        isOverDraggable = true;
                        if(center.y > point.y){
                            //check if there's an element before current child
                            if(i !== 0){
                                if(children[i-1] !== placeholder){
                                    this.insertPlaceholderBefore(children[i]);
                                    hasBeenPlaced = true;
                                }else{
                                    wouldReplacePlaceholder = true;
                                }
                            }else{
                                this.insertPlaceholderBefore(children[i]);
                                hasBeenPlaced = true;
                            }
                        }else{
                            if(i !== children.length - 1){
                                if(children[i+1] !== placeholder){
                                    this.insertPlaceholderAfter(children[i]);
                                    hasBeenPlaced = true;
                                }else{
                                    wouldReplacePlaceholder = true;
                                }
                            }else{
                                this.insertPlaceholderAfter(children[i]);
                                hasBeenPlaced = true;
                            }
                        }

                    }else if(children[i] === placeholder){
                        isOverPlaceholder = true;
                    }
                }
            }



            if(!wouldReplacePlaceholder && !hasBeenPlaced && !(isOverDraggable || isOverPlaceholder)){
                housing.appendChild(placeholder);
            }

        }
    }



    init(){
        document.body.addEventListener('mousemove', this.handleCurrentlyDraggingElement, false);
        document.body.addEventListener('touchmove', this.handleCurrentlyDraggingElement, false);
        document.body.addEventListener('touchend', this.handleOnDraggableDragEnd, false);
        document.body.addEventListener('mouseup', this.handleOnDraggableDragEnd, false);
        const draggables = this.getDraggables();
        for(let i = 0; i < draggables.length; i++){
            this.makeElementDraggable(draggables[i]);
        }
    }




    /************* ./Dragit EVENT HANDLERS *********/



    /************* Dragit EVENT ADDERS AND REMOVERS *********/
    addDraggableDragStartEventListener(draggableElement){
        draggableElement.addEventListener('mousedown', this.handleOnDraggableDragStart);
        draggableElement.addEventListener('touchstart', this.handleOnDraggableDragStart);
    }
    
    addDraggingEventToDraggedElement(){
        const dragging = this.getElementBeingDragged();
        dragging.addEventListener('mousemove', this.handleOnDraggingEvent);
        dragging.addEventListener('touchmove', this.handleOnDraggingEvent);
    }
    
    removeDraggingEventToDraggedElement(){
        const dragging = this.getElementBeingDragged();
        dragging.removeEventListener('mousemove', this.handleOnDraggingEvent);
        dragging.removeEventListener('touchmove', this.handleOnDraggingEvent);
    }

    /************* ./Dragit EVENT ADDERS AND REMOVERS *********/

}







const settings = {
    dragItemClass: 'draggable',
    dragHousingClass: 'draggable-housing',
    placeholderId: 'dragging-placeholder'
}


let dragitter = new Dragit(settings);

const settings2 = {
    dragItemClass: 'draggable-right',
    dragHousingClass: 'draggable-housing-right',
    placeholderId: 'dragging-placeholder-right'
}

let dragitter2 = new Dragit(settings2);


let deepSettings = {
    dragItemClass: 'deep-drag',
    dragHousingClass: 'deep-house',
    placeholderId: 'dragging-placeholder-deep'
}

let deep = new Dragit(deepSettings);

let deepestSettings = {
    dragItemClass: 'deepest-drag',
    dragHousingClass: 'deepest-housing',
    placeholderId: 'dragging-placeholder-deep'
}

let deepest = new Dragit(deepestSettings);