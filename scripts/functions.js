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

// Function which moves the PDF generation to a new page so no content falls out of margins
function addPageIsHeightTooHigh(doc, currentY, additionalY = 5, elementHeight = 20) {
    var pageHeight = 297; // A4 height in mm
    if (currentY + elementHeight > pageHeight) {
        // Check if adding new content will go beyond the page height
        doc.addPage();
        currentY = 25; // Reset Y to top margin after adding a new page
    }

    currentY += additionalY;
    return currentY;
}