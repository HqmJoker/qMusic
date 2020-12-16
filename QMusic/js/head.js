$.ajax({
    url:"head.html",
    type:"get",
    success:function(header){
        $(header).replaceAll("header");
        $("<link rel='stylesheet' href='css/head.css'/>").appendTo("header");
        $('.change-theme').click(function(){
            let toggle_text = $(this).find('.toggle-text');
            if( toggle_text.text() === 'on') {
                $(this).removeClass('theme-activted');
                toggle_text.text('off');
                $("html").css({ "filter": "invert(0) hue-rotate(0deg)" });
                $("html").find('img').css({ "filter": "invert(0) hue-rotate(0deg)" });
                $("html").find('.logo').css({ "filter": "invert(0) hue-rotate(0deg)" });
            }else{
                $(this).addClass('theme-activted');
                toggle_text.text('on');
                $("html").css({ "transition": "all 300ms", "filter": "invert(1) hue-rotate(180deg)" });
                $("html").find('img').css({ "filter": "invert(1) hue-rotate(180deg)" });
                $(".logo").css({ "filter": "invert(0) hue-rotate(0deg)"});
            }
        });
        $.ajax({
            url:"http://127.0.0.1:3000/show",
            type:"get",
            datatype:"json",
            xhrFields:{withCredentials:true},
            success:function(result){
                if(result.code < 0){
                    alert("请先登录");
                }else{
                    var username = result.user_name;
                    $("#login").css("display","none");
                    $("#login").next("p").css("display","inline-block").text("用户："+username);
                    alert(username+" 欢迎回来！");
                }
            },
            error:function(){
                console.log("ajax请求出错!");
            }
        });
    },
    error:function(){
        console.log("ajax请求头文件出错");
    }
});