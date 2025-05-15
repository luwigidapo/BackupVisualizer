var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const InsertionSortButton = document.querySelector(".InsertionSort");
InsertionSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Insertion Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Insertion Sort</strong> is a simple sorting algorithm that builds the final sorted array one item at a time.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Start from the second element</li>
            <li>Compare it with the elements before it</li>
            <li>Shift the greater elements one position up</li>
            <li>Insert the current element in its correct position</li>
            <li>Repeat until the array is sorted</li>
        </ol>
        <p>It is much less efficient on large lists than more advanced algorithms.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`void insertionSort(int arr[]) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n²) - All cases
- Average Case: Θ(n²) - All cases
- Best Case: Ω(n²) - Even when array is sorted

Space Complexity: O(1) - In-place sorting`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        await InsertionSort();
        if (!shouldReset) {
            done.play();
            selectText.innerHTML = `Sorting Complete!`;
            stopTimer();
        }
    } catch (e) {
        console.log("Sorting was interrupted");
    }
    
    enableSortingBtn();
    enableSizeSlider();
    enableNewArrayBtn();
});

async function InsertionSort() {
    shouldReset = false;
    const barContainers = document.querySelectorAll('.bar-container');
    
    for (let i = 1; i < barContainers.length; i++) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        
        let j = i - 1;
        const keyHeight = barContainers[i].querySelector('.bar').style.height;
        const keyValue = parseInt(barContainers[i].querySelector('.bar-number').textContent);
        barContainers[i].querySelector('.bar').style.background = 'rgb(250, 5, 54)';
        
        await waitforme(delay);
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }

        let comparisonResult;
        if (sortOrder === 'ascending') {
            comparisonResult = j >= 0 && parseInt(barContainers[j].querySelector('.bar-number').textContent) > keyValue;
        } else {
            comparisonResult = j >= 0 && parseInt(barContainers[j].querySelector('.bar-number').textContent) < keyValue;
        }

        while (comparisonResult) {
            incrementComparison();
            
            if (sortOrder === 'ascending') {
                updateComparisonDisplay(parseInt(barContainers[j].querySelector('.bar-number').textContent), keyValue, '>');
            } else {
                updateComparisonDisplay(parseInt(barContainers[j].querySelector('.bar-number').textContent), keyValue, '<');
            }
            
            barContainers[j].querySelector('.bar').style.background = 'rgb(9, 102, 2)';
            barContainers[j + 1].querySelector('.bar').style.height = barContainers[j].querySelector('.bar').style.height;
            barContainers[j + 1].querySelector('.bar-number').textContent = barContainers[j].querySelector('.bar-number').textContent;
            
            j--;
            
            beep.play();
            await waitforme(delay);
            if (shouldReset) {
                resetBarColors();
                removeComparisonIndicators();
                return;
            }

            for (let k = i; k >= 0; k--) {
                barContainers[k].querySelector('.bar').style.background = 'rgb(3, 252, 11)';
            }

            if (sortOrder === 'ascending') {
                comparisonResult = j >= 0 && parseInt(barContainers[j].querySelector('.bar-number').textContent) > keyValue;
            } else {
                comparisonResult = j >= 0 && parseInt(barContainers[j].querySelector('.bar-number').textContent) < keyValue;
            }
        }
        
        incrementComparison(); // Count the final comparison that exits the loop
        updateComparisonDisplay('', '', '');
        
        if (!shouldReset) {
            barContainers[j + 1].querySelector('.bar').style.height = keyHeight;
            barContainers[j + 1].querySelector('.bar-number').textContent = keyValue.toString();
            barContainers[i].querySelector('.bar').style.background = 'rgb(3, 252, 11)';
            incrementSwap();
        }
    }
    
    if (!shouldReset) {
        barContainers.forEach(container => {
            container.querySelector('.bar').style.background = 'rgb(0,255,0)';
        });
    }
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}