var loadingModal;
document.addEventListener("DOMContentLoaded", function () {
    // Check if Swal is defined to ensure SweetAlert2 is loaded
    if (typeof Swal === "undefined") {
        console.error("SweetAlert2 is not loaded");
        return; // Stop execution if SweetAlert2 is not available
    }

    loadingModal = Swal.fire({
        title: "Loading",
        html: "I will close when the website is done loading",
        didOpen: () => {
            Swal.showLoading();
        },
    });
});
