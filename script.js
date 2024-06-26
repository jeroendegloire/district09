class DataVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        // When the component is added to the DOM:
        // Fetch data asynchronously from a specified source.
        // The fetchData function is assumed to be an async method that fetches the data and returns it as JSON.
        // Once data is fetched, the render method is called to update the component's HTML based on the fetched data.
        this.fetchData().then(data => {
            this.render(data);
        }).catch(error => {
            console.error("Error fetching data:", error);
            // Handle errors, such as displaying a message to the user or logging the error.
        });
    }

    // @Todo: Cleanup code here
    //disconnectedCallback() {
    //
    //}

    // Fetch data from json file
    async fetchData() {
        const response = await fetch('./json/evenementen.json');
        return await response.json();
    }

    render(events) {
        // Sort events by startdate - Old to new
        events.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
        const template = document.createElement('template');

        // Add styles by adding style tag to shadow DOM
        let html = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
                .events-wrapper {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }
                .event {
                    position: relative;
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    display: block;
                    text-decoration: none;
                    color: inherit;
                    background-color: white;
                }
                .event a::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }
                .event:hover {
                    background-color: #f0f0f0;
                }
                .event:focus {
                    outline: 2px solid blue;
                }
                
                @media (max-width: 800px) {
                    .events-wrapper {
                        grid-template-columns: repeat(2, 1fr); /* Two columns for smaller screens */
                    }
                }
            
                @media (max-width: 500px) {
                    .events-wrapper {
                        grid-template-columns: 1fr; /* Single column for very small screens */
                    }
                }
            </style>
        `;

        // Event template
        html += `<div class="events-wrapper">`;
        html += events.map(event => `
            <div class="event">
                <h2>${event.name}</h2>
                <p>Date: ${event.startdate} - ${event.enddate}</p>
                <p>Location: ${event.location}</p>
                <a href="${event.link}" target="_blank">Meer info</a>
            </div>
        `).join('')
        html += `</div>`;

        template.innerHTML = html;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('data-visualizer', DataVisualizer);
