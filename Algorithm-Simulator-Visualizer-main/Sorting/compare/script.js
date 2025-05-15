// sorting.js (main controller)
const generateBtn = document.getElementById('generate');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const arraySizeInput = document.getElementById('array-size');
const speedInput = document.getElementById('speed');
const algorithm1Select = document.getElementById('algorithm1');
const algorithm2Select = document.getElementById('algorithm2');
const visualization1 = document.getElementById('mainbody1');
const visualization2 = document.getElementById('mainbody2');
const comparisonCount1 = document.getElementById('comparisons1');
const swapCount1 = document.getElementById('swaps1');
const time1 = document.getElementById('time1');
const comparisonCount2 = document.getElementById('comparisons2');
const swapCount2 = document.getElementById('swaps2');
const time2 = document.getElementById('time2');

// Global variables
let array = [];
let delay = 500;
let isSorting = false;
let isPaused = false;
let sortStartTime1, sortStartTime2;
let animationId1, animationId2;

// Initialize
generateArray();

// Event listeners
generateBtn.addEventListener('click', generateArray);
startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', reset);
arraySizeInput.addEventListener('input', updateArraySize);
speedInput.addEventListener('input', updateSpeed);

// Algorithm implementations
const algorithms = {
    bubble: bubbleSort,
    insertion: insertionSort,
    selection: selectionSort,
    merge: mergeSort,
    quick: quickSort
};

function generateArray() {
    if (isSorting) return;
    
    const size = parseInt(arraySizeInput.value);
    array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
    renderBars();
    resetStats();
}

function renderBars() {
    visualization1.innerHTML = '';
    visualization2.innerHTML = '';
    
    const maxValue = Math.max(...array);
    const containerHeight1 = visualization1.clientHeight;
    const containerHeight2 = visualization2.clientHeight;
    
    array.forEach((value, index) => {
        // For algorithm 1
        const barContainer1 = document.createElement('div');
        barContainer1.className = 'bar-container';
        barContainer1.style.width = `${100 / array.length}%`;
        
        const bar1 = document.createElement('div');
        bar1.className = 'bar';
        bar1.style.height = `${(value / maxValue) * containerHeight1}px`;
        bar1.dataset.value = value;
        
        const barNumber1 = document.createElement('div');
        barNumber1.className = 'bar-number';
        barNumber1.textContent = value;
        
        barContainer1.appendChild(bar1);
        barContainer1.appendChild(barNumber1);
        visualization1.appendChild(barContainer1);
        
        // For algorithm 2
        const barContainer2 = barContainer1.cloneNode(true);
        visualization2.appendChild(barContainer2);
    });
}

async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    resetStats();
    
    const algorithm1 = algorithm1Select.value;
    const algorithm2 = algorithm2Select.value;
    
    // Start timers
    sortStartTime1 = performance.now();
    sortStartTime2 = performance.now();
    
    // Run algorithms
    const array1 = [...array];
    const array2 = [...array];
    
    animationId1 = requestAnimationFrame(() => {
        algorithms[algorithm1](array1, visualization1, 1);
    });
    
    animationId2 = requestAnimationFrame(() => {
        algorithms[algorithm2](array2, visualization2, 2);
    });
}

function reset() {
    if (isSorting) {
        cancelAnimationFrame(animationId1);
        cancelAnimationFrame(animationId2);
        isSorting = false;
    }
    generateArray();
    startBtn.disabled = false;
    generateBtn.disabled = false;
}

function resetStats() {
    comparisonCount1.textContent = '0';
    swapCount1.textContent = '0';
    time1.textContent = '0';
    comparisonCount2.textContent = '0';
    swapCount2.textContent = '0';
    time2.textContent = '0';
}

function updateArraySize() {
    document.getElementById('size-value').textContent = arraySizeInput.value;
    generateArray();
}

function updateSpeed() {
    document.getElementById('speed-value').textContent = speedInput.value;
    delay = 550 - (speedInput.value * 50); // Convert speed to delay (50-500ms)
}

// Helper functions for algorithms
function updateBarColors(container, indices, action) {
    const bars = container.querySelectorAll('.bar');
    
    // Reset all bars to default color
    bars.forEach(bar => {
        bar.classList.remove('comparing', 'swapping');
        bar.style.backgroundColor = '#3498db';
    });
    
    if (action === 'compare') {
        indices.forEach(i => {
            bars[i].style.backgroundColor = '#f1c40f'; // Yellow for comparing
        });
    } else if (action === 'swap') {
        indices.forEach(i => {
            bars[i].style.backgroundColor = '#e74c3c'; // Red for swapping
        });
        
        // Update visual positions of bars
        const [i, j] = indices;
        const bar1 = bars[i];
        const bar2 = bars[j];
        
        const tempHeight = bar1.style.height;
        bar1.style.height = bar2.style.height;
        bar2.style.height = tempHeight;
        
        // Update displayed numbers
        const tempValue = bar1.dataset.value;
        bar1.dataset.value = bar2.dataset.value;
        bar2.dataset.value = tempValue;
        bar1.nextElementSibling.textContent = bar1.dataset.value;
        bar2.nextElementSibling.textContent = bar2.dataset.value;
    }
    
    // Update statistics
    if (container === visualization1) {
        if (action === 'compare') comparisonCount1.textContent = parseInt(comparisonCount1.textContent) + 1;
        if (action === 'swap') swapCount1.textContent = parseInt(swapCount1.textContent) + 1;
        time1.textContent = Math.floor(performance.now() - sortStartTime1);
    } else {
        if (action === 'compare') comparisonCount2.textContent = parseInt(comparisonCount2.textContent) + 1;
        if (action === 'swap') swapCount2.textContent = parseInt(swapCount2.textContent) + 1;
        time2.textContent = Math.floor(performance.now() - sortStartTime2);
    }
}

function markAllAsSorted(container) {
    const bars = container.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.backgroundColor = '#2ecc71'; // Green for sorted
    });
}

// Sleep function for animations
function sleep(ms) {
    return new Promise(resolve => {
        if (isPaused) {
            const interval = setInterval(() => {
                if (!isPaused) {
                    clearInterval(interval);
                    setTimeout(resolve, ms);
                }
            }, 100);
        } else {
            setTimeout(resolve, ms);
        }
    });
}

// Pause/resume functionality
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
}
