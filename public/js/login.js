





let content = "";

$('#submitInfo').on('click', (e) => {
    e.preventDefault();
    content = $('#loginArea').serialize();
})

