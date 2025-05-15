var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const SelectionSortButton = document.querySelector(".SelectionSort");
SelectionSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Selection Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Selection Sort</strong> is an in-place comparison sorting algorithm that divides the input list into two parts.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Find the minimum (or maximum) element in the unsorted portion</li>
            <li>Swap it with the first unsorted element</li>
            <li>Repeat the process for the remaining unsorted portion</li>
        </ol>
        <p>The algorithm maintains two subarrays: sorted and unsorted.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`void selectionSort(int arr[]) {
    int n = arr.length;
    
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
                
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n²) - All cases
- Average Case: O(n²) - All cases
- Best Case: O(n²) - Even when array is sorted

Space Complexity: O(1) - In-place sorting`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        await SelectionSort();
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

async function SelectionSort() {
    shouldReset = false;
    const barContainers = document.querySelectorAll('.bar-container');
    
    for (let i = 0; i < barContainers.length - 1; i++) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        
        let targetIndex = i;
        barContainers[i].querySelector('.bar').style.background = 'rgb(250, 5, 54)';
        
        for (let j = i + 1; j < barContainers.length; j++) {
            if (shouldReset) {
                resetBarColors();
                removeComparisonIndicators();
                return;
            }
            
            barContainers[j].querySelector('.bar').style.background = 'rgb(245, 212, 24)';
            await waitforme(delay);
            
            incrementComparison();
            
            let shouldUpdateTarget = false;
            if (sortOrder === 'ascending') {
                shouldUpdateTarget = parseInt(barContainers[j].querySelector('.bar-number').textContent) < 
                                    parseInt(barContainers[targetIndex].querySelector('.bar-number').textContent);
                updateComparisonDisplay(
                    parseInt(barContainers[j].querySelector('.bar-number').textContent),
                    parseInt(barContainers[targetIndex].querySelector('.bar-number').textContent),
                    '<'
                );
            } else {
                shouldUpdateTarget = parseInt(barContainers[j].querySelector('.bar-number').textContent) > 
                                    parseInt(barContainers[targetIndex].querySelector('.bar-number').textContent);
                updateComparisonDisplay(
                    parseInt(barContainers[j].querySelector('.bar-number').textContent),
                    parseInt(barContainers[targetIndex].querySelector('.bar-number').textContent),
                    '>'
                );
            }
            
            if (shouldUpdateTarget) {
                if (targetIndex !== i) {
                    barContainers[targetIndex].querySelector('.bar').style.background = 'cyan';
                }
                targetIndex = j;
            } else {
                barContainers[j].querySelector('.bar').style.background = 'cyan';
            }
            updateComparisonDisplay('', '', '');
        }
        
        if (!shouldReset) {
            if (targetIndex !== i) {
                beep.play();
                await waitforme(delay);
                swapping(targetIndex, i);
                incrementSwap();
            }
            barContainers[targetIndex].querySelector('.bar').style.background = 'cyan';
            barContainers[i].querySelector('.bar').style.background = 'rgb(0,255,0)';
        }
    }
    
    if (!shouldReset) {
        barContainers[barContainers.length - 1].querySelector('.bar').style.background = 'rgb(0,255,0)';
    }
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}