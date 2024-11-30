$(document).ready(function () {

    loadStaffDropdown();
    loadMonitorLogsDropdown()

    $('#saveCropButton').on('click', function () {

        const formData = new FormData();
        formData.append("cropCode", $('#cropCode').val());
        formData.append("cropName", $('#cropName').val());
        formData.append("cropImage", $('#cropImage')[0].files[0]); // Getting the selected file
        formData.append("category", $('#category').val());
        formData.append("cropSeason", $('#cropSeason').val());
        formData.append("fieldCode", $('#fieldCode').val());
        formData.append("logCode", $('#logCode').val() || ""); // Optional field


        $.ajax({
            url: '/your-endpoint',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Handle success response
                showSuccessMessage(response);
            },
            error: function (xhr, status, error) {

                const errorMessage = xhr.responseText || "An error occurred while saving the crop.";
                showErrorMessage(errorMessage);
            }
        });
    });

    // Custom success message function
    function showSuccessMessage(message) {
        $('#alertContainer').html(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }

    // Custom error message function
    function showErrorMessage(message) {
        $('#alertContainer').html(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }
    function loadStaffDropdown() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('Staff data:', response);

                $('#staffCropDropdown').empty();


                // Add default option
                $('#staffCropDropdown').append('<option value="" selected disabled>Select Staff 1</option>');



                response.forEach(function (staff) {
                    var staffOption = `<option value="${staff.staffId}">${staff.staffId} - ${staff.firstName} ${staff.lastName}</option>`;
                    $('#staffCropDropdown').append(staffOption);

                });
            },
            error: function (error) {
                console.error('Error fetching staff:', error);
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
                $('#monitorLogCropDropdown').empty();

                // Add default option
                $('#monitorLogCropDropdown').append('<option value="" selected disabled>Select a Monitor Log</option>');

                // Populate the dropdown with monitor logs
                response.forEach(function (log) {
                    var logOption = `<option value="${log.LogCode}">${log.LogCode} </option>`;
                    $('#monitorLogCropDropdown').append(logOption);
                });
            },
            error: function (error) {
                console.error('Error fetching monitor logs:', error);

            }
        });
    }
});
