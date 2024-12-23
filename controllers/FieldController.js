$(document).ready(function () {
    loadStaffDropdown();
    loadMonitorLogsDropdown();
    loadAllFieldData();
    generatedFieldCode();


    function loadStaffDropdown() {
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the Authorization header
            },
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
            }
        });
    }

    function loadMonitorLogsDropdown() {
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/monitors',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the Authorization header
            },
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
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Add the token here
            },
            data: JSON.stringify(fieldDTO),
            success: function (response) {
                alert("Field saved successfully!");
                console.log("Success response:", response);
                generatedFieldCode();
                clearAllField();
                loadAllFieldData();
            },
            error: (res) => {
                console.error(JSON.stringify(res));
                alert("Field Data Not saved")
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
        const regex = /^FLD-00\d+$/;
        return regex.test(fieldCode);
    }

    function loadAllFieldData() {
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/fields',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the Authorization header
            },
            success: function (response) {
                const tableBody = $('#fieldTable tbody');
                tableBody.empty(); // Clear existing rows
                console.log("loadAllFieldData :"+ response);


                response.forEach(function (field) {
                    const staffList = Array.isArray(field.staffIds) && field.staffIds.length > 0
                        ? field.staffIds.join(', ')
                        : 'N/A';
                    const row = `
                        <tr>
                            <td>${field.fieldCode}</td>
                            <td>${field.fieldName}</td>
                            <td>${field.fieldLocation}</td>
                            <td>${field.fieldSize}</td>
                            <td>${field.logCode || 'N/A'}</td>
                            <td>${staffList}</td>
                            <td>${field.fieldImage1 || 'N/A'}</td>
                            <td>${field.fieldImage2 || 'N/A'}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
                $('#fieldTable tbody tr').on('click', function () {
                    const cells = $(this).find('td');

                    // Populate input fields
                    $('#fieldCode').val(cells.eq(0).text());
                    $('#fieldName').val(cells.eq(1).text());
                    $('#fieldLocation').val(cells.eq(2).text());
                    $('#fieldSize').val(cells.eq(3).text());
                    $('#fieldImage1').val(cells.eq(6).text() || '');
                    $('#fieldImage2').val(cells.eq(7).text() || '');
                    //disable drop down
                    $("#monitorLogDropdown").prop("disabled", true);
                    $("#staffDropdown1").prop("disabled", true);
                    $("#staffDropdown2").prop("disabled", true);

                });
            },
            error: function (error) {
                console.error('Error fetching field data:', error);
            }
        });
    }
    // Click event handler for the "Update" button


    $('#updateField').on('click', function () {

        const fieldCode = $('#fieldCode').val();
        const fieldName = $('#fieldName').val();
        const fieldLocation = $('#fieldLocation').val();
        const fieldSize = parseFloat($('#fieldSize').val()); //

        const fieldImage1 = $('#fieldImage1').val();
        const fieldImage2 = $('#fieldImage2').val();

        // Create an object to hold the data
        const updatedFieldData = {
            fieldCode: fieldCode,
            fieldName: fieldName,
            fieldLocation: fieldLocation,
            fieldSize: fieldSize,
            fieldImage1:fieldImage1,
            fieldImage2:fieldImage2
        };
        console.log(updatedFieldData);

        $.ajax({
            url: `http://localhost:8080/cropMonitoringSystem/api/v1/fields/${fieldCode}`,
            type: "PUT",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Add the token here
            },
            data: JSON.stringify(updatedFieldData),
            success: function (response) {
                alert('Field updated successfully!');
                console.log(response);
                clearAllField();
                generatedFieldCode();
                loadAllFieldData();
                $('#monitorLogDropdown').prop('disabled', false);
                $('#staffDropdown1').prop('disabled', false);
                $('#staffDropdown2').prop('disabled', false);
            },
            error: function (error) {
                console.error('Error updating field data:', error);
                alert('Failed to update field data');
            }
        });
    });
    $('#deleteField').on('click', function () {
        const fieldCode = $('#fieldCode').val();

        // AJAX DELETE request
        $.ajax({
            url: `http://localhost:8080/cropMonitoringSystem/api/v1/fields/${fieldCode}`, // API endpoint
            type: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Add the token here
            },
            success: function () {
                // Handle success response
                alert('Field data deleted successfully!');
                console.log('Field deleted successfully');
                loadAllFieldData();
                generatedFieldCode();
                clearAllField();
                $('#monitorLogDropdown').prop('disabled', false);
                $('#staffDropdown1').prop('disabled', false);
                $('#staffDropdown2').prop('disabled', false);
            },
            error: function (error) {
                console.error('Error deleting field data:', error);
                alert('Failed to delete field data');
            }
        });
    });
    $('#searchButton').on('click', function () {
        const fieldCode = $('#searchInput').val();

        const token = localStorage.getItem('authToken');
        $.ajax({
            url: `http://localhost:8080/cropMonitoringSystem/api/v1/fields/details/${fieldCode}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the Authorization header
            },
            success: function (fieldDetails) {
                // Handle success response
                console.log('Search Field data retrieved:', fieldDetails);


                $('#fieldName').val(fieldDetails.fieldName || '');
                $('#fieldLocation').val(fieldDetails.fieldLocation || '');
                $('#fieldSize').val(fieldDetails.fieldSize || '');
                $('#fieldImage1').val(fieldDetails.fieldImage1 || '');
                $('#fieldImage2').val(fieldDetails.fieldImage2 || '');

                alert('Field data retrieved');
            },
            error: function (error) {
                // Handle errors
                console.error('Error retrieving field details:', error);
                alert("error retriev data")

            }
        });
    });
    function generatedFieldCode() {
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: "http://localhost:8080/cropMonitoringSystem/api/v1/fields/fieldCode",  // Your API endpoint
            type: "GET",  // HTTP method
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the Authorization header
            },
            success: function(response) {
                console.log("Generated Field Code:", response);
                // Assuming the response contains the generated field code as a string
                $('#fieldCode').val(response);
            },
            error: function(error) {
                console.error('Error fetching field code:', error);

            }
        });
    }
    $("#clearField").on("click", function () {
        generatedFieldCode();
        $("#searchInput").val('');
        $('#fieldName').val('');
        $('#fieldLocation').val('');
        $('#fieldSize').val('');
        $('#fieldImage1').val('');
        $('#fieldImage2').val('');

        // Reset dropdowns to the default option
        $('#monitorLogDropdown').prop('selectedIndex', 0);
        $('#staffDropdown1').prop('selectedIndex', 0);
        $('#staffDropdown2').prop('selectedIndex', 0);
        // Enable dropdowns
        $('#monitorLogDropdown').prop('disabled', false);
        $('#staffDropdown1').prop('disabled', false);
        $('#staffDropdown2').prop('disabled', false);
    });
    function clearAllField(){
        generatedFieldCode();
        $('#fieldCode').val('');
        $('#fieldName').val('');
        $('#fieldLocation').val('');
        $('#fieldSize').val('');
        $('#fieldImage1').val('');
        $('#fieldImage2').val('');

        // Reset dropdowns to the default option
        $('#monitorLogDropdown').prop('selectedIndex', 0);
        $('#staffDropdown1').prop('selectedIndex', 0);
        $('#staffDropdown2').prop('selectedIndex', 0);

    }

});


