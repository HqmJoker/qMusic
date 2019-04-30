//音频插件
(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor : Player,
        musiclist:[],
        curIndex:-1,
        init:function($audio){
            this.$audio = $audio;//jQuery对象
            this.audio = $audio.get(0);//原生对象
        },
        playMusic:function(index, music){
            //判断是否为同一首音乐
            if(this.curIndex === index){
                //同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                //不同音乐
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.curIndex = index;
            }
        },
        preMusic:function(){
            var index = this.curIndex - 1;
            if(index < 0){
                index = this.musiclist.length - 1;
            }
            return index;
        },
        nextMusic:function(){
            var index = this.curIndex + 1;
            if(index > this.musiclist.length - 1){
                index = 0;
            }
            return index;
        },
        delMusic:function(index){
            //判断删除的音乐是否在播放音乐的前面
            if(this.curIndex >= index){
                this.curIndex--;
            }
            this.musiclist.splice(index, 1);
        },
        getMusicTime:function(callBack){
            var $this = this;
            this.$audio.on("timeupdate", function(){
                var currentTime = $this.audio.currentTime;
                var durationTime = $this.audio.duration;
                var timeStr = $this.setMusicData(currentTime, durationTime);
                return callBack(currentTime, durationTime, timeStr);
            });
        },
        setMusicData:function(currentTime, durationTime){
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            var endMin = parseInt(durationTime / 60);
            var endSec = parseInt(durationTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }
            return startMin+":"+startSec+" / "+endMin+":"+endSec;
        },
        changeMusicProgress:function(value){
            //过滤不合法数据
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            if(!this.audio.currentTime) return;

            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function(value){
            //过滤不合法数据
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            if(!this.audio.currentTime) return;

            this.audio.volume = value;
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);