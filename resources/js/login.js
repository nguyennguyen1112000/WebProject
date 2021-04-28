

$("form").submit(function (e) {
   e.preventDefault()
   var url = $(this).attr("action");
   console.log(url)
   var request_method = $(this).attr("method");
   console.log(request_method)
   frmData = $(this).serialize()
   console.log(frmData)
   $.ajax({
       type: request_method,
       url: url,
       data: frmData,
       success: function (data) {
           err=data.err
           if(err==1) $('#LoiDangNhap').text('Mật khẩu không chính xác')
           else if(err==0) $('#LoiDangNhap').text('Tên đăng nhập không chính xác')
           else $('body').html(data)
          // $('#LoiDangNhap').text(data)
          
       }
   });

})

