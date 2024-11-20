document.getElementById('summarizer-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = e.target.querySelector('button[type="submit"]'); // Summarize button
    const textArea = document.getElementById('input-text');
    const output = document.getElementById('summary-output');
    const historyLog = document.getElementById('history-log');

    // Disable button while processing
    button.disabled = true;
    button.textContent = "Summarizing...";

    try {
        const text = textArea.value.trim();
        if (!text) {
            output.textContent = "Please enter some text to summarize.";
            return;
        }

        // Send request to the server
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        // Handle response
        if (response.ok) {
            const data = await response.json();
            const summary = data.summary || "No summary could be generated.";
            output.textContent = summary;

            // Create the new history item
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `
                <div class="history-item-text">Input: ${text}</div>
                <div class="history-item-summary">Summary: ${summary}</div>
            `;
            
            // Prepend the new history item at the top of the history log
            historyLog.insertBefore(historyItem, historyLog.firstChild);
        } else {
            output.textContent = "Error: Unable to summarize the text.";
        }
    } catch (error) {
        output.textContent = "An error occurred. Please try again.";
        console.error("Error:", error);
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = "Summarize";
    }
});

// Handle reset button click
document.getElementById('reset-button').addEventListener('click', () => {
    const textArea = document.getElementById('input-text');
    const output = document.getElementById('summary-output');

    // Clear the input and output fields
    textArea.value = '';
    output.textContent = '';
});

// Handle reset history button click
document.getElementById('reset-history-button').addEventListener('click', () => {
    const historyLog = document.getElementById('history-log');

    // Clear all history items
    historyLog.innerHTML = '';
});
