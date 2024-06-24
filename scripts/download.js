function sendMail() {
    var email = "hbs-data@radboudumc.nl"; // Set the recipient email address
    var subject = encodeURIComponent("[Data Request Round 2024-4]"); // Set the email subject line
    var emailBody = encodeURIComponent(
        "Dear,\n\nPlease find attached the PDF of my data request.\n\nKind regards,"
    ); // Set the email body text
    var mailtoLink =
        "mailto:" + email + "?subject=" + subject + "&body=" + emailBody;
    window.location.href = mailtoLink; // Trigger the mail client
}
