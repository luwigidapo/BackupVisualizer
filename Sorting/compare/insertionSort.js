async function insertionSort(array, container, algorithmNumber) {
    const bars = container.querySelectorAll('.bar');
    const n = bars.length;
    const numbers = Array.from(bars, bar => parseInt(bar.dataset.value));

    for (let i = 1; i < n; i++) {
        const key = numbers[i];
        let j = i - 1;

        updateBarColors(container, [i], 'compare');
        await sleep(delay);

        while (j >= 0 &&
            ((sortOrder === 'ascending' && numbers[j] > key) || (sortOrder === 'descending' && numbers[j] < key))
        ) {
            numbers[j + 1] = numbers[j];

            bars[j + 1].style.height = bars[j].style.height;
            bars[j + 1].dataset.value = bars[j].dataset.value;
            bars[j + 1].nextElementSibling.textContent = bars[j].nextElementSibling.textContent;

            j--;

            await sleep(delay);
        }

        numbers[j + 1] = key;
        bars[j + 1].style.height = `${(key / Math.max(...array)) * container.clientHeight}px`;
        bars[j + 1].dataset.value = key;
        bars[j + 1].nextElementSibling.textContent = key;

        // Clear visualization ("uncompare"). Could be `updateBarColors(..., [], 'none')`, but 
        // since it is currently not supported, we directly set:
        bars.forEach(bar => bar.style.backgroundColor = '#3498db');
        await sleep(delay);
    }

    markAllAsSorted(container);
}
