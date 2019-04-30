$.ajax({
    url:"foot.html",
    type:"get",
    success:function(foot){
        $(foot).replaceAll("footer");
        $("<link rel='stylesheet' href='css/foot.css'/>").appendTo("head");
    },
    error:function(){
        console.log("Ajax请求foot.html出错!");
    }
});