let content = "";

$('#submitInfo').on('click', (e) => {
    e.preventDefault();
    content = $('#loginArea').serialize();
    $.post('http://127.0.0.1/login/submit', content, function (res) {
        if (res.status !== 200) {
            alert('登陆失败! ' + res.messsage);
        } else {
            // localStorage.setItem('token', res.token);
            window.location.replace('http://127.0.0.1/');
        }
    })
})

