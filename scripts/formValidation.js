function getInvalidRequiredElements(step) {
    var missingInputs = [];

    // Regex pattern to validate email addresses
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Iterate over each required element within the specified ID
    $(`#step${step}`)
        .find('[required="true"], [required="required"]')
        .each(function () {
            var $element = $(this);
            var isValid = true;

            // Check element type and validate accordingly
            switch ($element.prop("type")) {
                case "checkbox":
                    // Check if the checkbox is not checked
                    if (!$element.is(":checked")) {
                        isValid = false;
                    }
                    break;
                case "radio":
                    // Check if any radio button in the group is checked
                    var name = $element.attr("name");
                    if ($('input[name="' + name + '"]:checked').length === 0) {
                        isValid = false;
                    }
                    break;
                case "select-one":
                case "select-multiple":
                    // Check if the select has a value
                    if (
                        $element.val() === null ||
                        $element.val().length === 0
                    ) {
                        isValid = false;
                    }
                    break;
                case "email":
                    // Validate the email format
                    if (!$element.val().match(emailRegex)) {
                        isValid = false;
                    }
                    break;
                default:
                    // For other inputs like text, email, etc., check if the value is empty
                    if ($element.val().trim() === "") {
                        isValid = false;
                    }
            }

            if (!isValid) {
                if ($element.prop("type") == "checkbox") {
                    $element.parent().css("border", "2px solid red"); // Highlight the field in red if it's invalid
                } else {
                    $element.css("border", "2px solid red");
                }
            } else {
                if ($element.prop("type") == "checkbox") {
                    $element.parent().css("border", ""); // Highlight the field in red if it's invalid
                } else {
                    $element.css("border", "");
                }
            }

            // If not valid, add to the list
            if (!isValid) {
                missingInputs.push($element);
            }
        });

    return missingInputs;
}
