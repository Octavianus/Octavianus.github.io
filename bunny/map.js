//��ʼ����ͼ�ز�

var bunny = new Image();
var carrot = new Image();
var carrot2 = new Image();
var stuffs = new Image();

//����ͼƬ�ز�
function loadPics() {
	bunny.src = "images/bunny.png";	
	carrot.src = "images/carrot.png";
	carrot2.src = "images/carrot2.png";
	stuffs.src = "images/stuffs.png";
}

//������ͼԪ�� �����������ķ��Ž�Ϊ�Զ����ͼԪ��
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

//������
function drawBunny() {
	//��Ӱ
	context.fillStyle="rgba(0,0,0,0.4)";
	context.beginPath();
	context.arc(bx+20,by+47,12,0,Math.PI*2,true); //������Ϸ�������ӰЧ��,����.
	//arc(x, y, radius, startAngle, endAngle, anticlockwise)
	context.closePath();
	context.fill();
	//����
	context.drawImage(bunny,sx[c[state][0]],sy[c[state][1]],sWidth,sHeight,bx,by,atom,atom);//��ʵcֻ��һ�����Ƿ� c=s.front/ s.left
}
//���ܲ�
function drawCarrot(x, y) {
	context.drawImage(carrot,x,y,60,60);
}
//�����ܲ�
function drawCarrot2(x, y) {
	context.drawImage(carrot2,x,y,60,60);
}
//��ʯͷ
function drawRock(x, y) {
	context.drawImage(stuffs,32,800,32,32,x,y,60,60);
}
//��ˮ
function drawWater(x, y) {
	context.drawImage(stuffs,32,320,32,32,x,y,60,60);
}
//������1
function drawBridge_1(x, y) {
	context.drawImage(stuffs,160,320,32,32,x,y,60,60);
}
//������2
function drawBridge_2(x, y) {
	context.drawImage(stuffs,192,320,32,32,x,y,60,60);
}
//������3
function drawBridge_3(x, y) {
	context.drawImage(stuffs,224,320,32,32,x,y,60,60);
}
//������1
function drawBridge1(x, y) {
	context.drawImage(stuffs,224,352,32,32,x,y,60,60);
}
//������2
function drawBridge2(x, y) {
	context.drawImage(stuffs,224,384,32,32,x,y,60,60);
}
//������3
function drawBridge3(x, y) {
	context.drawImage(stuffs,224,416,32,32,x,y,60,60);
}