import { pause } from './sorting.js';

export async function selectionSort(array, updateUI) {
    let n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            await updateUI(minIndex, j, 'compare');
            await pause();
            
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            await updateUI(i, minIndex, 'swap');
            await pause();
        }
    }
}
