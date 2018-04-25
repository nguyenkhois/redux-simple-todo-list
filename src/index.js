"use strict";
import {createStore} from 'redux';
import css from './styles.css';

/* Template for the action object
let action = {
    type: 'YOUR_TYPE',
    task: { id: <task_id>,
            description: <task_description>,
            isDone: <task_status:true/false> }
}*/

//Functions
function renderContent(){
    let allTasks = store.getState(); //Redux method
    let todoList = document.createElement('ul');

    allTasks.map(item=>{
        let task = document.createElement('li');

        //Create checkbox
        let taskCheckBox = document.createElement('input')
        taskCheckBox.setAttribute('type','checkbox');
        taskCheckBox.addEventListener('click',()=>handleCheck(item.id));

        //Create description
        let taskText = document.createTextNode(item.description);
     
        //Create button for removing
        let taskButton = document.createElement('button')
        taskButton.append(document.createTextNode('Remove'));
        taskButton.addEventListener('click',()=>handleRemove(item.id));

        //Check task is done or not
        if (item.isDone){
            task.classList.add('strike-text');
            taskCheckBox.setAttribute('checked','');
        }  else null;

        //Render Todo list
        task.append(taskCheckBox, taskText, taskButton); //Render whole a task
        todoList.appendChild(task); //Append a task to the Todo list
    });

    //Render whole the app and a button "Remove completed" at the end of todo list
    dspResults.innerHTML = '';
    if (allTasks.filter(item=>item.isDone).length > 0){
        let btnRemoveCompleted = document.createElement('button')
        btnRemoveCompleted.append(document.createTextNode('Remove completed'));
        btnRemoveCompleted.setAttribute('type','button');
        btnRemoveCompleted.addEventListener('click',handleRemoveCompleted);

        dspResults.append(todoList, btnRemoveCompleted);
    } else dspResults.appendChild(todoList);
}

function handleRemove(itemId){
    let action = {type:'REMOVE_TASK', task: {id: itemId}};
    store.dispatch(action); //Redux method
    renderContent();
}

function handleRemoveCompleted(){
    let action = {type: 'REMOVE_COMPLETED'};
    store.dispatch(action);
    renderContent();
}

function handleCheck(itemId){
    let action = {type:'CHECKED', task: {id: itemId}};
    store.dispatch(action); //Redux method
    renderContent();
}

// STEP 1 - Create the reducer
let userReducer = (state, action) => {
    if (state === undefined)
        state = [];
    
    //Definitions for action object here
    switch(action.type){
        case 'ADD_TASK':
            return state.concat(action.task);
            break;
        case 'REMOVE_TASK':
            return state.filter(item=>item.id !== action.task.id);
            break;
        case 'CHECKED':
            const itemIndex = state.findIndex(item=>item.id === action.task.id);
            const newState = state.map((item, index)=> index === itemIndex ? {...item, isDone: !item.isDone} : item);
            return newState;
            break;
        case 'REMOVE_COMPLETED':
            return state.filter(item=>!item.isDone);
            break;
        default:
            return state;
            break;
    } 
};

// STEP 2 - Create a store by passing in the reducer
let store = createStore(userReducer); //Redux method

// STEP 3 - Dispatch our action to the store. It changes the state by store.dispatch(action);
let txtInput = document.getElementById('txtInput');
let dspResults = document.getElementById('dspResults');

txtInput.focus();
txtInput.addEventListener('keydown',e=>{
    let userInput = txtInput.value.trim();
    if (e.keyCode === 13 && userInput.length > 0){
        let newTask = { id: Date.now(), description: userInput, isDone: false };
        let action = { type: 'ADD_TASK', task: newTask };
        store.dispatch(action); //Redux method

        txtInput.value = '';
        txtInput.focus();
        renderContent();
    }
});