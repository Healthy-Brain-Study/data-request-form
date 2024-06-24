function getStepTitleForNavigationButton(stepId) {
    return $(`#step${stepId}`).attr("data-button-title");
}

function generateNavigationButtons(currentStep, totalSteps) {
    const prevButton =
        currentStep > 0
            ? `<a href="JavaScript:void(0);" class="prev-btn btn btn-sm md:btn-md gap-2 lg:gap-3 md:w-72 btn-active" id="prev-button-${
                  currentStep + 1
              }">
                <svg class="h-6 w-6 fill-current md:h-8 md:w-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                </svg>
                <div class="flex flex-col items-start">
                    <span class="text-base-content/50 hidden text-xs font-normal md:block">${getStepTitleForNavigationButton(
                        currentStep
                    )}</span>
                    <span>Step ${currentStep}</span>
                </div>
            </a>`
            : "";

    const currentButton =
        currentStep > 0
            ? `<a href="JavaScript:void(0);" class="btn bg-white btn-sm md:btn-md gap-2 lg:gap-3 md:w-72 btn-active">
                        <div class="flex flex-col items-start">
                            <span class="text-base-content/50 hidden text-xs font-normal md:block">${getStepTitleForNavigationButton(
                                currentStep + 1
                            )}</span>
                            <span>Step ${currentStep + 1}</span>
                        </div>
                    </a>`
            : "";

    const nextButtonText =
        currentStep === totalSteps - 1
            ? "Submit"
            : getStepTitleForNavigationButton(currentStep + 2);
    var nextButton = `<a href="JavaScript:void(0);" class="next-btn btn btn-neutral btn-sm md:btn-md gap-2 lg:gap-3 md:w-72" id="next-button-${
        currentStep + 1
    }">
        <div class="flex flex-col items-end">
            <span class="text-neutral-content/50 hidden text-xs font-normal md:block">${nextButtonText}</span>
            <span>Step ${currentStep + 2}</span>
        </div>
        <svg class="h-6 w-6 fill-current md:h-8 md:w-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
        </svg>
    </a>`;

    // If there is no next step don't show next button (by setting the nextButton variable empty)
    if (
        $(`#step${currentStep + 2}`)
            .text()
            .trim() == ""
    ) {
        nextButton = undefined;
    }

    return { prevButton, currentButton, nextButton };
}

function loadNavigationButtons() {
    const $steps = $(".form-step");
    const totalSteps = $steps.length;
    var currentStep = 0;

    // Initialize the first step
    updateStep(currentStep);

    // Event handler for "next" button
    $(document).on("click", ".next-btn", function () {
        // List of elements from the current form step which are required but not filled in correctly
        var invalidInputElements = getInvalidRequiredElements(currentStep + 1);

        var checkboxesForAssessmentSelection = [];
        $(".checkbox-assessment-selection").each(function () {
            checkboxesForAssessmentSelection.push($(this).prop("checked"));
        });

        var stepTitle = $(`#step${currentStep + 1}`).attr("data-button-title");

        if (
            stepTitle == "Selection Requirements" &&
            !checkboxesForAssessmentSelection.includes(true)
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing assessments",
                text: "Please select at least 1 assessment for a variable.",
                confirmButtonColor: "#a8b292",
            });
        } else if (invalidInputElements.length != 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing required form elements",
                text: "Please fill in required form elements.",
                confirmButtonColor: "#a8b292",
            });
        } else if (
            stepTitle == "Data Selection" &&
            Object.keys(selectedColumns).length == 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "No variables selected",
                text: "Please select at least 1 variable to continue",
                confirmButtonColor: "#a8b292",
            });
        } else {
            if (currentStep < totalSteps - 1) {
                changeStep(currentStep + 1);
            }

            if (
                stepTitle == "Selection Requirements" &&
                window.matchMedia("(orientation: portrait)").matches &&
                window.matchMedia("(max-width: 768px)").matches
            ) {
                Swal.fire({
                    icon: "info",
                    title: "Please rotate screen to landscape position.",
                    html: "<img class='object-fit w-20 display-block m-auto' src='static/rotate-smartphone.png'></img><a href='https://www.flaticon.com/free-icons/mobile-phone' class='text-white' title='mobile phone icons'>Mobile phone icons created by Freepik - Flaticon</a>",
                    confirmButtonColor: "#a8b292",
                    style: "",
                });
            }
        }
    });

    // Event handler for "prev" button
    $(document).on("click", ".prev-btn", function () {
        if (currentStep > 0) {
            changeStep(currentStep - 1);
        }
    });

    function updateStep(step) {
        $(".form-step").hide().eq(step).show(); // Show only the current step
        $steps.removeClass("active").eq(step).addClass("active"); // Update active class

        // Add or update navigation buttons
        $(".form-step .navigation-buttons").remove(); // Remove existing buttons
        const navButtons = generateNavigationButtons(step, totalSteps);
        $steps.eq(step).prepend(
            `<div style="background-color: #a8b292; display: flex; justify-content: space-between;" class="z-10 btm-nav navigation-buttons gap-4 py-4">
                    <div style="flex: 1; display: flex; justify-content: center;">
                        <!-- Placeholder for previous button -->
                        ${navButtons.prevButton || "<div></div>"}
                    </div>
                    <div style="flex: 1; display: flex; justify-content: center;">
                        <!-- Placeholder for previous button -->
                        ${navButtons.currentButton || "<div></div>"}
                    </div>
                    <div style="flex: 1; display: flex; justify-content: center;">
                        <!-- Placeholder for next button -->
                        ${navButtons.nextButton || "<div></div>"}
                    </div>
                </div>
                `
        );
    }

    function changeStep(newStep) {
        currentStep = newStep;
        updateStep(currentStep);
    }
}
