var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const MergeSortButton = document.querySelector(".MergeSort");
MergeSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Merge Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Merge Sort</strong> is a divide-and-conquer algorithm that divides the input array into two halves, sorts them recursively, and then merges the sorted halves.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Divide the unsorted list into n sublists, each containing one element</li>
            <li>Repeatedly merge sublists to produce new sorted sublists</li>
            <li>Continue until there is only one sublist remaining</li>
        </ol>
        <p>This is the sorted list.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    
    int L[] = new int[n1];
    int R[] = new int[n2];
    
    for (int i = 0; i < n1; ++i)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j)
        R[j] = arr[m + 1 + j];
        
    int i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n log n) - All cases
- Average Case: Θ(n log n) - All cases
- Best Case: Ω(n log n) - All cases

Space Complexity: O(n) - Requires auxiliary space`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        const barContainers = document.querySelectorAll('.bar-container');
        await MergeSort(barContainers, 0, barContainers.length - 1);
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

async function MergeSort(barContainers, l, r) {
    if (l >= r) {
        return;
    }
    
    const m = l + Math.floor((r - l) / 2);
    await MergeSort(barContainers, l, m);
    await MergeSort(barContainers, m + 1, r);
    await Merge(barContainers, l, m, r);
}

async function Merge(barContainers, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    // Highlight left and right halves
    for (let i = l; i <= m; i++) {
        barContainers[i].querySelector('.bar').style.background = 'red';
    }
    for (let i = m + 1; i <= r; i++) {
        barContainers[i].querySelector('.bar').style.background = 'yellow';
    }
    await waitforme(delay);
    
    // Create temp arrays
    const leftValues = [];
    const leftHeights = [];
    const rightValues = [];
    const rightHeights = [];
    
    for (let i = 0; i < n1; i++) {
        leftValues.push(parseInt(barContainers[l + i].querySelector('.bar-number').textContent));
        leftHeights.push(barContainers[l + i].querySelector('.bar').style.height);
    }
    for (let j = 0; j < n2; j++) {
        rightValues.push(parseInt(barContainers[m + 1 + j].querySelector('.bar-number').textContent));
        rightHeights.push(barContainers[m + 1 + j].querySelector('.bar').style.height);
    }
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        if (shouldReset) {
            resetBarColors();
            return;
        }
        
        incrementComparison();
        
        let comparisonResult;
        if (sortOrder === 'ascending') {
            comparisonResult = leftValues[i] <= rightValues[j];
            updateComparisonDisplay(leftValues[i], rightValues[j], comparisonResult ? '<=' : '>');
        } else {
            comparisonResult = leftValues[i] >= rightValues[j];
            updateComparisonDisplay(leftValues[i], rightValues[j], comparisonResult ? '>=' : '<');
        }
        
        await waitforme(delay);
        beep.play();
        
        if (comparisonResult) {
            barContainers[k].querySelector('.bar').style.height = leftHeights[i];
            barContainers[k].querySelector('.bar-number').textContent = leftValues[i].toString();
            i++;
        } else {
            barContainers[k].querySelector('.bar').style.height = rightHeights[j];
            barContainers[k].querySelector('.bar-number').textContent = rightValues[j].toString();
            j++;
            incrementSwap();
        }
        
        barContainers[k].querySelector('.bar').style.background = 'lightgreen';
        k++;
        
        updateComparisonDisplay('', '', '');
    }
    
    while (i < n1) {
        if (shouldReset) {
            resetBarColors();
            return;
        }
        
        barContainers[k].querySelector('.bar').style.height = leftHeights[i];
        barContainers[k].querySelector('.bar-number').textContent = leftValues[i].toString();
        barContainers[k].querySelector('.bar').style.background = 'lightgreen';
        i++;
        k++;
        await waitforme(delay);
        beep.play();
    }
    
    while (j < n2) {
        if (shouldReset) {
            resetBarColors();
            return;
        }
        
        barContainers[k].querySelector('.bar').style.height = rightHeights[j];
        barContainers[k].querySelector('.bar-number').textContent = rightValues[j].toString();
        barContainers[k].querySelector('.bar').style.background = 'lightgreen';
        j++;
        k++;
        await waitforme(delay);
        beep.play();
    }
    
    if (!shouldReset) {
        for (let x = l; x <= r; x++) {
            barContainers[x].querySelector('.bar').style.background = 'rgb(0,255,0)';
        }
    }
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}