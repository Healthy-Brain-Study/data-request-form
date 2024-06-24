// When a checkbox is clicked this function is called to get the available assessments for that column
function getAvailableAssessmentsFromCheckbox(checkbox) {
    const assessments = ["A1", "A2", "A3"];
    var availableAssessments = [];

    for (const assessment of assessments) {
        var assessmentAvailable = $(checkbox)
            .closest("tr")
            .find(`td[data-title='${assessment}']`)
            .text()
            .trim();

        if (assessmentAvailable) {
            availableAssessments.push(assessment);
        }
    }

    return availableAssessments;
}

// Placeholder function to simulate loading hypotheses
function loadHypotheses() {
    let hypothesesHtml = "";
    $("#hypothesesContainer")
        .find("textarea")
        .each(function (index) {
            const hypothesisNumber = index + 1;
            hypothesesHtml += `<option value="${hypothesisNumber}">Hypothesis ${hypothesisNumber}</option>`;
        });
    return hypothesesHtml;
}

function loadHypothesesList() {
    let hypothesesHtml =
        "<br><span class='font-bold'>Available hypotheses:</span><br><ol>";
    $("#hypothesesContainer")
        .find("textarea")
        .each(function (index) {
            const hypothesisNumber = index + 1;
            const hypothesisText = $(this).val();
            hypothesesHtml += `<li>Hypothesis ${hypothesisNumber}: ${hypothesisText}</li>`;
        });
    return hypothesesHtml + "</ol>";
}

function selectionRequirementsSetup() {
    var hypothesesOptions = loadHypotheses();
    var selectedData = selectedColumns; // Assuming 'selectedColumns' is defined elsewhere

    $("#selected-columns-container").empty();
    $("#hypotheses-list").empty();
    $("#hypotheses-list").html(loadHypothesesList());
    Object.keys(selectedData).forEach((tableName) => {
        var tableParent = $('<div class="overflow-x-auto"></div');
        var table = $('<table class="table table-zebra w-full"></table>');
        var headerRow = $(
            "<thead><tr>" +
                '<th class="w-1/4 md:w-1/6 lg:w-1/8">Name</th>' +
                '<th class="w-1/3 md:w-1/3 lg:w-1/4">Construct</th>' +
                '<th class="w-1/3 md:w-1/3 lg:w-1/4">Hypotheses</th>' +
                '<th class="w-1/3 md:w-1/3 lg:w-1/6">Outcome measure</th>' +
                '<th class="w-1/3 md:w-1/3 lg:w-1/6">Required</th>' +
                '<th class="w-1/12 md:w-1/12 lg:w-1/12">A1</th>' +
                '<th class="w-1/12 md:w-1/12 lg:w-1/12">A2</th>' +
                '<th class="w-1/12 md:w-1/12 lg:w-1/12">A3</th>' +
                "</tr></thead>"
        );
        table.append(headerRow);
        var tableBody = $("<tbody></tbody>");

        selectedData[tableName].forEach((checkbox) => {
            var name = $(checkbox).parent().siblings().first().text();
            var id = $(checkbox).parent().parent().attr("id");
            var availableAssessments =
                getAvailableAssessmentsFromCheckbox(checkbox);
            var assessmentCheckbox =
                '<input type="checkbox" class="checkbox checkbox-assessment-selection">';
            var rowHtml = `<tr id="requirements-${id}">
                    <td><span>${name}</span></td>
                    <td><textarea class="textarea w-full max-w-xs"></textarea></td>
                    <td><select class="w-full hypotheses-select" name="hypotheses[]">${hypothesesOptions}</select></td>
                    <td><select class="select w-full max-w-xs" required="true"><option value="" default>Choose</option><option value="Primary">Primary</option><option value="Secondary">Secondary</option></select></td>
                    <td><select class="select w-full max-w-xs" required="true"><option>No</option><option>Yes</option></select></td>
                    <td class="A1-checkbox-td">${
                        availableAssessments.includes("A1")
                            ? assessmentCheckbox
                            : ""
                    }</td>
                    <td class="A2-checkbox-td">${
                        availableAssessments.includes("A2")
                            ? assessmentCheckbox
                            : ""
                    }</td>
                    <td class="A3-checkbox-td">${
                        availableAssessments.includes("A3")
                            ? assessmentCheckbox
                            : ""
                    }</td>
                </tr>`;
            tableBody.append(rowHtml);
        });

        table.append(tableBody);
        tableParent.append(table);
        $("#selected-columns-container").append(
            `<h3 class="text-xl font-bold mt-5">${tableName}</h3>`
        );
        $("#selected-columns-container").append(tableParent);
    });
}

function initializeSelectionRequirementsListeners() {
    $('input[type="checkbox"].checkbox-data-selection').change(function () {
        selectionRequirementsSetup();
        initializeSelect2();
    });

    $("#hypothesesContainer").change(function () {
        selectionRequirementsSetup();
        initializeSelect2();
    });
}

// Initialize Select2 on select elements and update it to support multiselect.
function initializeSelect2() {
    $(".hypotheses-select")
        .select2({
            placeholder: "Select hypotheses",
            width: "100%", // Adjust width to resolve based on the content or parent width
            allowClear: true,
            multiple: true,
        })
        .val(null)
        .trigger("change");
}
