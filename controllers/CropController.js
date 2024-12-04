$(document).ready(function () {

    loadFieldDropdown();
    loadMonitorLogsDropdown();
    loadCropData();

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
                $('#CropCode').val('');
                $('#CropName').val('');
                $('#cropImage').val('');
                $('#CropCategory').val('');
                $('#cropSeason').val('');

                $('#fieldCropDropdown').prop('selectedIndex', 0);
                $('#monitorLogCropDropdown').prop('selectedIndex', 0);

                loadCropData();
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
   /* function loadCropData() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/crops',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const tableBody = $('#cropTable tbody');
                tableBody.empty(); // Clear any existing rows

                if (data && data.length > 0) {
                    data.forEach(crop => {
                        const row = `
                    <tr>
                        <td>${crop.cropCode}</td>
                        <td>${crop.cropName}</td>
                        <td>${crop.cropImage || 'N/A'}</td> <!-- Directly display formatted size -->
                        <td>${crop.category}</td>
                        <td>${crop.cropSeason}</td>
                        <td>${crop.fieldCode}</td>
                        <td>${crop.logCode || 'N/A'}</td>
                        
                    </tr>
                `;
                        tableBody.append(row);
                    });
                } else {
                    const noDataRow = `
                <tr>
                    <td colspan="7" class="text-center">No crops available.</td>
                </tr>
            `;
                    tableBody.append(noDataRow);
                }
            },
            error: function (xhr, status, error) {
                alert("Error: Unable to load crop data.");
            }
        });
    }*/
    function loadCropData() {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/crops',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Crop data received:', data);
                const tableBody = $('#cropTable tbody');
                tableBody.empty(); // Clear any existing rows

                if (data && data.length > 0) {
                    data.forEach(crop => {
                        const row = `
                        <tr>
                            <td>${crop.cropCode}</td>
                            <td>${crop.cropName}</td>
                            <td>${crop.cropImage || 'N/A'}</td>
                            <td>${crop.category}</td>
                            <td>${crop.cropSeason}</td>
                            <td>${crop.fieldCode}</td>
                            <td>${crop.logCode || 'N/A'}</td>
                        </tr>
                    `;
                        tableBody.append(row);
                    });

                    $('#cropTable tbody tr').on('click', function () {
                        const selectedRow = $(this).children('td');

                        $('#CropCode').val(selectedRow.eq(0).text());
                        $('#CropName').val(selectedRow.eq(1).text());

                        $('#CropCategory').val(selectedRow.eq(3).text());
                        $('#cropSeason').val(selectedRow.eq(4).text());
                        $('#fieldCropDropdown').val(selectedRow.eq(5).text());
                        $('#monitorLogCropDropdown').val(selectedRow.eq(6).text());
                    });
                } else {
                    const noDataRow = `
                    <tr>
                        <td colspan="7" class="text-center">No crops available.</td>
                    </tr>
                `;
                    tableBody.append(noDataRow);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Crop  data received failed:', textStatus, errorThrown); // Log the error details
            }
        });
    }

    $('#deleteCrop').on('click', function () {
        const cropCode = $('#CropCode').val();

        $.ajax({
            url: `http://localhost:8080/cropMonitoringSystem/api/v1/crops/${cropCode}`,
            type: 'DELETE',
            success: function (response) {
                alert(response);

                loadCropData();
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseText || "Failed to delete crop.";
                alert("Error: " + errorMessage);
            }
        });
    });

});
