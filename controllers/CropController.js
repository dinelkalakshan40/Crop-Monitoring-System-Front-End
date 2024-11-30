$(document).ready(function () {

    loadFieldDropdown();
    loadMonitorLogsDropdown();

    $('#AddCrop').on('click', function () {

        const cropCode = $('#CropCode').val();
        const cropName = $('#CropName').val();
        const cropImage = $('#cropImage')[0].files[0];
        const cropCategory = $('#CropCategory').val();
        const cropSeason = $('#cropSeason').val();
        const selectedField = $('#fieldCropDropdown').val();
        const selectedMonitorLog = $('#monitorLogCropDropdown').val();

        const formData = new FormData();
        formData.append('cropCode', cropCode);
        formData.append('cropName', cropName);
        formData.append('cropImage', cropImage);
        formData.append('category', cropCategory);
        formData.append('cropSeason', cropSeason);
        formData.append('fieldCode', selectedField);
        formData.append('logCode', selectedMonitorLog);
        console.log("Crop form Data :" +formData)
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/crops',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert("Success saved Crop data: " + response);
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseText || "An error occurred while saving the crop.";
                alert("Error: " + errorMessage);
            }
        });
    });

    function loadFieldDropdown() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/fields',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('Field data:', response);

                $('#fieldCropDropdown').empty();


                // Add default option
                $('#fieldCropDropdown').append('<option value="" selected disabled>Select Field</option>');



                response.forEach(function (field) {
                    var fieldOption = `<option value="${field.fieldCode}">${field.fieldCode}</option>`;
                    $('#fieldCropDropdown').append(fieldOption);

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
