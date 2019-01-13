$(function() {

    // 获取图片验证码
    getImageCode();

    // 显示二维码
    setTimeout(function() {
        $('.qrCode').slideDown(500);
    }, 1000)
    // 跳出弹出框
    // $('.dobutton').on('click', function(e) {
    //     $('.showTip').fadeIn(500);
    //     $('.phoneCode input').focus();
    //     return false;
    // });
    // 关闭弹出框
    $('.icon-guanbi, .cancelBtn').on('click', function() {
        $('.showTip').slideUp(500);
        $('.phoneCode input').val('');
    })


    // 弹出框的拖拽
    $('.tipHeader').on('mousedown', function(e) {
        // 鼠标按下，鼠标在弹出框中的位置
        var x = e.pageX - $('.showTip').offset().left;
        var y = e.pageY - $('.showTip').offset().top;

        
        document.onmousemove = function(e) {
            //鼠标移动的时候， 弹出框的坐标
            var tipX = e.pageX - x;
            var tipY = e.pageY - y;

            // 弹出框的高  宽
            var tipHeight = $('.showTip').outerHeight();
            var tipWidth = $('.showTip').outerWidth();

            // 给弹出框重新赋值偏移量
            $('.showTip').css({'left': tipX + tipWidth/2 + 'px', 'top': tipY + tipHeight/2 + 'px'});
        }
    });
    

    document.onmouseup = function () {
        // 移除鼠标移动的事件
        document.onmousemove = null;
    }
});

// 获取node后端的图片验证码
function getImageCode() {
    $('.code').val('');
    $.ajax({
      type: 'get',
      url: '/get-img-verify',
      data: {
        size: 4, // 验证码长度
        width: 100,
        height: 40,
        background: '#f4f3f2', 
        noise: 2,  // 干扰线条数
        fontSize: 40,
        ignoreChars: '0o1i', // 验证码字符中排除 '0o1i'
        color: true
      },
      dataType: 'json'
    }).done(function(data) {
      // console.log(data)
      $('.convas').html(data.img);
      $('.convas').off('click').on('click', function() {
        getImageCode();
      });
      // 去除底部空隙
      $('.convas svg').css('display', 'block');
    })
  }