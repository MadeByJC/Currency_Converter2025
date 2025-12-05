const apiKey = '5d2840a784-11312a51c7-t6qe7d';

document.addEventListener('DOMContentLoaded', async () => {
    const baseamount = document.getElementById('base-amount');
    const fromSelect = document.getElementById('base-currency-dropdown');

    const convertedamount = document.getElementById('converted-amount');
    const toSelect = document.getElementById('converted-currency');

    let rates = {}; // store exchange rates here


    try {
        const response = await fetch("https://api.fastforex.io/currencies?api_key=" + apiKey);
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        const data = await response.json();
        const currencies = data.currencies;

        for (const [code, name] of Object.entries(currencies)) {
            const fromdropdown = document.createElement('option');
            fromdropdown.value = code;
            fromdropdown.textContent = `${name}`;
            fromSelect.appendChild(fromdropdown);

            const todropdown = document.createElement('option');
            todropdown.value = code;
            todropdown.textContent = `${name}`;
            toSelect.appendChild(todropdown);
        }

        baseamount.value = 1;
        fromSelect.value = 'CAD';
        toSelect.value = 'USD';

        await fetchrates();
        convertCurrency();
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }


    async function fetchrates() {
        try {
            const base = fromSelect.value;
            const response = await fetch("https://api.fastforex.io/fetch-all?from=" + base + "&api_key=" + apiKey);
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            const data = await response.json();
            rates = data.results;
        } catch (error) {
            console.error('Error fetching rates:', error);
            rates = {};
        }
        convertCurrency();
    }

    function convertCurrency() {
        const amount = parseFloat(baseamount.value);
        const targetCurrency = toSelect.value;
        const rate = rates[targetCurrency] || 0;
        convertedamount.value = (amount * rate).toFixed(4);
    }

    baseamount.addEventListener('input', convertCurrency);
    fromSelect.addEventListener('change', fetchrates);
    toSelect.addEventListener('change', convertCurrency);
});