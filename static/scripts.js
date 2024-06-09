document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("guestbook-form");
    const authorInput = document.getElementById("author");
    const contentInput = document.getElementById("content");
    const entriesDiv = document.getElementById("guestbook-entries");

    // Function to load guestbook entries
    async function loadGuestbookEntries() {
        const response = await fetch('/guestbook/');
        const entries = await response.json();

        entriesDiv.innerHTML = ''; // Clear existing entries
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('guestbook-entry');

            const author = document.createElement('h3');
            author.textContent = entry.author;

            const content = document.createElement('p');
            content.textContent = entry.content;

            const timestamp = document.createElement('small');
            timestamp.textContent = new Date(entry.timestamp).toLocaleString();

            // Add delete button (optional feature)
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                await fetch(`/guestbook/${entry.id}`, { method: 'DELETE' });
                loadGuestbookEntries(); // Reload entries
            };

            entryDiv.appendChild(author);
            entryDiv.appendChild(content);
            entryDiv.appendChild(timestamp);
            entryDiv.appendChild(deleteButton); // Add delete button to entry

            entriesDiv.appendChild(entryDiv);
        });
    }

    // Event listener to add new guestbook entry on form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const response = await fetch('/guestbook/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author: authorInput.value,
                content: contentInput.value,
            }),
        });

        if (response.ok) {
            authorInput.value = ''; // Clear input fields
            contentInput.value = '';
            loadGuestbookEntries(); // Reload guestbook entries
        }
    });

    loadGuestbookEntries(); // Load guestbook entries on page load
});
