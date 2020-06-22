# Dragit

Dragit helps to create an easy to set up drag and drop application. Dragit uses html classes to manage the locations that a specific element can be placed.
# Usage
```
const settings = {
    dragItemClass: 'draggable',
    dragHousingClass: 'draggable-housing',
    placeholderId: 'draggable-placeholder'
}

const dragit = new Dragit(settings);
```
### Settings
* dragItemClass - the class name of each item that can be moved 
* dragHousingClass - the class name of the container that will house the items being moved
* placeholderId - an identifier for the placeholder that will indicate the place the moved item will be placed once the item is released
