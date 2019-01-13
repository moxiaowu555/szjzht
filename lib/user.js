$(function() {
    // 发送登录请求
    $('.register-user').on('submit', function(e) {
        e.preventDefault();
        console.log('发送请求成功');
        $.ajax({
            type: 'post',
            url: '/login',
            data: $('.register-user').serialize(),
            dataType: 'json',
            success(result) {
                $('.error').html(result.msg);
                $('.error').slideDown(300);
                errorHide(); 
                
            }
        });
    });
});

// 错误提示框延迟消失效果
function errorHide() {
    setTimeout(() => {
        $('.error').slideUp(500);
    }, 500);
}