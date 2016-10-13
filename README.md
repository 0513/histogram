##说明
用canvas写的简单的柱状图demo，支持尺寸、颜色、列……的配置，目前只提供一种样式，如下：
![mahua](http://note.youdao.com/yws/public/resource/008f8407a1dffab4cff6ebfd2a9af920/xmlnote/DDE59EBD11E54A1283AC81369063C0F4/29948)
##基本用法
####html
```html
    <script src="bar.js"></script>
    <div id="histogram"><div>
```
####js
```javascript
    new bar({
        id: "histogram",
        avg:{
            value:5,
            name: "BL"
        },
        data:{
            values:[5, 10, 2, 12, 14, 10, 2, 12, 14],
            names:["速度", "力量", "智商","情商","健康","情绪", "反应", "互动", "好奇"]
        }
    });
```
##全部配置项
```javascript
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
        values:[5, 10, 2, 12, 14, 10, 2, 12, 14],
        names:["速度", "力量", "智商","情商","健康","情绪", "反应", "互动", "好奇"]
    },
    color:{
        bg:"#fff",
        bar:"#aaa",
        avg: "#FCFCFC",
        border: "#aaa",
        text : "#000"
    }
}
```
`详细说明参见bar.js内注释`