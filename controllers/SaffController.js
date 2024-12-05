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
                $('#firstName').val('');
                $('#lastName').val('');
                $('#designation').val('');
                $('#genderSelect').val('');
                $('#joinedDate').val('');
                $('#dob').val('');
                $('#contact').val('');
                $('#roleSelect').val('');
                $('#Address').val('');
            },
            error: function (error) {
                console.error('Error saving staff:', error);
                alert('Failed to save staff.');
            }
        });
    });
    function loadStaffTable() {
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

                // Add event listener for row click
                $('#staffTable tbody tr').on('click', function() {
                    var selectedRow = $(this);

                    // Get the data from the selected row
                    var staffId = selectedRow.find('td').eq(0).text();
                    var firstName = selectedRow.find('td').eq(1).text();
                    var lastName = selectedRow.find('td').eq(2).text();
                    var designation = selectedRow.find('td').eq(3).text();
                    var gender = selectedRow.find('td').eq(4).text();
                    var joinedDate = selectedRow.find('td').eq(5).text();
                    var dob = selectedRow.find('td').eq(6).text();
                    var contact = selectedRow.find('td').eq(7).text();
                    var role = selectedRow.find('td').eq(8).text();
                    var address = selectedRow.find('td').eq(9).text();

                    // Set the data to the input fields
                    $('#staffId').val(staffId);
                    $('#firstName').val(firstName);
                    $('#lastName').val(lastName);
                    $('#designation').val(designation);
                    $('#genderSelect').val(gender);  // Set gender select value
                    $('#joinedDate').val(joinedDate);
                    $('#dob').val(dob);
                    $('#contact').val(contact);
                    $('#roleSelect').val(role);  // Set role select value
                    $('#Address').val(address);
                });
            },
            error: function(error) {
                console.error("Error retrieving staff data:");
                console.error(error);
                alert("Failed to load staff data.");
            }
        });
    }
    $('#deleteStaff').on('click', function() {
        // Assuming you have the staffId stored in a hidden input or variable
        var staffId = $('#staffId').val();  // Get staff ID from an input field or other element

        if (staffId) {
            if (confirm('Are you sure you want to delete this staff member?')) {
                deleteStaff(staffId);  // Call deleteStaff function with the staffId
            }
        } else {
            alert('Please select a staff member to delete.');
        }
    });
    function deleteStaff(staffId) {
        $.ajax({
            url: 'http://localhost:8080/cropMonitoringSystem/api/v1/staff/' + staffId,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Include the token for authorization
            },
            success: function(response) {
                alert(response);  // Alert the user on successful deletion
                console.log('Staff deleted successfully:', response);
                loadStaffTable();  // Refresh the table to reflect the changes
            },
            error: function(error) {
                console.error('Error deleting staff:', error);
                alert('Failed to delete staff.');
            }
        });
    }
    $('#updateStaff').on('click', function() {
        var staffId = $('#staffId').val();
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var designation = $('#designation').val();
        var gender = $('#genderSelect').val();
        var dob = $('#dob').val();
        var joinedDate = $('#joinedDate').val();
        var address = $('#Address').val();
        var contact = $('#contact').val();
        var role = $('#roleSelect').val();

        var staffData = {
            staffId: staffId,
            firstName: firstName,
            lastName: lastName,
            designation: designation,
            gender: gender,
            dob: dob,
            joinedDate: joinedDate,
            address: address,
            contact: contact,
            role: role
        };

        $.ajax({
            url: `http://localhost:8080/cropMonitoringSystem/api/v1/staff/${staffId}`,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            contentType: 'application/json',
            data: JSON.stringify(staffData),
            success: function(response) {
                alert(response);
                console.log('Staff updated successfully:', response);
                loadStaffTable();
            },
            error: function(xhr, status, error) {
                console.error('X    HR:', xhr);
                console.error('Status:', status);
                console.error('Error:', error);
                alert('Failed to update staff: ' + (xhr.responseText || 'Unknown error'));
            }
        });
    });
    $('#clearStaffInputs').on('click', function () {
        $('#searchStaffInput, #staffId, #firstName, #lastName, #designation, #joinedDate, #dob, #contact, #Address').val('');
        $('#genderSelect, #roleSelect').prop('selectedIndex', 0);
    });
});

