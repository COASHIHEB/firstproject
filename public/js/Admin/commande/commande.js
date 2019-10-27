$(document).ready(function () {

    $('#tableau2').DataTable({
        responsive: true,
        "lengthMenu": [10, 25, 50, 75, 100],
    });

    $('#tableau1').DataTable({
        responsive: true,
        "lengthMenu": [10, 25, 50, 75, 100],
    });
});