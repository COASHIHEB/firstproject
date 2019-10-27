
let formData = new FormData();


$(document).ready(function () {
    var file;

    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#newImage').attr('src', e.target.result);
                file = document.getElementById("pictureFile").files[0];
                formData.append("post_file", file);
                $("#buttonInput").css("display", "none");
                $("#newDiv").css("display", "");
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".file-upload").on('change', function () {
        readURL(this);
        let buttonInput = document.getElementById("buttonInput");
        var newDiv = document.getElementById('newDiv');


    });

    $("#addNewSlide").on('click', function () {
        $(".file-upload").click();



    });

});

function addNewSlide() {

    let newNumberClass = $("#newNumberClass").val();
    let newTitle = $("#newTitle").val();
    let newNomOffre = $("#newNomOffre").val();
    formData.append("newNumberClass", newNumberClass);
    formData.append("newTitle", newTitle);
    formData.append("newNomOffre", newNomOffre);
    $.ajax({
        type: 'POST',
        data: formData,
        url: '/addNewSlide',
        contentType: false,
        processData: false,
        success: function (data) {
            if (data == "done") {
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
            }
        },
        error: function (data) {
            var x = document.getElementById("snackbarError");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 2000);
        }
    });
}

function deleteSlide(idSlide) {
    $.ajax({
        type: 'POST',
        url: '/deleteSlide',
        data: JSON.stringify({ idSlide: idSlide }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data == "done") {

                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
            }
        },
        error: function (data) {
            var x = document.getElementById("snackbarError");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 2000);
        }
    });
}

function updateSlide(idSlide) {
    let numberClass = $("#numberClass" + idSlide).val();
    let title = $("#title" + idSlide).val();
    let nomOffre = $("#nomOffre" + idSlide).val();
    $.ajax({
        type: 'POST',
        url: '/updateSlide',
        data: JSON.stringify({
            idSlide: idSlide,
            numberClass: numberClass,
            title: title,
            nomOffre: nomOffre,
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data == "done") {
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                setTimeout(function () {
                    window.location.reload();
                }, 2000)
            }
        },
        error: function (data) {
            var x = document.getElementById("snackbarError");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 2000);
        }
    });
}
