$(document).ready(function () {
    loadStaffTable();
    $('#AddStaff').on('click', function () {

        const staffData = {
            staffId: $('#staffId').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            designation: $('#designation').val(),
            gender: $('#genderSelect').val(),
            dob: $('#dob').val(),
            joinedDate: $('#joinedDate').val(),
            address: $('#Address').val(),
            contact: $('#contact').val(),
            role: $('#roleSelect').val(),
            fields: [],
            vehicles: []
        };
        console.log("Collected Staff Data: ", JSON.stringify(staffData));

        // Get token from local storage
        const token = localStorage.getItem('authToken');

        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token // Add token to the header
            },
            contentType: 'application/json',
            data: JSON.stringify(staffData),
            success: function (response) {
                alert('Staff saved successfully!');
                console.log('Response:', response);
            },
            error: function (error) {
                console.error('Error saving staff:', error);
                alert('Failed to save staff.');
            }
        });
    });
    function loadStaffTable(){
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Add the token here
            },
            success: function(response) {
                console.log("Staff data retrieved successfully:");
                console.log(response);

                // Clear existing table rows
                $('#staffTable tbody').empty();

                // Iterate over the response to create table rows
                response.forEach(function(staff) {
                    var row = '<tr>' +
                        '<td>' + staff.staffId + '</td>' +
                        '<td>' + staff.firstName + '</td>' +
                        '<td>' + staff.lastName + '</td>' +
                        '<td>' + staff.designation + '</td>' +
                        '<td>' + staff.gender + '</td>' +
                        '<td>' + staff.joinedDate + '</td>' +
                        '<td>' + staff.dob + '</td>' +
                        '<td>' + staff.contact + '</td>' +
                        '<td>' + staff.role + '</td>' +
                        '<td>' + staff.address + '</td>' +
                        '</tr>';
                    // Append the row to the table body
                    $('#staffTable tbody').append(row);
                });
            },
            error: function(error) {
                console.error("Error retrieving staff data:");
                console.error(error);
                alert("Failed to load staff data.");
            }
        });
    }

});

