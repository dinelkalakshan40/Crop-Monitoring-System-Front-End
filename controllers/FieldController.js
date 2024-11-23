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
