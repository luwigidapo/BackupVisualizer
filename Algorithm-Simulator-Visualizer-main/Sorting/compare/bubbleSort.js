async function bubbleSort(arrayElementId) {
    const bars = document.querySelectorAll(`#${arrayElementId} > .bar-container`);
    let i = bars.length - 1;
    while (i > 0) {
        for (let j = 0; j < i; j++) {
            await swapVisual(bars[j], bars[j + 1], arrayElementId);
        }
        i--;
    }
}

async function swapVisual(bar1, bar2, arrayElementId) {
    // Your swap visual effects go here
}

function initializeBubbleSort(arrayElementId) {
    const size = 30; // example size
    const container = document.getElementById(arrayElementId);
    container.innerHTML = ''; // Clear any previous display
    for (let i = 0; i < size; i++) {
        const bar = document.createElement("div");
        bar.className = "bar-container";
        bar.style.height = `${Math.random() * 200}px`;
        container.appendChild(bar);
    }
}
