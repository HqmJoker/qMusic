$(function(){
    //0.修改歌曲滚动条样式
    $(".content_list").mCustomScrollbar();

    var $audio = $(".audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    //1.加载歌曲列表
    getMusicList();
    function getMusicList(){
        $.ajax({
            url:"./source/musiclist.json",
            dataType:"json",
            success:function(data){
                player.musiclist = data;
                //3.1遍历获取到的数据创建歌曲列表
                var $musiclist = $(".content_list ul");
                $.each(data, function(index, ele){
                    var $item = createMusicItem(index, ele);
                    $musiclist.append($item);
                });
                initMessageInfo(data[0]);
                initLyricInfo(data[0].link_lrc);
            },
            error:function(e){
                console.log(e);
            }
        });
    }

    //2.初始化歌曲信息
    function initMessageInfo(music){
        var $musicPic = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");

        $musicPic.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.singer + " - " + music.name);
        $musicProgressTime.text("00:00 / " + music.time);
        $musicBg.css("background", "url('"+ music.cover +"')");
    }

    //3.初始化歌词信息
    function initLyricInfo(path){
        var $musicLyric = $(".song_info_lyric");
        //清空上一首歌词内容
        $musicLyric.html("");
        lyric = new Lyric(path);
        lyric.loadLyric(function(){
            //创建歌词列表
            $.each(lyric.lyrics, function(index, ele){
                var lyricsItem = $("<li>"+ ele +"</li>");
                $musicLyric.append(lyricsItem);
            })
        });

    }
    //3.初始化进度条
    initProgress();
    function initProgress(){
        //修改播放进度条
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = new Progress($progressBar, $progressLine, $progressDot);
        progress.progressClick(function(value){
            player.changeMusicProgress(value);
        });
        progress.progressDrag(function(value){
            player.changeMusicProgress(value);
        });
        //修改声音进度条
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = new Progress($voiceBar, $voiceLine, $voiceDot);
        voiceProgress.progressClick(function(value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressDrag(function(value){
            player.musicVoiceSeekTo(value);
        });
    }

    //4.初始化绑定事件
    initEvents();
    function initEvents(){
        //4.1监听歌曲移入移出事件
        $(".content_list").on("mouseenter", ".list_music", function(){
            //显示子菜单
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").on("mouseleave", ".list_music", function(){
            //隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            //显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });
        //4.2监听复选框点击事件
        $(".content_list").on("click", ".list_check", function(){
            $(this).toggleClass("list_checked");
        });
        //4.3添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").on("click", ".list_menu_play", function(){
            var $list_music_item =  $(this).parents(".list_music");
            //4.3.1切换播放的图标
            $(this).toggleClass("list_menu_play2");
            //4.3.2复原其它的播放图标
            $list_music_item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //4.3.3同步底部播放按钮
            if($(this).attr("class").indexOf("list_menu_play2") !== -1){
                //当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                //让文字高亮
                $list_music_item.find("div").css("color","#fff");
                $list_music_item.siblings().find("div").css("color","rgba(255,255,255,0.5)");
            }else{
                //当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                //让文字不高亮
                $list_music_item.find("div").css("color","rgba(255,255,255,0.5)");
            }
            //4.3.4切换播放状态
            $list_music_item.find(".list_number").toggleClass("list_number2");
            $list_music_item.siblings().find(".list_number").removeClass("list_number2");
            //4.3.5播放音乐
            player.playMusic($list_music_item.get(0).index, $list_music_item.get(0).music);
            //4.3.6同步音乐信息
            initMessageInfo($list_music_item.get(0).music);
            //4.3.7同步歌词信息
            initLyricInfo($list_music_item.get(0).music.link_lrc);
        });
        //4.4底部控制区播放按钮
        $musicPlay.click(function(){
            if(player.curIndex === -1){
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                $(".list_music").eq(player.curIndex).find(".list_menu_play").trigger("click");
            }
        });
        //4.5底部控制区上一首按钮
        $(".music_prev").click(function(){
            $(".list_music").eq(player.preMusic()).find(".list_menu_play").trigger("click");
        });
        //4.6底部控制区下一首按钮
        $(".music_next").click(function(){
            $(".list_music").eq(player.nextMusic()).find(".list_menu_play").trigger("click");
        });
        //4.7监听删除音乐点击事件
        $(".content_list").on("click", ".list_menu_del", function(){
            var $item = $(this).parents(".list_music");

            //判断要删除的音乐是否当前正在播放
            if(player.curIndex === $item.get(0).index){
                $(".music_next").trigger("click");
            }

            //删除音乐
            $item.remove();
            player.delMusic($item.get(0).index);

            //重新排序
            $(".list_music").each(function(index, ele){
                $(ele).find(".list_number").text(index+1);
                $(ele).get(0).index = index;
            });
        });
        //4.8监听歌曲播放进度
        player.getMusicTime(function(currentTime, durationTime, timeStr){
            //同步歌曲时间
            $(".music_progress_time").text(timeStr);
            //同步歌曲进度条
            var value = currentTime / durationTime * 100;
            progress.progressUpDate(value);
            //同步歌词
            var index = lyric.synLyrics(currentTime);
            $(".song_info_lyric li").eq(index).addClass("cur").siblings().removeClass("cur");
            if(index > 2) {
                $(".song_info_lyric").css({
                    marginTop: (- index + 2) * 30
                });
            }
            //当歌曲播放完毕自己播放下一首
            if(player.audio.ended){
                $(".music_next").trigger("click");
            }
        });
        //4.9监听声音按钮点击时间
        $(".music_voice_icon").click(function(){
            $(this).toggleClass("music_voice_icon2");
            if(this.className.indexOf("music_voice_icon2") !== -1){
                //变成没有声音
                player.musicVoiceSeekTo(0);
            }else{
                //变成有声音
                player.musicVoiceSeekTo(1);
            }
        });
    }

    //定义一个方法创建一条音乐
    function createMusicItem(index, music){
        var $item = $("                    <li class=\"list_music\">\n" +
            "                        <div class=\"list_check\"><i></i></div>\n" +
            "                        <div class=\"list_number\">"+(index+1)+"</div>\n" +
            "                        <div class=\"list_name\">"+music.name+"" +
            "                            <div class=\"list_menu\">\n" +
            "                                <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "                                <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"list_singer\">"+music.singer+"</div>\n" +
            "                        <div class=\"list_time\">\n" +
            "                            <span>"+music.time+"</span>\n" +
            "                            <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "                        </div>\n" +
            "                    </li>\n");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

});