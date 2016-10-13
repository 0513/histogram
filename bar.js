/**
 较全的配置：
  {
    id: "abc",
    width: 100,
    height: 100,
    type: "bar",
    avg:{
        value:5,
        name: "BL"
    },
    data:{
        values:[5, 10, 2, 12, 14],
        names:["AAA", "BBB", "CCC", "DDD", "EEE"]
    },
    color:{
        bg:"#fff",
        bar:"#aaa",
        avg: "#FCFCFC",
        border: "#aaa",
        text : "#000"
    }
  }
 * @param config
 *      id: canvas id
 *      width 宽度，单位px，默认填充父窗口
 *      height 高度，单位px，默认等于宽度
 *      type：bar 横向（默认），TODO 纵向
 *      avg: 平均值（比较值）， 可空
 *          value: 平均值
 *          name:显示名称
 *      data: 数据
 *          values: 数值
 *          names: 对应名称
 *      color: 颜色
 *          bg: 背景色 默认#fff
 *          bar: 柱状颜色 默认#aaa
 *          avg: 平均值 默认#FCFCFC
 *          border: 边框 默认 bar的颜色
 *          text: 字体 默认黑色
 *
 */
var bar = function(config){
    this.config = config || {};
    this.init();
    this.drawBg();
    this.drawBorder();
    this.drawLabel();
    this.drawBar();
    if(this.config.avg){
        this.drawAvg();
    }
}

bar.prototype = {
    init:function(){
        var node = document.getElementById(this.config.id);
        if(node.tagName == "canvas"){
            this.canvas = node;
        }else{
            this.canvas = document.createElement('canvas');
            node.appendChild(this.canvas);
        }
        this.g = this.canvas.getContext("2d");
        this.parent = this.canvas.parentNode;
        //设置默认宽高
        this.config.width = this.config.width || this.parent.offsetWidth;
        this.config.height = this.config.height || this.config.width;
        this.canvas.width=this.config.width;
        this.canvas.height=this.config.height;
        //设置默认颜色
        this.config.color = this.config.color || {};
        this.config.color.bg = this.config.color.bg || "#fff";
        this.config.color.bar = this.config.color.bar || "#aaa";
        this.config.color.avg = this.config.color.avg || "#FCFCFC";
        this.config.color.border = this.config.color.border || this.config.color.bar;
        this.config.color.text = this.config.color.text || "#000";
        //设置默认类型，这里只支持bar
        this.config.type = this.config.type || "bar";
        //计算字体大小  文字所占空间
        this.fontSize = this.config.height * 0.92 / 2.0 / this.config.data.values.length; //*0.9：下部分还要留出游标的位置  /2.0：间行，每个数据占两行高度
        this.maxSize = 0;
        for(var i in this.config.data.values){
            var size = this.config.data.names[i].length;
            if(size > this.maxSize){
                this.maxSize = size;
            }
        }
    },
    /**
     * 填充背景
     */
    drawBg:function(){
        this.g.fillStyle = this.config.color.bg;
        this.g.fillRect(0,0,this.config.width,this.config.height);
    },
    /**
     * 画边框，只有上边一条，左边一条
     */
    drawBorder:function(){
        this.g.moveTo(this.config.width, 0.5);
        this.g.lineTo(this.maxSize * this.fontSize  * 0.8 + 3, 0.5); // *0.8：字体占每行的80%高度
        this.g.lineTo(this.maxSize * this.fontSize  * 0.8 + 3, this.config.height);
        this.g.lineWidth=1;
        this.g.strokeStyle = this.config.color.border;
        this.g.stroke();
    },
    /**
     * 文字
     */
    drawLabel:function(){
        this.g.font = "normal "+(this.fontSize*0.8)+"px MicroSoft Yahei"; //字体占每行的80%高度
        this.g.fillStyle = this.config.color.text;
        for(var i in this.config.data.names){
            var name = this.config.data.names[i];
            var top = this.fontSize * (parseInt(i)*2 + 0.5 + 1 + 0.1); // *2：间行，+0.5：每行上下各留半行，+1：默认底部对齐，+0.1：字体占80%高度，上部留20%/2
            var left = this.fontSize * 0.8 * (this.maxSize - name.length); //TODO 这里目前只考虑汉字的情况
            this.g.fillText(name, left, top);
        }
    },
    /**
     * 柱形图，包括数值，平均值
     */
    drawBar:function(){
        var left = this.maxSize * this.fontSize  * 0.8 + 3;
        //计算最大宽度
        var max = 0; //最大值，其他以此*百分比
        for(var i in this.config.data.values){
            var value = this.config.data.values[i];
            if(value > max){
                max = value;
            }
        }
        var maxWidth = (this.config.width - left) * 0.9;
        for(var i in this.config.data.values){
            var value = this.config.data.values[i];
            var top = this.fontSize * (parseInt(i)*2 + 0.5 + 0.4); // *2：间行，+0.5：每行上下各留半行，+1：默认底部对齐
            var width = maxWidth * (value / max);
            this.g.fillStyle = this.config.color.bar;
            this.g.fillRect(left,top,width,this.fontSize);
            this.g.fillStyle = this.config.color.text;
            var textTop = this.fontSize * (parseInt(i)*2 + 0.5 + 1 + 0.1); // *2：间行，+0.5：每行上下各留半行，+1：默认底部对齐，+0.1：字体占80%高度，上部留20%/2
            this.g.fillText(value, left + width + 3, textTop);
        }

        //计算平均值所处位置
        this.avgPosition = left + maxWidth * (this.config.avg.value / max);
    },
    /**
     * 画平均值
     */
    drawAvg :function(){
        //划线
        this.g.beginPath();
        this.g.moveTo(this.avgPosition, 2.5);
        this.g.lineTo(this.avgPosition, this.config.height*0.95);
        this.g.lineWidth=2;
        this.g.strokeStyle = this.config.color.avg;
        this.g.stroke();
        //画三角
        this.g.beginPath();
        var y = this.config.height * 0.92;
        var size = this.fontSize;
        this.g.moveTo(this.avgPosition, y);
        this.g.lineTo(this.avgPosition - size*0.5, y + size);
        this.g.lineTo(this.avgPosition + size*0.5, y + size);
        this.g.fillStyle = this.config.color.avg;
        this.g.closePath();
        this.g.fill();
        //三角中的文字
        this.g.font = "normal "+(this.fontSize*0.4)+"px MicroSoft Yahei";
        this.g.fillStyle = "#fff";
        this.g.fillText(this.config.avg.name, this.avgPosition - this.fontSize * 0.3, this.config.height*0.92 + this.fontSize * 0.8);
    }
}