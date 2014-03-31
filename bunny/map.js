//初始化地图素材

var bunny = new Image();
var carrot = new Image();
var carrot2 = new Image();
var stuffs = new Image();

//载入图片素材
function loadPics() {
	bunny.src = "images/bunny.png";	
	carrot.src = "images/carrot.png";
	carrot2.src = "images/carrot2.png";
	stuffs.src = "images/stuffs.png";
}

//解析地图元素 所有乱起八糟的符号皆为自定义地图元素
function mapObject(x, y, key) {
	switch(key) {
		case '.':
			break;
		case 'O':
			drawRock(x*60, y*60);
			break;
		case '~':
			drawWater(x*60, y*60);
			break;
		case '<':
			drawBridge_1(x*60, y*60);
			break;
		case '=':
			drawBridge_2(x*60, y*60);
			break;
		case '>':
			drawBridge_3(x*60, y*60);
			break;
		case '^':
			drawBridge1(x*60, y*60);
			break;
		case '|':
			drawBridge2(x*60, y*60);
			break;
		case '+':
			drawBridge3(x*60, y*60);
			break;
		case '$':
			drawCarrot(x*60, y*60);
			break;
		case '#':
			drawCarrot2(x*60, y*60);
			break;
		default:
			console.log('Object is wrong!');
	}
}

//画兔子
function drawBunny() {
	//阴影
	context.fillStyle="rgba(0,0,0,0.4)";
	context.beginPath();
	context.arc(bx+20,by+47,12,0,Math.PI*2,true); //绘制游戏人物的阴影效果,画弧.
	//arc(x, y, radius, startAngle, endAngle, anticlockwise)
	context.closePath();
	context.fill();
	//兔子
	context.drawImage(bunny,sx[c[state][0]],sy[c[state][1]],sWidth,sHeight,bx,by,atom,atom);//其实c只是一个助记符 c=s.front/ s.left
}
//画萝卜
function drawCarrot(x, y) {
	context.drawImage(carrot,x,y,60,60);
}
//画假萝卜
function drawCarrot2(x, y) {
	context.drawImage(carrot2,x,y,60,60);
}
//画石头
function drawRock(x, y) {
	context.drawImage(stuffs,32,800,32,32,x,y,60,60);
}
//画水
function drawWater(x, y) {
	context.drawImage(stuffs,32,320,32,32,x,y,60,60);
}
//画横桥1
function drawBridge_1(x, y) {
	context.drawImage(stuffs,160,320,32,32,x,y,60,60);
}
//画横桥2
function drawBridge_2(x, y) {
	context.drawImage(stuffs,192,320,32,32,x,y,60,60);
}
//画横桥3
function drawBridge_3(x, y) {
	context.drawImage(stuffs,224,320,32,32,x,y,60,60);
}
//画竖桥1
function drawBridge1(x, y) {
	context.drawImage(stuffs,224,352,32,32,x,y,60,60);
}
//画竖桥2
function drawBridge2(x, y) {
	context.drawImage(stuffs,224,384,32,32,x,y,60,60);
}
//画竖桥3
function drawBridge3(x, y) {
	context.drawImage(stuffs,224,416,32,32,x,y,60,60);
}