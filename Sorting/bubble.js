var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const BubbleSortButton = document.querySelector(".BubbleSort");
BubbleSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Bubble Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Bubble Sort</strong> is a simple sorting algorithm that repeatedly steps through the list, 
        compares adjacent elements and swaps them if they are in the wrong order.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Start from the first element</li>
            <li>Compare with the next element</li>
            <li>Swap if they are in the wrong order</li>
            <li>Repeat until no more swaps are needed</li>
        </ol>
        <p>The algorithm gets its name because smaller elements "bubble" to the top of the list.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`void bubbleSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                // swap
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n²) - When array is reverse sorted
- Average Case: Θ(n²) - Typical case
- Best Case: Ω(n) - When array is already sorted

Space Complexity: O(1) - In-place sorting`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        await BubbleSort();
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

async function BubbleSort() {
    shouldReset = false;
    const barContainers = document.querySelectorAll('.bar-container');
    
    for (let i = 0; i < barContainers.length - 1; i++) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        
        for (let j = 0; j < barContainers.length - i - 1; j++) {
            if (shouldReset) {
                resetBarColors();
                removeComparisonIndicators();
                return;
            }
            
            const num1 = parseInt(barContainers[j].querySelector('.bar-number').textContent);
            const num2 = parseInt(barContainers[j + 1].querySelector('.bar-number').textContent);
            const bar1 = barContainers[j].querySelector('.bar');
            const bar2 = barContainers[j + 1].querySelector('.bar');
            
            // Show comparison indicators
            createComparisonIndicator(j, j + 1);
            
            bar1.style.background = 'rgb(250, 5, 54)';
            bar2.style.background = 'rgb(250, 5, 54)';
            
            incrementComparison();
            
            let shouldSwap = false;
            let comparisonSymbol = '';
            
            if (sortOrder === 'ascending') {
                shouldSwap = num1 > num2;
                comparisonSymbol = shouldSwap ? '>' : '<=';
            } else {
                shouldSwap = num1 < num2;
                comparisonSymbol = shouldSwap ? '<' : '>=';
            }
            
            updateComparisonDisplay(num1, num2, comparisonSymbol);
            
            if (shouldSwap) {
                await waitforme(delay);
                if (shouldReset) {
                    resetBarColors();
                    removeComparisonIndicators();
                    return;
                }
                swapping(j, j + 1);
                beep.play();
            }
            
            bar1.style.background = 'rgb(245, 212, 24)';
            bar2.style.background = 'rgb(245, 212, 24)';
            
            // Remove indicators after comparison is done
            removeComparisonIndicators();
            updateComparisonDisplay('', '', '');
        }
        
        if (!shouldReset) {
            barContainers[barContainers.length - 1 - i].querySelector('.bar').style.background = 'rgb(0,255,0)';
        }
    }
    
    if (!shouldReset) {
        barContainers[0].querySelector('.bar').style.background = 'rgb(0,255,0)';
    }
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}
