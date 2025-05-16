// sorting.js
const output = document.querySelector('#size_value');
const bars = document.querySelector("#mainbody");
const arraySize = document.querySelector('#size_slider');
const selectText = document.querySelector('.selected');
output.innerHTML = arraySize.value;

let comparisonCount = 0;
let swapCount = 0;
let sortStartTime = 0;
let timerInterval = null;
let isPaused = false;
let shouldReset = false;
let sortingActive = false;
let resolvePause = null;
let sortOrder = 'ascending';

var arrayVal = 15;
arraySize.addEventListener('input', function () {
    selectText.innerHTML = `Size Changed`;
    output.innerHTML = this.value;
    arrayVal = this.value;
    createNewArray(arrayVal);
});

let delay = 1024; // Initial delay (slowest)
let minSpeed = 1, maxSpeed = 20; // Speed range

let delayElement = document.querySelector('#speed_slider');
const speedOutput = document.querySelector('#speed_value');
speedOutput.innerHTML = delayElement.value;

delayElement.addEventListener('input', function () {
    selectText.innerHTML = `Speed Changed`;
    const speed = parseInt(this.value);
    speedOutput.innerHTML = speed;
    delay = 1024 / Math.pow(2, speed - 1); // Adjust delay based on speed (1-20)
});

let array = [];

// Initialize with default array
createNewArray(arrayVal);

function resetCounters() {
    comparisonCount = 0;
    swapCount = 0;
    document.getElementById('comparison-count').textContent = '0';
    document.getElementById('swap-count').textContent = '0';
    document.getElementById('time-count').textContent = '0s';
    document.getElementById('comparison-display').textContent = '';
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    sortStartTime = Date.now();
    timerInterval = setInterval(() => {
        if (!isPaused) {
            const elapsed = (Date.now() - sortStartTime) / 1000;
            document.getElementById('time-count').textContent = `${elapsed.toFixed(1)}s`;
        }
    }, 100);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function incrementComparison() {
    comparisonCount++;
    document.getElementById('comparison-count').textContent = comparisonCount;
}

function incrementSwap() {
    swapCount++;
    document.getElementById('swap-count').textContent = swapCount;
}

function updateComparisonDisplay(val1, val2, comparison) {
    document.getElementById('comparison-display').textContent = `${val1} ${comparison} ${val2}`;
}

function createNewArray(arrayVal, customArray = null) {
    resetCounters();
    deleteChild();
    array = [];

    const maxHeight = 400;
    const minHeight = 20;
    const maxNumber = 1000;

    if (customArray && customArray.length > 0) {
        // Use custom array
        const maxCustomValue = Math.max(...customArray);
        const minCustomValue = Math.min(...customArray);

        for (let i = 0; i < customArray.length; i++) {
            const height = minHeight + ((customArray[i] - minCustomValue) / (maxCustomValue - minCustomValue)) * (maxHeight - minHeight);
            array.push({ height, number: customArray[i] });
        }
    } else {
        // Create proportional values
        for (let i = 0; i < arrayVal; i++) {
            const ratio = i / (arrayVal - 1);
            const height = Math.floor(ratio * (maxHeight - minHeight) + minHeight);
            const number = Math.floor(ratio * maxNumber);
            array.push({ height, number });
        }

        // Shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    for (let i = 0; i < array.length; i++) {
        const barContainer = document.createElement("div");
        barContainer.className = 'bar-container';
        barContainer.style.width = `${(96 / array.length)}vw`;

        const numberLabel = document.createElement("div");
        numberLabel.className = 'bar-number';
        numberLabel.textContent = array[i].number;
        numberLabel.style.fontSize = `${Math.max(8, 14 - Math.floor(array.length / 10))}px`;

        const bar = document.createElement("div");
        bar.style.height = `${array[i].height}px`;
        bar.className = 'bar';

        barContainer.appendChild(numberLabel);
        barContainer.appendChild(bar);
        bars.appendChild(barContainer);
    }
}

function deleteChild() {
    while (bars.firstChild) {
        bars.removeChild(bars.firstChild);
    }
}

const newArray = document.querySelector("#generate");
newArray.addEventListener("click", function () {
    createNewArray(arrayVal);
    enableSortingBtn();
    enableSizeSlider();
});

// Button states
function disableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = true;
    document.querySelector(".InsertionSort").disabled = true;
    document.querySelector(".MergeSort").disabled = true;
    document.querySelector(".QuickSort").disabled = true;
    document.querySelector(".SelectionSort").disabled = true;
}

function enableSortingBtn() {
    document.querySelector(".BubbleSort").disabled = false;
    document.querySelector(".InsertionSort").disabled = false;
    document.querySelector(".MergeSort").disabled = false;
    document.querySelector(".QuickSort").disabled = false;
    document.querySelector(".SelectionSort").disabled = false;
}

function disableSizeSlider() {
    document.querySelector("#size_slider").disabled = true;
}

function enableSizeSlider() {
    document.querySelector("#size_slider").disabled = false;
}

function disableNewArrayBtn() {
    document.querySelector("#generate").disabled = true;
}

function enableNewArrayBtn() {
    document.querySelector("#generate").disabled = false;
}

function createComparisonIndicator(index1, index2) {
    const barContainers = document.querySelectorAll('.bar-container');
    const element1 = barContainers[index1];
    const element2 = barContainers[index2];
    removeComparisonIndicators();

    const arrow = document.createElement('div');
    arrow.className = 'comparison-arrow';
    arrow.innerHTML = '⇄';

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '0';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.appendChild(arrow);
    element1.appendChild(container);
}

function removeComparisonIndicators() {
    document.querySelectorAll('.comparison-arrow').forEach(arrow => arrow.parentNode?.remove());
}

async function waitforme(milisec) {
    if (shouldReset) {
        shouldReset = false;
        throw new Error('Reset requested');
    }

    sortingActive = true;
    let startTime = Date.now();
    let elapsed = 0;

    while (elapsed < milisec) {
        if (shouldReset) {
            sortingActive = false;
            throw new Error('Reset requested');
        }

        if (isPaused) {
            await new Promise(resolve => { resolvePause = resolve; });
        }

        elapsed = Date.now() - startTime;
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    sortingActive = false;
    return '';
}

function swapping(index1, index2) {
    const barContainers = document.querySelectorAll('.bar-container');
    const element1 = barContainers[index1];
    const element2 = barContainers[index2];
    const bar1 = element1.querySelector('.bar');
    const bar2 = element2.querySelector('.bar');
    const tempHeight = bar1.style.height;
    bar1.style.height = bar2.style.height;
    bar2.style.height = tempHeight;

    const num1 = element1.querySelector('.bar-number');
    const num2 = element2.querySelector('.bar-number');
    const tempText = num1.textContent;
    num1.textContent = num2.textContent;
    num2.textContent = tempText;

    incrementSwap();
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    if (isPaused) {
        pauseBtn.textContent = "Resume";
        pauseBtn.style.backgroundColor = "#2ecc71";
        stopTimer();
    } else {
        pauseBtn.textContent = "Pause";
        pauseBtn.style.backgroundColor = "#f39c12";
        startTimer();
        if (resolvePause) {
            resolvePause();
            resolvePause = null;
        }
    }
}

function resetSorting() {
    shouldReset = true;
    isPaused = false;
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.textContent = "Pause";
    pauseBtn.style.backgroundColor = "#f39c12";

    if (resolvePause) {
        resolvePause();
        resolvePause = null;
    }

    createNewArray(arrayVal);
    enableSortingBtn();
    enableSizeSlider();
    enableNewArrayBtn();
}

// Custom array and file upload functions (max size adjusted to 60)
document.getElementById('custom-array-btn').addEventListener('click', function() {
    const input = document.getElementById('custom-array-input').value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));

    if (numbers.length > 60) {
        alert('Maximum array size is 60. Only the first 60 numbers will be used.');
        numbers.length = 60;
    }

    if (numbers.length > 0) {
        createNewArray(numbers.length, numbers);
    } else {
        alert('Please enter valid numbers separated by commas.');
    }
});

document.getElementById('upload-array-btn').addEventListener('click', function() {
    document.getElementById('array-file-input').click();
});

document.getElementById('array-file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const numbers = content.split(/[\s,]+/).map(num => parseInt(num.trim())).filter(num => !isNaN(num));
            if (numbers.length > 60) {
                alert('Maximum array size is 60. Only the first 60 numbers will be used.');
                numbers.length = 60;
            }

            if (numbers.length > 0) {
                createNewArray(numbers.length, numbers);
            } else {
                alert('No valid numbers found in the file.');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);
});

// Adjust maximize button functionality
document.getElementById('maximize-btn').addEventListener('click', function() {
    document.getElementById('fullbody').classList.toggle('maximized');
    this.textContent = document.getElementById('fullbody').classList.contains('maximized') ? 'Minimize' : 'Maximize';
});

// Adjust sort order buttons
document.getElementById('ascending-btn').addEventListener('click', function() {
    sortOrder = 'ascending';
    this.style.backgroundColor = '#27ae60';
    document.getElementById('descending-btn').style.backgroundColor = '#e74c3c';
});

document.getElementById('descending-btn').addEventListener('click', function() {
    sortOrder = 'descending';
    this.style.backgroundColor = '#c0392b';
    document.getElementById('ascending-btn').style.backgroundColor = '#2ecc71';
});

// Button event listeners
document.getElementById('pause-btn').addEventListener('click', togglePause);
document.getElementById('reset-btn').addEventListener('click', resetSorting);
