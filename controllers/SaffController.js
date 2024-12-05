$(document).ready(function () {
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
            fields: [], // Add field data if applicable
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
});

