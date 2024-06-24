var firstResearcher = true;
$(document).ready(function () {
    $("#addRowButton").click(function () {
        const removeButton = `<div class="md:col-span-1 col-span-2 flex items-end">
                                    <button class="btn btn-error w-full" type="button" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button>
                                </div>`;
        const newRow = `
                <div class="grid grid-cols-2 md:grid-cols-6 gap-4 px-4 py-2 border-4 mb-4">
                    <div class="md:col-span-1 col-span-2">
                        <label class="block text-sm font-bold mb-1">Name</label>
                        <input type="text" name="data_access_name[]" placeholder="Name" class="input input-bordered w-full" required="true">
                    </div>
                    <div class="md:col-span-1 col-span-2">
                        <label class="block text-sm font-bold mb-1">E-mail address</label>
                        <input type="email" name="data_access_email[]" placeholder="E-mail address" class="input input-bordered w-full" required="true">
                    </div>
                    <div class="md:col-span-1 col-span-2">
                        <label class="block text-sm font-bold mb-1">Affiliation</label>
                        <input type="text" name="data_access_affiliation[]" placeholder="Affiliation"
                            class="input input-bordered w-full">
                    </div>
                    <div class="md:col-span-1 col-span-2">
                        <label class="block text-sm font-bold mb-1">Reason for access</label>
                        <input type="text" name="data_access_reason[]" placeholder="Reason for access"
                            class="input input-bordered w-full">
                    </div>
                    <div class="md:col-span-1 col-span-2">
                        <label class="block text-sm font-bold mb-1">Contribution to HBS</label>
                        <select name="data_access_contribution[]" data-placeholder="Contribution to HBS"
                            class="select select-bordered w-full">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    ${firstResearcher ? "" : removeButton}
                </div>
                `;
        $("#researcherTableBody").append(newRow);
        firstResearcher = false;
    });

    // Automatically add an initial row
    $("#addRowButton").click();
});
