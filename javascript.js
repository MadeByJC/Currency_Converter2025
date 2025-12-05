// javascript.js

// API key for FastForex
const apiKey = '5d2840a784-11312a51c7-t6qe7d';

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', async () => {

    // Get references to DOM elements
    const baseamount = document.getElementById('base-amount');
    const fromSelect = document.getElementById('base-currency-dropdown');
    const convertedamount = document.getElementById('converted-amount');
    const toSelect = document.getElementById('converted-currency');

    // Store exchange rates here
    let rates = {};

    // Fetch available currencies and populate dropdowns
    try {
        // Fetch currencies from FastForex API
        const response = await fetch("https://api.fastforex.io/currencies?api_key=" + apiKey);
        // Check if the response is successful
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        // Parse the JSON data
        const data = await response.json();

        // Get the currencies object
        const currencies = data.currencies;

        // Populate the currency dropdowns
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

        // Set default selections
        baseamount.value = 1;
        fromSelect.value = 'CAD';
        toSelect.value = 'USD';

        // Fetch initial exchange rates and perform conversion
        await fetchrates();
        // Initial conversion
        convertCurrency();
    } catch (error) {
        // Log any errors during fetching currencies
        console.error('Error fetching currencies:', error);
    }

    // Async function to fetch exchange rates based on selected base currency
    async function fetchrates() {
        try {
            // Fetch exchange rates from FastForex API
            const base = fromSelect.value;
            const response = await fetch("https://api.fastforex.io/fetch-all?from=" + base + "&api_key=" + apiKey);

            // Check if the response is successful
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

            // Parse the JSON data
            const data = await response.json();

            // Update the rates object
            rates = data.results;
        } catch (error) {
            // Log any errors during fetching rates
            console.error('Error fetching rates:', error);
            rates = {};
        }

        // Perform conversion after fetching new rates
        convertCurrency();
    }

    // Function to convert currency based on input amount and selected currencies
    function convertCurrency() {
        const amount = parseFloat(baseamount.value);
        const targetCurrency = toSelect.value;
        const rate = rates[targetCurrency] || 0;

        // Calculate and display the converted amount
        convertedamount.value = (amount * rate).toFixed(4);
    }

    // Event listeners for user interactions
    baseamount.addEventListener('input', convertCurrency);
    fromSelect.addEventListener('change', fetchrates);
    toSelect.addEventListener('change', convertCurrency);
});