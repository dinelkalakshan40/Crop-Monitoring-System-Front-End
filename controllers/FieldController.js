$(document).ready(function () {
    loadStaffDropdown();

    function loadStaffDropdown() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'GET',
            contentType: 'application/json',
            success: function(response) {
                console.log('Staff data:', response);

                $('#staffDropdown1').empty();
                $('#staffDropdown2').empty();

                // Add default option
                $('#staffDropdown1').append('<option value="" selected disabled>Select Staff 1</option>');
                $('#staffDropdown2').append('<option value="" selected disabled>Select Staff 2</option>');

                // Loop through the staff list and append options to both dropdowns
                response.forEach(function(staff) {
                    var staffOption = `<option value="${staff.staffId}">${staff.staffId} - ${staff.firstName} ${staff.lastName}</option>`;
                    $('#staffDropdown1').append(staffOption);
                    $('#staffDropdown2').append(staffOption);
                });
            },
            error: function(error) {
                console.error('Error fetching staff:', error);
                alert('Error fetching staff data.');
            }
        });
    }

    $('#AddField').click(function (e) {
        e.preventDefault(); // Prevent default form submission

        // into a JavaScript object
        var fieldDTO = {
            fieldCode: $('#fieldCode').val(),
            fieldName: $('#fieldName').val(),
            fieldLocation: $('#fieldLocation').val(),
            fieldSize: parseFloat($('#fieldSize').val()), // Convert to number if needed
            logCode: $('#logCode').val(),
            staff: [{ staffId: $('#staffId').val() }], // Assuming single staff for simplicity
            fieldImage1: $('#fieldImage1').val(),
            fieldImage2: $('#fieldImage2').val()
        };
        console.log(fieldDTO);

        // AJAX POST request to submit the form data
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/fields',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(fieldDTO),
            success: function (response) {
                alert(response.message || "Field saved successfully!");
                console.log("Success response:", response);
            },
            error: (res) => {
                console.error(JSON.stringify(res));
            },
        });
    });
});


