 document.addEventListener('DOMContentLoaded', function () {
    // Example: Adding a sample endpoint
    const exampleEndpoint = {
        path: '/example',
        method: 'GET',
        summary: 'Get example data',
        description: 'Retrieve data for the example endpoint',
        responses: [
            {
                code: '200',
                description: 'Successful response',
                content: {
                    'application/json': {
                        // JSON Schema for the response
                    }
                }
            },
            // Add more responses as needed
        ]
    };

    // Initialize with the sample endpoint
    addEndpoint(exampleEndpoint);
    displayEndpointDetails(exampleEndpoint);
 })

    // Function to add a new endpoint
    function addEndpoint(endpointData) {
        // Create HTML elements for the endpoint in the sidebar
        const sidebarEndpointItem = document.createElement('li');
        // Create the main container div
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "buttoncontainer";

        // Create the first child div with class "endpontheader post"
        var endpontHeaderPost = document.createElement("div");
        endpontHeaderPost.className = "endpontheader";
        const GetMethodTypeHeaderColor= GetMethodTypeHeaderClass(endpointData.method);
        endpontHeaderPost.classList.add(GetMethodTypeHeaderColor);
        // Create a paragraph element with the text "POST"
        var postParagraph = document.createElement("p");
        postParagraph.textContent = endpointData.method;

        // Append the paragraph to the "endpontheader post" div
        endpontHeaderPost.appendChild(postParagraph);

        // Append the "endpontheader post" div to the main container div
        buttonContainer.appendChild(endpontHeaderPost);

        // Create the second child div with class "endpontheadertext"
        var endpontHeaderText = document.createElement("div");
        endpontHeaderText.className = "endpontheadertext";

        // Create a paragraph element with the text "/Customers"
        var customersParagraph = document.createElement("p");
        customersParagraph.textContent = endpointData.path;

        // Append the paragraph to the "endpontheadertext" div
        endpontHeaderText.appendChild(customersParagraph);

        // Append the "endpontheadertext" div to the main container div
        buttonContainer.appendChild(endpontHeaderText);
        const link = document.createElement("a");
        link.appendChild(buttonContainer);
        link.href="#"
        link.className ="linkstyle";
        sidebarEndpointItem.appendChild(link);
        sidebarEndpointItem.onclick = function () {
            displayEndpointDetails(endpointData);
        };

        // Append the endpoint to the sidebar
        document.getElementById('sidebar-endpoint-list').appendChild(sidebarEndpointItem);

        // Create HTML elements for the endpoint details
        const endpointDetails = document.getElementById('endpoint-details');
        endpointDetails.innerHTML = `
            <h3>${endpointData.method} ${endpointData.path}</h3>
            <p><strong>Summary:</strong> ${endpointData.summary}</p>
            <p><strong>Description:</strong> ${endpointData.description}</p>
            <h4>Responses:</h4>
            <ul class="response-list">
                ${endpointData.responses.map((response, index) => `
                    <li class="response-item">
                        <strong>${response.code}</strong>: ${response.description}
                        <pre>${JSON.stringify(response.content, null, 2)}</pre>
                    </li>
                `).join('')}
            </ul>
        `;
    }



    // Function to add a new response to the form
    window.addNewResponse = function () {
        const responseList = document.getElementById('response-list');
        const responseCount = responseList.childElementCount;

        // Create HTML elements for the new response
        const responseElement = document.createElement('li');
        responseElement.className = 'response-item';
        responseElement.innerHTML = `
            <label for="response-code-${responseCount}">Response Code:</label>
            <input type="text" id="response-code-${responseCount}" name="response-code-${responseCount}" required>

            <label for="response-desc-${responseCount}">Description:</label>
            <input type="text" id="response-desc-${responseCount}" name="response-desc-${responseCount}" required>

            <label for="response-content-${responseCount}">Content (JSON Schema):</label>
            <textarea id="response-content-${responseCount}" name="response-content-${responseCount}" rows="4" required></textarea>

            <span class="remove-response" onclick="removeResponse(${responseCount})">Remove</span>
        `;

        // Append the new response to the response list
        responseList.appendChild(responseElement);
    };

    // Function to remove a response from the form
    window.removeResponse = function (index) {
        const responseList = document.getElementById('response-list');
        const responseItem = document.getElementById(`response-content-${index}`);
        responseList.removeChild(responseItem.parentElement);
    };

    // Function to add a new endpoint from the form
    window.addNewEndpoint = function () {
        // Get form data
        const path = document.getElementById('path').value;
        const method = document.getElementById('method').value;
        const summary = document.getElementById('summary').value;
        const description = document.getElementById('description').value;

        // Get responses data
        const responses = [];
        const responseList = document.getElementById('response-list');
        const responseItems = responseList.getElementsByClassName('response-item');

        for (const responseItem of responseItems) {
            const code = responseItem.querySelector(`[id^="response-code"]`).value;
            const desc = responseItem.querySelector(`[id^="response-desc"]`).value;
            const content = JSON.parse(responseItem.querySelector(`[id^="response-content"]`).value);

            responses.push({
                code,
                description: desc,
                content,
            });
        }

        // Example: Adding a new endpoint
        const newEndpoint = {
            path,
            method,
            summary,
            description,
            responses,
        };

        // Add the new endpoint
        addEndpoint(newEndpoint);

        // Clear the form
        document.getElementById('endpoint-form').reset();
        responseList.innerHTML = ''; // Clear responses
    };

    // Function to display endpoint details in the main panel
    function displayEndpointDetails(endpointData) {
        const endpointDetails = document.getElementById('endpoint-details');
        endpointDetails.innerHTML = `
            <h3>${endpointData.method} ${endpointData.path}</h3>
            <p><strong>Summary:</strong> ${endpointData.summary}</p>
            <p><strong>Description:</strong> ${endpointData.description}</p>
            <h4>Responses:</h4>
            <ul class="response-list">
                ${endpointData.responses.map((response, index) => `
                    <li class="response-item">
                        <strong>${response.code}</strong>: ${response.description}
                        <pre>${JSON.stringify(response.content, null, 2)}</pre>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // Function to download endpoint details as JSON
    window.downloadEndpoints = function () {
        const endpointData = getEndpointsData(); // Retrieve endpoint data
        const jsonString = JSON.stringify(endpointData, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'endpoints.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    // Function to get endpoint data from the DOM
    function getEndpointsData() {
        const sidebarEndpointList = document.getElementById('sidebar-endpoint-list');
        const endpointItems = sidebarEndpointList.getElementsByClassName('endpoint-item');

        const endpoints = [];

        for (const endpointItem of endpointItems) {
            const endpointLink = endpointItem.querySelector('a');
            const path = endpointLink.textContent.trim().split(' ').slice(1).join(' ');
            const method = endpointLink.textContent.trim().split(' ')[0];
            const endpointDetails = getEndpointDetails(path, method);

            endpoints.push(endpointDetails);
        }

        return endpoints;
    }

    function GetMethodTypeHeaderClass(methodType)
    {
        if(methodType =='GET')
        return 'get';
        if(methodType =='POST')
        return 'post';
        if(methodType =='DELETE')
        return 'delete';
        if(methodType =='PUT')
        return 'put';
    }


    // Function to get details of a specific endpoint
    function getEndpointDetails(path, method) {
        const endpointDetails = {
            path,
            method,
            summary: '',
            description: '',
            responses: []
        };

        // ... (your existing code to fetch and populate endpointDetails) ...

        return endpointDetails;
    }


// Your existing JavaScript code here

// Example functions for menu actions
function newFile() {
    // Add logic for creating a new file
    console.log("New File");
}

function openFile() {
    // Add logic for opening a file
    console.log("Open File");
}

function saveFile() {
    // Add logic for saving a file
    console.log("Save File");
}

function exportFile() {
    // Add logic for exporting a file
    console.log("Export File");
}

function showHelp() {
    // Add logic for showing help
    console.log("Show Help");
}