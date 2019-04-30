(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        times:[],
        lyrics:[],
        index:-1,
        init:function(path){
            this.$path = path;
        },
        loadLyric:function(callBack){
            var $this = this;
            //加载歌词
            $.ajax({
                url:$this.$path,
                dataType:"text",
                success:function(data){
                    //解析歌词
                    $this.parseLyric(data);
                    callBack();
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        parseLyric:function(data){
            var $this = this;
            //清空上一首歌词信息
            this.times = [];
            this.lyrics = [];
            var array = data.split("\n");
            var regExp = /\d*:\d*\.\d*/;
            $.each(array, function(index, ele){
                var timeStr = regExp.exec(ele);//00:00.00
                var lyricStr = ele.split("]")[1];
                //过滤没有时间的字符串
                if(!timeStr) return;
                //过滤字符串为空的时间
                if(lyricStr.length === 1) return;
                var time = timeStr[0];
                var min = parseInt(time.split(":")[0]);
                var sec = parseFloat(time.split(":")[1]);
                var lyricTime = parseFloat((min * 60 + sec).toFixed(2));
                $this.times.push(lyricTime);
                $this.lyrics.push(lyricStr);
            });
        },
        synLyrics:function(currentTime){
            //获得当前播放时间对应得歌词索引
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index;
        }
    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);