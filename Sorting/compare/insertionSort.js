import { pause } from './sorting.js';

export async function insertionSort(array, updateUI) {
    let n = array.length;
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        await updateUI(i, j, 'compare');
        await pause();
        
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            await updateUI(j, j + 1, 'swap');
            await pause();
            j--;
            
            if (j >= 0) {
                await updateUI(i, j, 'compare');
                await pause();
            }
        }
        
        array[j + 1] = key;
    }
}
