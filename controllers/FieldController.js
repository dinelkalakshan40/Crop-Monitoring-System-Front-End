$(document).ready(function () {
    loadStaffDropdown();
    loadMonitorLogsDropdown();


    function loadStaffDropdown() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('Staff data:', response);

                $('#staffDropdown1').empty();
                $('#staffDropdown2').empty();

                // Add default option
                $('#staffDropdown1').append('<option value="" selected disabled>Select Staff 1</option>');
                $('#staffDropdown2').append('<option value="" selected disabled>Select Staff 2</option>');

                // Loop through the staff list and append options to both dropdowns
                response.forEach(function (staff) {
                    var staffOption = `<option value="${staff.staffId}">${staff.staffId} - ${staff.firstName} ${staff.lastName}</option>`;
                    $('#staffDropdown1').append(staffOption);
                    $('#staffDropdown2').append(staffOption);
                });
            },
            error: function (error) {
                console.error('Error fetching staff:', error);
                alert('Error fetching staff data.');
            }
        });
    }

    function loadMonitorLogsDropdown() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/monitors',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('Monitor Logs data:', response);

                // Clear the dropdown before appending new options
                $('#monitorLogDropdown').empty();

                // Add default option
                $('#monitorLogDropdown').append('<option value="" selected disabled>Select a Monitor Log</option>');

                // Populate the dropdown with monitor logs
                response.forEach(function (log) {
                    var logOption = `<option value="${log.LogCode}">${log.LogCode} </option>`;
                    $('#monitorLogDropdown').append(logOption);
                });
            },
            error: function (error) {
                console.error('Error fetching monitor logs:', error);
                alert('Failed to load monitor logs.');
            }
        });
    }

    $('#AddField').click(function (e) {
        e.preventDefault(); // Prevent default form submission

        var selectedStaff = [];
        var staff1 = $('#staffDropdown1').val();
        var staff2 = $('#staffDropdown2').val();

        var selectedLogCode = $('#monitorLogDropdown').val();

        if (staff1) selectedStaff.push({staffId: staff1});
        if (staff2) selectedStaff.push({staffId: staff2});

        if (!$('#fieldCode').val()) {
            alert("Field Code is required.");
            return;
        }

        // into a JavaScript object
        var fieldDTO = {
            fieldCode: $('#fieldCode').val(),
            fieldName: $('#fieldName').val(),
            fieldLocation: $('#fieldLocation').val(),
            fieldSize: parseFloat($('#fieldSize').val()), // Convert to number if needed
            logCode: selectedLogCode,
            staff: selectedStaff, // Assuming single staff for simplicity
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

    $('#fieldCode').on('input', function () {
        const fieldCode = $(this).val(); // Get the current value of the input field
        const isValid = validateFieldCode(fieldCode); // Validate the input
        const feedback = $('#fieldCodeFeedback'); // Feedback message element

        if (isValid) {
            // Hide feedback if valid
            feedback.hide();
            $(this).removeClass('is-invalid').addClass('is-valid');
        } else {
            // Show feedback if invalid
            feedback.show();
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
    });
    function validateFieldCode(fieldCode) {
        const regex = /^FLD-00\d+$/; // Regex pattern for FLD-xxxx
        return regex.test(fieldCode); // Test the input against the regex
    }

});


