var allSelectedMeasures = [];

$(document).ready(function () {
    function getFirstKey(object) {
        return Object.keys(object)[0];
    }

    function getPepColumnNameFromColumnId(id){
        const name = $(`#${id}`).find('td[data-title="Name"]').text()
        for (const [key, value] of Object.entries(allTables)) {
            for (row of value){
                if (name.trim() == row[0].trim()){
                    return row[1]
                }
            }
        }
        return ""
    }      

    // Function to check whether all values are arrays
    function areAllValuesInObjectArrays(obj) {
        var areAllArrays = false;
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
                areAllArrays = true;
            } else {
                return false;
            }
        }
        return areAllArrays;
    }

    function getClosestH2(item) {
        console.log(item);
        var parents = $(item).parents().get(); // Get the parents as an array

        for (var i = 0; i < parents.length; i++) {
            section_title = $(parents[i]).find("h2").first().text();

            if (section_title) {
                return section_title;
            }
        }

        return "";
    }

    function getInputTitle(item) {
        var title = "";

        title = $(item).attr("placeholder");
        if (title && title != undefined) {
            return title;
        } else {
            return $(item).attr("data-placeholder");
        }
    }

    function gatherFormData() {
        const formData = {};
        var sections = [];
        $(".form-step").each(function () {
            $(this)
                .find("input, textarea, select")
                .each(function () {
                    if ($(this).attr("id") == "diffPI") {
                        return;
                    }

                    let section = getClosestH2(this);
                    let title = getInputTitle(this);

                    if (section == "Provide data selection requirements") {
                        return;
                    }

                    if (title == undefined) {
                        return;
                    }
                    if (!sections.includes(section)) {
                        sections.push(section);
                    }

                    let sectionName = `${
                        sections.indexOf(section) + 1
                    }. ${getClosestH2(this)}`;
                    if (!formData[sectionName]) {
                        formData[sectionName] = {};
                    }

                    let inputName = $(this).attr("name");
                    let value = $(this).val();

                    if (inputName && inputName.endsWith("[]")) {
                        if (!inputName) {
                            return; // Skip this iteration if name is not defined
                        }
                        fieldName = inputName.split("_")[0];
                        inputName = inputName.slice(0, -2); // Remove '[]' from the name
                        inputName = inputName.split(fieldName + "_")[1];

                        // Ensure that the target is always an array, even if previously set
                        if (!Array.isArray(formData[sectionName][title])) {
                            formData[sectionName][title] = formData[
                                sectionName
                            ][title]
                                ? [formData[sectionName][title]]
                                : [];
                        }

                        formData[sectionName][title].push(value);
                    } else {
                        // Conditionally assign based on whether or not it is initially an array
                        if (Array.isArray(formData[sectionName][title])) {
                            formData[sectionName][title].push(value);
                        } else {
                            // Overwrite if not an array, this could still pose issues if mixed types are expected
                            if (formData[sectionName][title]) {
                                formData[sectionName][title] = [
                                    formData[sectionName][title],
                                    value,
                                ];
                            } else {
                                formData[sectionName][title] = value;
                            }
                        }
                    }
                });
        });
        return formData;
    }

    function isPlainObject(value) {
        return (
            typeof value === "object" && value !== null && !Array.isArray(value)
        );
    }

    function getAllSelectedHypothesesInGivenTd(td) {
        return $(td)
            .find(".hypotheses-select")
            .select2("data")
            .map((item) => item.text.replace("Hypothesis ", ""))
            .join(", ");
    }

    function getRequirementsColumn(id) {
        var requirementsId = `#requirements-${id}`;
        var rowData = [];

        $(requirementsId)
            .find("td:not(:first)")
            .each(function () {
                var tempText = $(this).find("select option:selected").text();
                var tempCheckbox = $(this)
                    .find(".checkbox-assessment-selection")
                    .prop("checked");
                var tempTextArea = $(this).find("textarea").val();
                if ($(this).find(".hypotheses-select").length) {
                    rowData.push(getAllSelectedHypothesesInGivenTd(this));
                    return;
                } else if (tempText) {
                    rowData.push(tempText);
                    return;
                } else if (tempCheckbox != undefined) {
                    rowData.push(tempCheckbox ? "Yes" : "No");
                    return;
                } else if (tempTextArea) {
                    rowData.push(tempTextArea);
                    return;
                } else {
                    rowData.push("");
                }
            });

        return rowData;
    }

    // Function to replace emojis and special characters with plain text
    function replaceEmojis(text) {
        const replacements = {
            "😊": "x", // Example emoji replacement
            "Ø=Þ": "x", // Specific problematic character combination
        };
        return text.replace(/😊|Ø=Þ/g, function (match) {
            return replacements[match];
        });
    }

    function addPageIsHeightTooHigh(doc, currentY, elementHeight = 20) {
        var pageHeight = 297; // A4 height in mm
        if (currentY + elementHeight > pageHeight) {
            // Check if adding new content will go beyond the page height
            doc.addPage();
            currentY = 25; // Reset Y to top margin after adding a new page
        }

        return currentY;
    }

    // PDF Export Function using HTML content
    $("#export-btn").click(function () {
        var loadingPDFModal = Swal.fire({
            title: "Loading",
            html: "Generating request form PDF",
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const doc = new jspdf.jsPDF({
            orientation: "p",
            unit: "mm",
            format: "a4",
        });

        let currentY = 15; // Start a little lower to accommodate title space
        doc.text("HEALTHY BRAIN STUDY DATA REQUEST FORM", 10, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        currentY += 5;

        fontSize = doc.getFontSize();

        doc.setFontSize(10);
        doc.addImage("static/logo.png", "PNG", 10, currentY, 50, 25);
        currentY += 8;
        doc.text("QUESTIONS?", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        currentY += 5;
        doc.text("Lisa Wirz, project manager", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        currentY += 5;
        doc.text("Email: hbs-data@radboudumc.nl", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        currentY += 20;
        doc.setFontSize(fontSize);

        const formData = gatherFormData();

        // Iterate over each section in formData
        Object.keys(formData).forEach((step) => {
            currentY = addPageIsHeightTooHigh(doc, currentY);
            doc.text(`${step}`, 10, currentY);
            currentY = addPageIsHeightTooHigh(doc, currentY);
            currentY += 10;
            let headers = [
                { title: "Name", dataKey: "key" },
                { title: "Value", dataKey: "value" },
            ];
            let body = [];

            if (areAllValuesInObjectArrays(formData[step])) {
                // Analyze each entry to determine header requirements
                let extendedHeaders = new Set([]); // Start with default key

                // Collect all unique keys from objects for headers
                Object.keys(formData[step]).forEach((key) => {
                    extendedHeaders.add(key);
                });

                // Convert headers Set to array and redefine headers for autoTable
                headers = Array.from(extendedHeaders).map((header) => {
                    return { title: header, dataKey: header };
                });

                var rows = new Array(
                    formData[step][getFirstKey(formData[step])].length
                );
                for (let i = 0; i < rows.length; i++) {
                    rows[i] = []; // Initializing each with its own new array
                }

                for (const title in formData[step]) {
                    formData[step][title].forEach(function (item, index) {
                        rows[index].push(item);
                    });
                }

                Array.prototype.push.apply(body, rows);
            } else {
                // Prepare the body data based on the discovered headers
                Object.keys(formData[step]).forEach((key) => {
                    const value = formData[step][key];

                    if (Array.isArray(value)) {
                        let numberedItems = value.map(
                            (item, index) => `${index + 1}. ${item}`
                        );
                        body.push([key, numberedItems.join("\n")]);
                    } else {
                        body.push([key, value]);
                    }
                });
            }

            // Draw the table if there are rows to add
            if (body.length > 0) {
                doc.autoTable({
                    head: [headers],
                    body: body,
                    startY: currentY,
                    theme: "grid",
                    styles: {
                        fontSize: 10,
                        cellPadding: 2,
                        overflow: "linebreak",
                        halign: "left",
                    },
                    headStyles: {
                        fillColor: [230, 230, 230],
                        textColor: [0, 0, 0],
                        halign: "center",
                    },
                    alternateRowStyles: {
                        fillColor: [240, 240, 240],
                    },
                    columnStyles: {
                        0: { cellWidth: "auto" },
                        1: { cellWidth: "auto" },
                        key: { cellWidth: "auto" },
                        value: { cellWidth: "auto" },
                    },
                    didDrawPage: function (data) {
                        tableHeight = data.cursor.y - currentY;
                        currentY = addPageIsHeightTooHigh(
                            doc,
                            currentY,
                            tableHeight
                        );
                        currentY = data.cursor.y + 10; // Update current Y position after table draw
                    },
                });
                currentY = addPageIsHeightTooHigh(doc, currentY);
                currentY += 5; // Additional space before the next section
            } else {
                currentY = addPageIsHeightTooHigh(doc, currentY);
                currentY += 10; // If no table was added, ensure space for subsequent content
            }
        });

        currentY = addPageIsHeightTooHigh(doc, currentY);
        doc.text("Requested data", 10, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        currentY += 20;

        allSelectedMeasures = [];

        // Handle any additional data or tables if necessary
        $(".data-table").each(function () {
            const title = replaceEmojis($(this).attr("data-title"));
            var headers = $(this)
                .find("th")
                .map(function () {
                    return replaceEmojis($(this).text());
                })
                .get();

            headers = [headers[1]].concat([
                "Construct",
                "Hypotheses",
                "Outcome Measure",
                "Required",
                "A1",
                "A2",
                "A3",
            ]);

            let body = [];

            $(this)
                .find("tr")
                .each(function () {
                    var columnId = $(this).attr("id");
                    const isChecked = $(this)
                        .find('td:first-child input[type="checkbox"]')
                        .prop("checked");

                    if (isChecked) {
                        var requirements = getRequirementsColumn(columnId);

                        var rowData = $(this)
                            .find("td")
                            .map(function (index) {
                                if (index > 0) {
                                    // Skip the checkbox column
                                    if ($(this).find("select").length > 0) {
                                        // If there's a select element, get the text of the selected option
                                        return replaceEmojis(
                                            $(this)
                                                .find("select option:selected")
                                                .text()
                                        );
                                    } else {
                                        // Otherwise, just return the text of the cell
                                        return replaceEmojis($(this).text());
                                    }
                                }
                            })
                            .get();
                        if (rowData.length > 0) {
                            pepColumnName = getPepColumnNameFromColumnId(columnId);
                            allSelectedMeasures.push(
                                [pepColumnName, rowData[0]].concat(requirements)
                            );
                            rowData = [rowData[0]].concat(requirements);
                            body.push(rowData);
                        }
                    }
                });

            if (body.length > 0) {
                doc.setFontSize(12);
                currentY = addPageIsHeightTooHigh(doc, currentY);
                doc.text(title, 10, currentY - 10); // Only add title if there are selected rows
                doc.autoTable({
                    head: [headers], // Exclude the first column (checkboxes)
                    body: body,
                    startY: currentY,
                    theme: "grid",
                    styles: {
                        fontSize: 10,
                        cellPadding: 2,
                        overflow: "linebreak",
                        halign: "left",
                    },
                    headStyles: {
                        fillColor: [230, 230, 230],
                        textColor: [0, 0, 0],
                        halign: "center",
                    },
                    alternateRowStyles: {
                        fillColor: [240, 240, 240],
                    },
                });
                currentY = doc.lastAutoTable.finalY + 25; // Update Y for the next table, if any
            }
        });

        currentY = 20;
        doc.setFontSize(1);

        // After all other content, add compressed data
        const compressedDataForAutomation = compressObject(allSelectedMeasures);
        const pageWidth = doc.internal.pageSize.getWidth() - 20; // 10mm margin on each side
        const textLines = doc.splitTextToSize(
            compressedDataForAutomation,
            pageWidth
        ); // This will split the text into lines that fit within the specified width.

        doc.addPage();
        textLines.forEach(function (line) {
            if (currentY + 10 > 297) {
                // Check if the current line would go out of page bounds, assuming 297mm is page height
                doc.addPage();
                currentY = 20; // Reset Y to top margin after adding a new page
            }
            doc.text(line, 10, currentY); // Draw the line
            currentY += 10; // Move the cursor down for the next line
        });
        doc.save("HBS_data_request_form.pdf");
        loadingPDFModal.close();
    });
});
