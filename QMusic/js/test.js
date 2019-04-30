$.ajax({
    url:"head.html",
    type:"get",
    success:function(header){
        $(header).replaceAll("header");
        $("<link rel='stylesheet' href='css/head.css'/>").appendTo("header");
        $.ajax({
            url:"http://127.0.0.1:3000/show",
            type:"get",
            data:{uid:$.cookie("uid")},
            datatype:"json",
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