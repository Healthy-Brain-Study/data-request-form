$(document).ready(function () {
    let hypothesisCount = 0; // To track the total number of hypotheses

    // Function to add new hypothesis
    $("#addHypothesisButton").click(function () {
        hypothesisCount++;
        // For every hypothesis a remove button will be added, except for the first hypothesis
        const removeButton =
            hypothesisCount > 1
                ? '<button class="btn btn-error" type="button" onclick="removeHypothesis(this)">Remove</button>'
                : "";
        const hypothesisHTML = `
            <div class="flex flex-col mb-4 p-2 border-4" data-hypothesis-id="${hypothesisCount}">
                <div class="flex flex-col md:flex-row items-start md:items-center mb-2 gap-4">
                    <label class="label w-1/3">
                        <span class="label-text">Hypothesis #${hypothesisCount}</span>
                    </label>
                    <textarea name="hypotheses[]" placeholder="Enter your hypothesis" class="textarea textarea-bordered w-full md:w-2/3" required="true"></textarea>
                    ${removeButton}
                </div>
            </div>
        `;
        $("#hypothesesContainer").append(hypothesisHTML);
        selectionRequirementsSetup();
    });

    // Function to remove hypothesis
    window.removeHypothesis = function (button) {
        $(button).parent().parent().remove();
        hypothesisCount--;
        renumberHypotheses();
        selectionRequirementsSetup();
    };

    // Function to renumber hypotheses
    function renumberHypotheses() {
        $("#hypothesesContainer")
            .children()
            .each(function (index) {
                $(this).attr("data-hypothesis-id", index + 1);
                $(this)
                    .find(".label-text")
                    .text(`Hypothesis #${index + 1}`);
            });
    }

    // Automatically add an initial hypothesis
    $("#addHypothesisButton").click();
});
