$(document).ready(function () {
    $("#diffPI").change(function () {
        if ($(this).is(":checked")) {
            $("#piInformation").show();
        } else {
            $("#piInformation").hide();
        }
    });
});
