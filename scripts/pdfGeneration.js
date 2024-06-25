var allSelectedMeasures = [];

function generateTableWithMeasures(){
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
                        pepColumnName =
                            getPepColumnNameFromColumnId(columnId);
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
}

$(document).ready(function () {
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

        fontSize = doc.getFontSize();

        doc.setFontSize(10);
        doc.addImage("static/logo.png", "PNG", 10, currentY, 50, 25);
        currentY += 8;
        doc.text("QUESTIONS?", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        doc.text("Lisa Wirz, project manager", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY);
        doc.text("Email: hbs-data@radboudumc.nl", 50 + 50, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY, 20);
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
                            0,
                            tableHeight
                        );
                        currentY = data.cursor.y + 10; // Update current Y position after table draw
                    },
                });
                currentY = addPageIsHeightTooHigh(doc, currentY);
            } else {
                currentY = addPageIsHeightTooHigh(doc, currentY, 10);
            }
        });

        currentY = addPageIsHeightTooHigh(doc, currentY);
        doc.text("Requested data", 10, currentY);
        currentY = addPageIsHeightTooHigh(doc, currentY, 20);

        allSelectedMeasures = [];

        // Handle any additional data or tables if necessary
        

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
