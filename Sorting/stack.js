const stackBody = document.querySelector("#mainbody");
const sizeValue = document.querySelector("#size_value");
const stackInput = document.querySelector("#stack-input");
const pushBtn = document.querySelector("#push-btn");
const popBtn = document.querySelector("#pop-btn");
const clearBtn = document.querySelector("#clear-btn");
const backBtn = document.querySelector("#back-btn");
const maximizeBtn = document.querySelector("#maximize-btn");

let stack = [];
const MAX_SIZE = 10; // Maximum stack size

// Audio effects
var pushSound = new Audio('beep.mp3');
var popSound = new Audio('wrong.mp3');

function updateStackVisualization() {
    // Clear the stack visualization
    while (stackBody.firstChild) {
        stackBody.removeChild(stackBody.firstChild);
    }
    
    // Update the size display
    sizeValue.textContent = `${stack.length} / ${MAX_SIZE}`;
    
    // Add elements to the visualization
    for (let i = 0; i < stack.length; i++) {
        const element = document.createElement("div");
        element.className = 'stack-element';
        if (i === stack.length - 1) {
            element.classList.add('top-element');
        }
        element.textContent = stack[i];
        stackBody.appendChild(element);
    }
}

function pushToStack() {
    if (stack.length >= MAX_SIZE) {
        alert("Stack overflow! Maximum size reached.");
        return;
    }
    
    const value = stackInput.value.trim();
    if (value === "") {
        alert("Please enter a value to push");
        return;
    }
    
    stack.push(value);
    stackInput.value = "";
    updateStackVisualization();
    pushSound.play();
}

function popFromStack() {
    if (stack.length === 0) {
        alert("Stack underflow! Stack is empty.");
        return;
    }
    
    const poppedValue = stack.pop();
    alert(`Popped value: ${poppedValue}`);
    updateStackVisualization();
    popSound.play();
}

function clearStack() {
    if (stack.length === 0) {
        alert("Stack is already empty");
        return;
    }
    
    if (confirm("Are you sure you want to clear the stack?")) {
        stack = [];
        updateStackVisualization();
    }
}

// Event listeners
pushBtn.addEventListener('click', pushToStack);
popBtn.addEventListener('click', popFromStack);
clearBtn.addEventListener('click', clearStack);

// Allow pressing Enter to push
stackInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        pushToStack();
    }
});

// Back button to return to sorting visualizer
backBtn.addEventListener('click', function() {
    window.location.href = 'sorting.html';
});

// Maximize button implementation
maximizeBtn.addEventListener('click', function() {
    document.getElementById('fullbody').classList.toggle('maximized');
    this.textContent = document.getElementById('fullbody').classList.contains('maximized') ? 
        'Minimize' : 'Maximize';
});

// Initialize with empty stack visualization
updateStackVisualization();