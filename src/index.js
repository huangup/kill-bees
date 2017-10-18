window.onload = function () {
    var oBtn = document.getElementById("gameBtn");
    oBtn.onclick = function () {
        this.style.display = 'none';
        document.getElementById('gameAuthor').style.display = 'none';
        document.getElementById('gameName').style.display = 'none';
        Game.init('div1'); // 游戏初始化
    };
};

var Game = {

    oEnemy: { // 敌人的数据
        e1: {style: 'enemy1', blood: 1, speed: 3, score: 1},
        e2: {style: 'enemy2', blood: 2, speed: 4, score: 2},
        e3: {style: 'enemy3', blood: 3, speed: 4, score: 3}
    },

    gk: [ // 关卡的数据
        { // 第一关
            eMap: [
                'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2',
                'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2',
                'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1'
            ],
            colNum: 10,
            iSpeedX: 10,
            iSpeedY: 10,
            times: 2000 // 蜜蜂飞下来的时间间隔
        },
        { // 第二关
            eMap: [
                'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3',
                'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3',
                'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1',
                'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1'
            ],
            colNum: 10,
            iSpeedX: 10,
            iSpeedY: 10,
            times: 2000
        }
    ],

    air: { // 飞机的数据
        style: 'air1', // 飞机样式
        bulletStyle: 'bullet', // 子弹样式
        blood: 5 // 飞机血量
    },

    init: function (id) {
        this.oParent = document.getElementById(id);
        this.createScore(); // 创建积分
        this.createBlood(); // 创建血量
        this.createEnemy(0); // 创建敌人
        this.createAir(); // 创建飞机
    },

    createBlood: function () {
        var oB = document.createElement('div');
        oB.id = 'blood';
        oB.innerHTML = '血量：<span>' + this.air.blood + '</span>';
        this.oParent.appendChild(oB);
        this.oBloodNum = oB.getElementsByTagName('span')[0];
    },

    createScore: function () {
        var oS = document.createElement('div');
        oS.id = 'score';
        oS.innerHTML = '积分：<span>0</span>';
        this.oParent.appendChild(oS);
        this.oSNum = oS.getElementsByTagName('span')[0];
    },

    createEnemy: function (iNow) {
        if (this.oUl) {
            clearInterval(this.oUl.timer); // 清除敌人整体移动的定时器
            this.oParent.removeChild(this.oUl);
        }

        document.title = '第' + (iNow + 1) + '关';

        var gk = this.gk[iNow]; // 得到关卡
        var arr = []; // 用来存储ul li蜜蜂的top、left值
        var oUl = document.createElement('ul');
        oUl.id = 'bee';
        oUl.style.width = gk.colNum * 40 + 'px';
        this.oParent.appendChild(oUl);
        oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth) / 2 + 'px';

        this.oUl = oUl; // 全局保存蜜蜂整体

        for (var i = 0; i < gk.eMap.length; i++) { // 创建li小蜜蜂
            var oLi = document.createElement('li');
            oLi.className = this.oEnemy[gk.eMap[i]].style;

            oLi.blood = this.oEnemy[gk.eMap[i]].blood;
            oLi.speed = this.oEnemy[gk.eMap[i]].speed;
            oLi.score = this.oEnemy[gk.eMap[i]].score;

            oUl.appendChild(oLi);//每个蜜蜂填到ul中
        }
        this.aLi = oUl.getElementsByTagName('li'); // 将所有li小蜜蜂设置为全局的

        for (var i = 0; i < this.aLi.length; i++) {
            arr.push([this.aLi[i].offsetLeft, this.aLi[i].offsetTop]); // arr[][]
        }

        //每个蜜蜂转定位
        for (var i = 0; i < this.aLi.length; i++) {
            //创建蜜蜂存好每个蜜蜂的left、top值后再用JS把ul li蜜蜂原来的浮动改为绝对定位，这样避免了:子弹碰到一个蜜蜂，该蜜蜂消失，而该蜜蜂的相邻蜜蜂因为浮动而来补位又和子弹碰撞，又消失
            this.aLi[i].style.position = 'absolute';
            this.aLi[i].style.left = arr[i][0] + 'px';
            this.aLi[i].style.top = arr[i][1] + 'px';
        }

        this.runEnemy(gk); // 敌人整体移动,创建好敌人后就触发
    },

    runEnemy: function (gk) {

        var This = this;

        var L = 0;
        var R = this.oParent.offsetWidth - this.oUl.offsetWidth; // 父层的宽减去ul(敌人整体)的宽就是ul能到达的最大值

        this.oUl.timer = setInterval(function () { // 保存定时器，通关后销毁

            if (This.oUl.offsetLeft > R) {
                gk.iSpeedX *= -1; // 反向移动
                This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
            } else if (This.oUl.offsetLeft < L) {
                gk.iSpeedX *= -1;
                This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
            }

            This.oUl.style.left = This.oUl.offsetLeft + gk.iSpeedX + 'px'; // 移动速度
        }, 200);

        setInterval(function () {
            This.oneMove();
        }, gk.times); // 每隔一段时间就有一个蜜蜂移动
    },

    oneMove: function () {//单兵作战:一个小蜜蜂移动
        var nowLi = this.aLi[Math.floor(Math.random() * this.aLi.length - 1)]; // 范围内随机数取整用来做当前小蜜蜂的脚标
        var This = this;

        nowLi.timer = setInterval(function () { // 小蜜蜂被删掉了但是此定时器还在就会出问题，所以这里赋给timer，在子弹删掉蜜蜂前可清除此定时器
            var a = (This.oA.offsetLeft + This.oA.offsetWidth / 2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + This.oA.offsetWidth / 2); // 蜜蜂和飞机中心点的水平距离
            var b = (This.oA.offsetTop + This.oA.offsetHeight / 2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + This.oA.offsetHeight / 2); // 蜜蜂和飞机中心点的垂直距离
            var c = Math.sqrt(a * a + b * b);//这是实际距离

            var iSX = nowLi.speed * a / c; // 蜜蜂向飞机靠近的水平速度
            var iSY = nowLi.speed * b / c; // 蜜蜂向飞机靠近的垂直速度

            nowLi.style.left = nowLi.offsetLeft + iSX + 'px';
            nowLi.style.top = nowLi.offsetTop + iSY + 'px';

            if (This.pz(This.oA, nowLi)) {
                var blood = This.air.blood;
                blood --;
                This.air.blood = blood;
                This.oBloodNum.innerHTML = blood;
                console.error('blood变为：', blood)
                clearInterval(nowLi.timer);
                This.oUl.removeChild(nowLi);
                if (blood == 0) {
                    alert('游戏结束');
                    window.location.reload();
                }
            }
        }, 30);
    },

    createAir: function () {
        var oA = document.createElement('div');
        oA.className = this.air.style;

        this.oA = oA;

        this.oParent.appendChild(oA);
        oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth) / 2 + 'px';
        oA.style.top = (this.oParent.offsetHeight - oA.offsetHeight) + 'px';
        this.bindAir();
    },

    bindAir: function () { // 操作飞机

        var timer = null;
        var iNum = 0;
        var This = this;

        document.onkeydown = function (ev) { // 按下按键时的处理
            var ev = ev || window.event;

            if (!timer) { // 为了定时器保持只有一份，不会有累加效果
                timer = setInterval(show, 30); // 保存飞机左右移动的定时器，方便销毁
            }

            if (ev.keyCode == 37) { // 左键
                iNum = 1;
            } else if (ev.keyCode == 39) { // 右键
                iNum = 2;
            }
        };

        document.onkeyup = function (ev) { // 松开按键后的处理
            var ev = ev || window.event;
            if (ev.keyCode == 37 || ev.keyCode == 39) { // 若松开左右键则取消对应的移动功能
                clearInterval(timer);
                timer = null;
                iNum = 0;
            }
            if (ev.keyCode == 32) { // 空格
                This.createBullet(); // 创建子弹
            }
        }

        function show() {
            if (iNum == 1) {
                if (This.oA.style.left == -3 + 'px') { // 防止飞机移出游戏窗
                    return false;
                } else {
                    This.oA.style.left = This.oA.offsetLeft - 10 + 'px';
                }
            } else if (iNum == 2) {
                if (This.oA.style.left == 757 + 'px') { // 防止飞机移出游戏窗
                    return false;
                } else {
                    This.oA.style.left = This.oA.offsetLeft + 10 + 'px';
                }
            }
        }
    },

    createBullet: function () {
        // 子弹的left值=飞机的left值+飞机本身宽度的一半
        // 子弹的top值=飞机的top值-子弹本身的高度
        var oB = document.createElement('div');
        oB.className = this.air.bulletStyle;
        this.oParent.appendChild(oB);
        oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth / 2 + 'px';
        oB.style.top = this.oA.offsetTop - 10 + 'px';
        this.runBullet(oB); // 子弹运动
    },

    runBullet: function (oB) {
        var This = this;

        oB.timer = setInterval(function () {

            if (oB.offsetTop < -10) { // 子弹飞出游戏窗就销毁
                clearInterval(oB.timer);
                This.oParent.removeChild(oB);
            } else {
                oB.style.top = oB.offsetTop - 10 + 'px';
            }

            for (var i = 0; i < This.aLi.length; i++) {
                if (This.pz(oB, This.aLi[i])) { // 子弹和蜜蜂碰撞

                    // 蜜蜂的血量处理
                    if (This.aLi[i].blood == 1) {
                        clearInterval(This.aLi[i].timer); // 清除蜜蜂落下来的定时器
                        This.oSNum.innerHTML = parseInt(This.oSNum.innerHTML) + This.aLi[i].score;
                        This.oUl.removeChild(This.aLi[i]); // 删掉蜜蜂
                    } else {
                        This.aLi[i].blood--;
                    }

                    clearInterval(oB.timer); // 清除子弹定时器
                    This.oParent.removeChild(oB);//删掉碰撞的子弹
                }
            }

            if (!This.aLi.length) { // 如果敌人被打完，就进入下一关
                This.createEnemy(1);
            }

        }, 30);
    },

    pz: function (obj1, obj2) { // 封装好碰撞检测，可实现多对多碰撞检测
        var L1 = obj1.offsetLeft;
        var R1 = obj1.offsetLeft + obj1.offsetWidth;
        var T1 = obj1.offsetTop;
        var B1 = obj1.offsetTop + obj1.offsetHeight;

        // 因为小蜜蜂li是装在ul里面的，所以计算小蜜蜂的top、left值是相对于ul的，所以要加上ul的top、left值才算小蜜蜂的值
        var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
        var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
        var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
        var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;

        if (R1 < L2 || L1 > R2 || B1 < T2 || T1 > B2) {
            return false;
        } else {
            return true;
        }
    }
};