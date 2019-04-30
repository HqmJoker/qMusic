(function(window){
    function Progress($progressBar, $progressLine, $progressDot){
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        isMove:false,
        init:function($progressBar, $progressLine, $progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressClick:function(callBack){
            var $this = this;
            //监听背景点击
            this.$progressBar.click(function(e){
                //获取进度条离屏幕左边距离
                var progressPosition = $(this).offset().left;
                //获取点击位置离屏幕左边距离
                var clickPosition = e.pageX;
                //设置前景宽度
                $this.$progressLine.css("width", clickPosition - progressPosition);
                $this.$progressDot.css("left", clickPosition - progressPosition);
                //同步歌曲信息
                var value = (clickPosition - progressPosition) / $(this).width();
                callBack(value);
            });
        },
        progressDrag:function(callBack){
            var $this = this;
            //获取进度条离屏幕左边距离
            var progressPosition = this.$progressBar.offset().left;
            //获取点击位置离屏幕左边距离
            var clickPosition;
            //获取当前进度条长度
            var lineWidth;
            //1.监听鼠标按下事件
            this.$progressBar.mousedown(function(){
                //2.监听鼠标移动事件
                $(document).mousemove(function(e){
                    $this.isMove = true;
                    clickPosition = e.pageX;
                    //获取当前进度条长度
                    lineWidth = clickPosition - progressPosition;
                    if(lineWidth >= 0 && lineWidth <= $this.$progressBar.width()){
                        //设置前景宽度
                        $this.$progressLine.css("width", lineWidth);
                        $this.$progressDot.css("left", lineWidth);
                    }
                });
            });
            //3.监听鼠标抬起事件
            $(document).mouseup(function(e){
                $(document).off("mousemove");
                $this.isMove = false;
                //获取点击位置离屏幕左边距离
                clickPosition = e.pageX;
                //同步歌曲信息
                var value = (clickPosition - progressPosition) / $this.$progressBar.width();
                callBack(value);
            });
        },
        progressUpDate:function(value){
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width:value + "%"
            });
            this.$progressDot.css({
                left:value + "%"
            });
        }
    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);