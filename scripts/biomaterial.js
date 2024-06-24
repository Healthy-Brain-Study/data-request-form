var containsBiosamples = false;

function doSelectedColumnsContainBiosamples() {
    var object = selectedColumns;
    var searchQuery = "bio-samples";
    for (let key in object) {
      if (key.toLowerCase().includes(searchQuery)) {
        return true;
      }
    }
    return false;
}


$(document).ready(function() {
    // Set initial state based on checkbox and apply initial UI changes
    onChangeBiosamples($('#require-biomaterial').is(':checked'));

    // Attach event listener to the checkbox using jQuery
    $('#require-biomaterial').change(function() {
        onChangeBiosamples($(this).is(':checked'));
    });
});

// Function to handle UI changes based on whether biomaterial is required
function onChangeBiosamples(isRequired = false) {
    // Show or hide elements and set required attribute based on the boolean input
    if (isRequired) {
        $(".bio-samples").show();
        $('#contact-information-bio-samples').prop('required', true);
    } else {
        $(".bio-samples").hide();
        $('#contact-information-bio-samples').removeAttr('required');
    }
}