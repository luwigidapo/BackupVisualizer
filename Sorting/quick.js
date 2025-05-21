var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const QuickSortButton = document.querySelector(".QuickSort");
QuickSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Quick Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Quick Sort</strong> is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Pick an element as pivot (here we use last element)</li>
            <li>Partition the array such that elements less than pivot come before and greater elements come after</li>
            <li>Recursively apply the above steps to the sub-arrays</li>
        </ol>
        <p>This is one of the most efficient sorting algorithms.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n²) - When partition always picks greatest/smallest element
- Average Case: Θ(n log n) - Expected case with random data
- Best Case: Ω(n log n) - When partition picks middle element

Space Complexity: O(log n) - Due to recursion stacks`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        const barContainers = document.querySelectorAll('.bar-container');
        await QuickSort(barContainers, 0, barContainers.length - 1);
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

async function QuickSort(barContainers, low, high) {
    if (low < high) {
        const pi = await partition(barContainers, low, high);
        await QuickSort(barContainers, low, pi - 1);
        await QuickSort(barContainers, pi + 1, high);
    } else if (low >= 0 && high >= 0 && low < barContainers.length && high < barContainers.length) {
        barContainers[high].querySelector('.bar').style.background = 'rgb(0,255,0)';
        barContainers[low].querySelector('.bar').style.background = 'rgb(0,255,0)';
    }
}

async function partition(barContainers, low, high) {
    beep.play();
    const pivotValue = parseInt(barContainers[high].querySelector('.bar-number').textContent);
    barContainers[high].querySelector('.bar').style.background = 'red';
    
    let i = low - 1;
    
    for (let j = low; j <= high - 1; j++) {
        if (shouldReset) {
            resetBarColors();
            return -1;
        }
        
        barContainers[j].querySelector('.bar').style.background = 'yellow';
        await waitforme(delay);
        
        incrementComparison();
        
        let comparisonResult;
        if (sortOrder === 'ascending') {
            comparisonResult = parseInt(barContainers[j].querySelector('.bar-number').textContent) < pivotValue;
            updateComparisonDisplay(
                parseInt(barContainers[j].querySelector('.bar-number').textContent),
                pivotValue,
                '<'
            );
        } else {
            comparisonResult = parseInt(barContainers[j].querySelector('.bar-number').textContent) > pivotValue;
            updateComparisonDisplay(
                parseInt(barContainers[j].querySelector('.bar-number').textContent),
                pivotValue,
                '>'
            );
        }
        
        if (comparisonResult) {
            beep.play();
            i++;
            swapping(i, j);
            
            barContainers[i].querySelector('.bar').style.background = 'orange';
            if (i != j) barContainers[j].querySelector('.bar').style.background = 'orange';
            
            incrementSwap();
            await waitforme(delay);
        } else {
            barContainers[j].querySelector('.bar').style.background = 'pink';
        }
        updateComparisonDisplay('', '', '');
    }
    
    i++;
    await waitforme(delay);
    swapping(i, high);
    
    barContainers[high].querySelector('.bar').style.background = 'pink';
    barContainers[i].querySelector('.bar').style.background = 'green';
    
    for (let k = 0; k < barContainers.length; k++) {
        if (barContainers[k].querySelector('.bar').style.background !== 'green') {
            barContainers[k].querySelector('.bar').style.background = 'cyan';
        }
    }
    
    return i;
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}