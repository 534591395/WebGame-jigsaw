/**
 * Created by wangyang7 on 2014/11/13.
 */

// *  说明： 拼图游戏 *

// 配置信息
var CONFIG = window.CONFIG = {
    WIDTH:640,
    HEIGHT:400,
    CHOICE:{
        'easy': 3,
        'normal':4,
        'hard':5
    },
    TIME:6000,
    AUTHOR:'白云飘飘',
    VERSION:'0.0.1',
    IMG:'',
    RIGHT:[],
    LEVEL:3,
    RANKS:[],
    NOWNUMBER:[],
    WINRANK:[],
    HASSTEP:{},
    emptyLoc:{},
    solved:false,
    clickLoc:{},
    RIGHTRANK:[],
    CHECK:''
};


//选择难度
CONFIG.LEVEL = CONFIG.CHOICE.normal;
//CONFIG.LEVEL=2

//获取图片
CONFIG.IMG = (function(){
    document.getElementById('imgesInput').addEventListener('change',readFile,false);

    function readFile(){
        if( typeof FileReader !=='undefined' ){
            var file = this.files[0],
                imgBox = document.getElementById('imgBox');
            if( !/image/.test(file.type) ){
                alert('请选择图片');
                return false;
            }
            //获取本地文件
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(){
                img = new Image();
                img.src = this.result;


                //canvas处理 选择的图片问题
                var handleImg = document.getElementById('handleImg'),
                    ctx = handleImg.getContext('2d');
                ctx.drawImage(img,0,0,img.width,img.height,0,0,480,300);

                var ctxImgURL = handleImg.toDataURL();

                var ctxImg = new Image();
                ctxImg.src = ctxImgURL;
                document.getElementById('demo').src=ctxImgURL;


                imgBox.innerHTML = '';
                document.getElementById('layer').innerHTML = '';
                document.getElementById('game').innerHTML = '';
                CONFIG.RIGHTRANK.length = 0;
                CONFIG.NOWNUMBER.length = 0;



                imgBox.appendChild(ctxImg);

                var testImg = new Image();
                testImg.src='images/car.jpg';
                testImg.onload = function(){
                    //
                };

            };
        }else{
            alert('浏览器不支持 本地文件读取！');
        }

    }

})();


//生成 拼图
var hard = (function(){
    document.getElementById('imgBox').addEventListener('DOMNodeInserted',changeHtml,false);

    function changeHtml(){
        setHtml.call(this);
    }

    function setHtml(){
        var image = this.firstChild,
            boxWidth = document.getElementById('content').offsetWidth,
            equalWidth = parseInt(boxWidth/CONFIG.LEVEL),
            gameBox = document.getElementById('game'),
            total = CONFIG.LEVEL * CONFIG.LEVEL- 1,
            width = parseInt( image.width /CONFIG.LEVEL,10),
            height =  parseInt(image.height/CONFIG.LEVEL,10);
        gameBox.innerHTML = '';


        var i=0;
        for( var k=0; k<CONFIG.LEVEL; k++ ){
            for(var j=0; j<CONFIG.LEVEL; j++){
                var rank = document.createElement('li');
                rank.className='rank';
                rank.style.backgroundImage = 'url('+image.getAttribute('src')+') ';

                rank.style.width = width+'px';
                rank.style.height = height+'px';

                var position = (-j*width)+'px '+(-k*height) +'px';
                rank.style.backgroundPosition =  position;

                if( k==(CONFIG.LEVEL-1) && j==(CONFIG.LEVEL-1) )continue;
                i++;
                rank.rankNumber = i;
                rank.rightPoint = {x:k,y:j};
                CONFIG.CHECK += i;

                gameBox.appendChild(rank);
                CONFIG.RIGHTRANK.push(rank);
            }
        }

        var emptyLi = document.createElement('li');
        emptyLi.className = 'rank empty';
        emptyLi.id = 'empty';
        emptyLi.style.width = width+'px';
        emptyLi.style.height = height+'px';

        emptyLi.rankNumber = 0;
        CONFIG.CHECK += 0;

        emptyLi.NowPoint = {x:CONFIG.LEVEL-1,y:CONFIG.LEVEL-1};

        gameBox.appendChild(emptyLi);
        CONFIG.RIGHTRANK.push(emptyLi);
    }

})();

//打乱拼图
var disrupted =(function(){

    var layer = document.getElementById('layer');
    document.getElementById('imgBox').addEventListener('DOMNodeInserted',disruptedHtml,false);

    function disruptedHtml(){
        var disruptedNum = [],
            nowArray = CONFIG.RIGHTRANK,
            emptyRank = nowArray[ CONFIG.LEVEL*CONFIG.LEVEL -1],
            jj = [];

        nowArray.splice(CONFIG.LEVEL*CONFIG.LEVEL-1,1);

        for( var k=0;k< nowArray.length;k++ ){
            disruptedNum.push(k);
        }


        var setTimeId = setInterval(function(){
            if( disruptedNum = hasResult(nowArray.length) ){
                clearInterval(setTimeId);
                window.console && console.log(disruptedNum);


                for( var i=0; i< nowArray.length;i++){
                    CONFIG.NOWNUMBER[i] = nowArray[disruptedNum[i]];
                }

                for(var i=0; i<CONFIG.LEVEL;i++){
                    for( var j=0; j<CONFIG.LEVEL;j++ ){
                        if( i== CONFIG.LEVEL-1 && j== CONFIG.LEVEL-1) continue;
                        var kk = {x:i,y:j};
                        jj.push(kk);
                    }
                }

                for( var n=0; n<CONFIG.NOWNUMBER.length;n++ ){
                    CONFIG.NOWNUMBER[n].NowPoint = jj[n];
                }


                CONFIG.NOWNUMBER.push(emptyRank);

                for( var h=0;h< CONFIG.NOWNUMBER.length;h++){
                    layer.appendChild(CONFIG.NOWNUMBER[h]);
                }


            }
        },100);

    }

    //返回有解的序列  f(s) 前面数字比s小有多少个
    function hasResult(length){
        var disruptedNum =[],
            odd_even = '',
            num = 0,
            newNUm = 0;
        for( var k=0;k< length;k++ ){
            disruptedNum.push(k);
        }

        for( var j=0; j< disruptedNum.length; j++   ){
            for( var h=j+1;h<disruptedNum.length;h++){
                disruptedNum[h] > disruptedNum[j] && num++;
            }
        }
        odd_even = num%2 == 0 ?'odd' :'even';


        disruptedNum.sort(function(){return Math.random()>0.1});

        for( var j=0; j< disruptedNum.length; j++   ){
            for( var h=j+1;h<disruptedNum.length;h++){
                disruptedNum[h] > disruptedNum[j] && newNUm++;
            }
        }

        newNUm = newNUm%2 == 0?'odd' :'even';

        if( odd_even == newNUm ){
            return disruptedNum;
        }else{
            return false;
        }

        return true;

    }

})();



//移动图片
// 1：先判断该图块能不能移动
// 2: 1通过的话， 两者交换，重新渲染
var moves = (function(){
    var oUl = document.getElementById('layer');
    oUl.onclick = function(ev){
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement,
            width = target.style.width,
            height = target.style.height;
        if(target.nodeName.toLowerCase() == "li"){
            var empty = findObj(0),
                bool;
            bool = distance( empty.NowPoint.x, empty.NowPoint.y, target.NowPoint.x, target.NowPoint.y );
            if( bool == 1 ){
                swapping(target,empty );
                drawing();
                if( check() ){
                    alert('通关了');
                }
            }
        }
    };


    function findObj(rankNumber){
        var dom;
        for( var i=0;i<CONFIG.NOWNUMBER.length;i++ ){
            if( CONFIG.NOWNUMBER[i].rankNumber ==  rankNumber){
                dom = CONFIG.NOWNUMBER[i];
            }
        }
        return dom;
    }


    function subscript(target){
        for( var i=0;i<CONFIG.NOWNUMBER.length;i++ ){
            if(CONFIG.NOWNUMBER[i].rankNumber == target.rankNumber ){
                return i;
            }
        }
    }

    function swapping(target1,target2){
        var i1 = subscript(target1),
            i2 = subscript(target2),
            NowPoint1 = target1.NowPoint,
            NowPoint2 = target2.NowPoint;
        target1.NowPoint = NowPoint2;
        target2.NowPoint = NowPoint1;
        CONFIG.NOWNUMBER[i1] = target2;
        CONFIG.NOWNUMBER[i2] = target1;
    }

    function distance(x1, y1, x2, y2) {
        return Math.abs(x1 -
            x2) + Math.abs(y1 - y2);
    }

    function drawing(){
        var layer = document.getElementById('layer');
        for( var h=0;h< CONFIG.NOWNUMBER.length;h++){
            layer.appendChild(CONFIG.NOWNUMBER[h]);
        }
    }

    function check(){
        var string = '';
        for( var i=0;i<CONFIG.NOWNUMBER.length;i++ ){
            string += CONFIG.NOWNUMBER[i].rankNumber;
        }
        var reg = new RegExp("^"+ CONFIG.CHECK+"");
        CONFIG.solved = reg.test(string);
        return CONFIG.solved;
    }



})();





// 工具函数





