var selectedColumns = {};

$(document).ready(async function () {
    const columnsToShow = {
        "Pre-visit online questionnaires.": [
            "Name",
            "Category",
            "Description\r",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Physiological assessments.": [
            "Name",
            "Category",
            "Location",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Bio-samples and silicone wristband.": [
            "Name",
            "Bio-sample",
            "Location",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Ecological Momentary Assessment": [
            "Name",
            "Description\r",
            "Location",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Neuroimaging at the campus.": [
            "Name",
            "Description\r",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Cognitive, affective, and behavioral assessments on campus.": [
            "Name",
            "Description\r",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Sensory assessments.": [
            "Name",
            "Category",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Post-visit online questionnaires.": [
            "Name",
            "Measure",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Post-visit online assessments.": [
            "Name",
            "Description\r",
            "Measure",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
        "Individual Differences in Language Skills test battery.": [
            "Name",
            "Description\r",
            "Measure",
            "A1",
            "A2",
            "A3",
            "P",
            "U",
            "M",
        ],
    };

    const columnsSubscript = {
        "Pre-visit online questionnaires.": "",
        "Physiological assessments.": "",
        "Bio-samples and silicone wristband.": "*The indicated volumes refer to whole blood volumes. #So far, 1887 samples were analyses for gut microbiota [all available samples], 224 for fecal metabolome, 699 for pro-inflammatory cytokines, 101 for hair cortisol, 377 for DNA [Infinium® Global Screening Array]",
        "Ecological Momentary Assessment": "*The full questionnaire combines all other sections. You can select either one or multiple sections. If you want to receive all sections, only select ‘full questionnaire’ . ",
        "Neuroimaging at the campus.": "",
        "Cognitive, affective, and behavioral assessments on campus.": "",
        "Sensory assessments.": "",
        "Post-visit online questionnaires.":
            "*Participants fill out their job characteristics at the first assessment. In the second and third assessments, they fill out their job characteristics only in case of a new job.",
        "Post-visit online assessments.": "",
        "Individual Differences in Language Skills test battery.": "",
    };

    async function loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "data/columns.csv", true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var contents = xhr.responseText;
                var lines = contents
                    .split("\n")
                    .filter((line) => line.trim() !== "");
                var headers = lines[0].split(";");

                var data = lines.slice(1).map((line) => line.split(";"));

                var tables = {};

                data.forEach((row) => {
                    if (row.length === headers.length) {
                        var tableNameIndex = headers.indexOf("Table Name");
                        if (
                            tableNameIndex !== -1 &&
                            row[tableNameIndex].trim()
                        ) {
                            var tableName = row[tableNameIndex].trim();
                            if (!tables[tableName]) {
                                tables[tableName] = [];
                            }
                            tables[tableName].push(row);
                        }
                    }
                });

                $("#tables-container").empty();
                var i = 0;
                Object.keys(tables).forEach((name) => {
                    if (columnsToShow[name]) {
                        var responsiveColumns = ["Name"];
                        var tableParent = $(
                            '<div class="overflow-x-auto"></div'
                        );
                        var table = $(
                            `<table data-title="${name}" class="table data-table table-zebra w-full"></table>`
                        );
                        var headerRow = $("<thead><tr></tr></thead>");
                        headerRow.append("<th>Request</th>");

                        columnsToShow[name].forEach((col) => {
                            if (headers.includes(col)) {
                                if (responsiveColumns.includes(col)) {
                                    headerRow.append(`<th>${col}</th>`);
                                } else {
                                    headerRow.append(
                                        `<th class="hidden md:table-cell">${col}</th>`
                                    );
                                }
                            }
                        });
                        headerRow.append('<th class="md:hidden"> Info </th> ');
                        table.append(headerRow);
                        tableBody = $("<tbody></tbody>");

                        tables[name].forEach((row) => {
                            var rowHtml = `<tr class="hover" id="column${i}">
                                                <td>
                                                    <input type="checkbox" class="checkbox checkbox-data-selection">
                                                </td>`;

                            i++;
                            columnsToShow[name].forEach((col) => {
                                var colIndex = headers.indexOf(col);
                                if (colIndex !== -1) {
                                    if (responsiveColumns.includes(col)) {
                                        rowHtml += `<td data-title="${col}">${row[colIndex]}</td>`;
                                    } else {
                                        rowHtml += `<td data-title="${col}" class="hidden md:table-cell">${row[colIndex]}</td>`;
                                    }
                                }
                            });
                            rowHtml +=
                                '<td class="md:hidden"><button type="button" class="btn btn-info btn-info-modal">Info</button></td>';
                            rowHtml += "</tr>";
                            tableBody.append(rowHtml);
                        });
                        table.append(tableBody);
                        tableParent.append(table);
                        tableParent.append(
                            `<p>${columnsSubscript[name] || ""}</p>`
                        );

                        $("#tables-container").append(
                            `<h3 class="text-xl font-bold mt-5">${name}</h3><p>P=processed, U=uploaded in repository, M=metadata available</p>`
                        );
                        $("#tables-container").append(tableParent);
                    }
                });
            }

            // After filling the table, attach an event listener to checkboxes:
            $('input[type="checkbox"].checkbox-data-selection').change(
                function () {
                    var table = $(this).closest("table");
                    var tableName = $(table).attr("data-title");
                    if (!selectedColumns[tableName]) {
                        selectedColumns[tableName] = [];
                    }
                    var checkbox = this;
                    var rowIndex = $(this).closest("tr").index() - 1; // Adjust for header row
                    if (checkbox.checked) {
                        // Add the checkbox element if it's checked
                        selectedColumns[tableName].push(checkbox);
                    } else {
                        // Filter out the unchecked checkbox element
                        selectedColumns[tableName] = selectedColumns[
                            tableName
                        ].filter((item) => item !== checkbox);

                        // Check if the array is now empty, and if so, delete the table key
                        if (selectedColumns[tableName].length === 0) {
                            delete selectedColumns[tableName];
                        }
                    }
                    
                if (doSelectedColumnsContainBiosamples() != containsBiosamples){
                    containsBiosamples = doSelectedColumnsContainBiosamples();
                    onChangeBiosamples(containsBiosamples);
                }
            }
            );

            const infoButtons = document.querySelectorAll('.btn-info-modal');

            infoButtons.forEach(button => {
                button.addEventListener('click', function (event) {
                    const row = button.closest('tr');
                    const hiddenCells = row.querySelectorAll('.hidden.md\\:table-cell');
                    let content = '<div class="flex flex-col w-full gap-4">'; // Using a flex container instead of a table
                    let textColumns = [
                        "Name",
                        "Bio-sample",
                        "Description",
                        "Category",
                        "Location",
                    ]; // These columns will be shown with flex-col instead of row because they contain lots of text
                    let colName = $($(row).children()[1]).text();

                    content += `<div class="flex flex-col justify-between items-center p-2 bg-gray-100 rounded">
                                    <span class="font-bold">Name</span>
                                    <span>${colName.trim()}</span>
                                </div>`;
                    hiddenCells.forEach(cell => {
                        let title = cell.getAttribute('data-title'); // Get the title from the data attribute
                        // Each item is a flex row with two elements: title and data
                        let flexDirection = textColumns.includes(title.trim()) ? 'flex-col' : 'flex-row';
                        content += `<div class="flex ${flexDirection} justify-between items-center p-2 bg-gray-100 rounded">
                                        <span class="font-bold">${title}</span>
                                        <span>${cell.textContent.trim()}</span>
                                    </div>`;
                    });
            
                    content += '</div>';
            
                    Swal.fire({
                        title: 'Detailed Information',
                        html: content,
                        icon: 'info',
                        customClass: {
                            popup: 'formatted-swal'
                        }
                    });
                });
            });            
            
            initializeSelectionRequirementsListeners();
            selectionRequirementsSetup();
            loadingModal.close()
        };
        xhr.send();
    }

    await loadData();
});
