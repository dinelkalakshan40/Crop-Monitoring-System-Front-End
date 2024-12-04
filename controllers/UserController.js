$(document).ready(function () {
    $("#register-submit-btn").click(function () {
        // Capture input
        const userName = $("#userName").val().trim();
        const email = $("#email").val().trim();
        const password = $("#password").val().trim();
        const role = $("#role").val();


        const requestData = {
            userName: userName,
            email: email,
            password: password,
            role: role
        };


        $.ajax({
            url: "http://localhost:8080/cropMonitoringSystem/api/v1/auth/signup",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestData),
            success: function (response) {

                // Extract token from response
                const token = response.token;

                // Store token in localStorage
                localStorage.setItem("authToken", token);

                // Notify user and redirect to the sign-in page
                alert("Registration successful! Redirecting to sign-in page.");
                $("#navigation").css({display: "none"});
                $("#login_page").css({display: "block"});
                $("#register_page").css({display: "none"});
                $("#dashboard_page").css({display: "none"});
                $("#staff_page").css({display: "none"});
                $("#field_page").css({display: "none"});
                $("#crop_page").css({display: "none"});
                $("#vehicle_page").css({display: "none"});
                $("#equipment_page").css({display: "none"});
                $("#log_page").css({display: "none"});
                $("#user_page").css({display: "none"});

            },
            error: function (xhr, status, error) {
                console.error("Registration failed:", error);
                alert("Registration failed. Please try again.");
            }
        });
    });



    $("#login-submit-btn").click(function () {

        const email = $("#loginEmail").val().trim();
        const password = $("#loginPassword").val().trim();

        // Validate the input fields (simple validation)
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }


        const loginData = {
            email: email,
            password: password
        };

        // Make an AJAX request to authenticate the user
        $.ajax({
            url: "http://localhost:8080/cropMonitoringSystem/api/v1/auth/signin",  // Replace with your backend API URL
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(loginData),
            success: function (response) {
                if (response.token) {
                    // If login is successful and token is received, store the token in localStorage
                    localStorage.setItem("authToken", response.token);

                    $("#navigation").css({display: "block"});
                    $("#login_page").css({display: "none"});
                    $("#register_page").css({display: "none"});
                    $("#dashboard_page").css({display: "none"});
                    $("#staff_page").css({display: "none"});
                    $("#field_page").css({display: "block"});
                    $("#crop_page").css({display: "none"});
                    $("#vehicle_page").css({display: "none"});
                    $("#equipment_page").css({display: "none"});
                    $("#log_page").css({display: "none"});
                    $("#user_page").css({display: "none"});
                    alert("Login success");

                } else {
                    $("#login_page").css({ display: "block" });
                    alert("Login failed: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error during login:", error);
                $("#login_page").css({ display: "block" });
                alert("Login failed. Please try again.");

            }
        });
    });
});
