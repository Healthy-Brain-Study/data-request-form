function loadScript(src) {
    var script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
}

// Function to remove a row
function removeRow(element) {
    $(element).closest("div.grid").remove();
}

async function loadHTMLTemplates() {
    const templates = document.querySelectorAll("template[data-include]");
    for (const template of templates) {
        const content = await fetch(template.dataset.include);
        if (content.ok) {
            let text = await content.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            // Get the root element of the fetched HTML (assuming it's the body's first child)
            const rootElement = doc.body.firstChild;

            if (template.id && rootElement) {
                rootElement.id = template.id; // Set the ID from the template to the root element
            }

            // Convert the updated HTML back to a string and replace the template's outerHTML
            template.outerHTML = rootElement.outerHTML;
        } else {
            console.error("Failed to load:", template.dataset.include);
        }
    }

    loadNavigationButtons();
    loadScript("scripts/functions.js");
    loadScript("scripts/formValidation.js");
    loadScript("scripts/biomaterial.js");
    loadScript("scripts/dataSelection.js");
    loadScript("scripts/selectionRequirements.js");
    loadScript("scripts/contactInformation.js");
    loadScript("scripts/dataAccess.js");
    loadScript("scripts/dataTable.js");
    loadScript("scripts/collaborators.js");
    loadScript("scripts/proposalDetails.js");
    loadScript("scripts/download.js");
    loadScript("scripts/pdfGeneration.js");
    loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js"
    ); // To compress the measures object to string
    loadScript("scripts/stringCompression.js"); // To compress the measures object to string
}

document.addEventListener("DOMContentLoaded", loadHTMLTemplates);
