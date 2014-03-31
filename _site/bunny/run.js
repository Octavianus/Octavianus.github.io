//bx by��λ�ò��ܷ� ���

var xx = 0, yy = 0; //��¼���ӵ�ǰ���ڵ�Ԫ������,������map�ϵ�λ��,���ͼ���껥Ϊת�þ���
var ext = 0;

var isMoving = false;
var speed = 6; //ÿ���ж�6����λ
var sx = [0,32,64];
var sy = [0,32,64,96];
var sWidth = 32,sHeight = 32;


var bx = 0,by = 0; //bx,by��������ͼƬ����ʾ����, �����ǵ���ȡ��,bx = bu[1].. ����,bx by���ǵ�ͼ����
var atom = 60;
var state = 1; //����state�������õ�ǰ�����ƶ�ʱ��ͼƬ
var turn = 0; //��ǰ����Front��0��left��1��Back��2��Right��3 // ����������, right:2, back:3. ���Ե�ʱ���ٿ�
var s = {
	Front:[[0,0],[1,0],[2,0]],
	Left:[[0,1],[1,1],[2,1]],
	Right:[[0,2],[1,2],[2,2]],
	Back:[[0,3],[1,3],[2,3]]
};
var c = s.Front; //����c�������õ�ǰ���巽��,Ĭ������Ϊǰ��

var draw=function() {
	context.clearRect(0,0,600,600);	
	setObject();
	//����
	drawBunny();
};

//�ƶ�
function Move() {
	isMoving = true;
	
	switch(turn) {
		case 0:
			xx++;
			if(ableToWalk()){
				moveOneStep(by, atom, speed);
				break;
			}else {
				xx--;
				return;
			}
		case 1:
			yy--;
			if(ableToWalk()){
				moveOneStep(bx, -atom, -speed);
				break;
			}else {
				yy++;
				return;
			}
		case 2:
			xx--;
			if(ableToWalk()){
				moveOneStep(by, -atom, -speed);
				break;
			}else {
				xx++;
				return;
			}
		case 3:
			yy++;
			if(ableToWalk()){
				moveOneStep(bx, atom, speed);
				break;
			}else {
				yy--;
				return;
			}
	}
	
	console.log('bx:'+bx+' by:'+by);
	console.log('xx:'+xx+' yy:'+yy);
}

function ableToWalk() {
	//�ж��Ƿ���ߵ��߽�
	if(xx > 9 | xx < 0 | yy > 9 | yy < 0) {
		console.log('will out of the map');
		isMoving = false;
		return false;
	}else if('O' == LEVELS[level].map[xx][yy]) {
		//�ж��Ƿ���ߵ�ʯͷ
		console.log('there is rock');
		isMoving = false;
		return false;
	}
	return true;
}

function moveOneStep(temp, ato, s) { 
	timeDraw = setInterval(draw,1000/25); //���ǽ����ö���Ϊ25fps[֡ÿ��]��40/1000����Ϊ��ʮ���֮һ  
	stepDraw = setInterval(function(){
		if(isMoving){
			state += 2;
			if(state > 2)
				state = 0;
		}
		switch(turn) {
			case 0: case 2:
				if(by != temp + ato)
					by += s;
				else
					stopMoving();
				break;
			case 1: case 3:
				if(bx != temp + ato)
					bx += s;
				else
					stopMoving();
				break;
		}
	}, 2000/11);  //2����ִ��11��
}

function stopMoving() {	
	state = 1;
	isMoving = false;
	clearInterval(timeDraw);
	clearInterval(stepDraw);
	context.drawImage(bunny,sx[c[state][0]],sy[c[state][1]],sWidth,sHeight,bx,by,atom,atom);
	//�ж��Ƿ��ƶ���ˮ
	if('~' == LEVELS[level].map[xx][yy]) {
		console.log('drop in water!');
		commands.length = 0;
		ext = 1;
		document.getElementById('drop').play();
		showTip(0,3);
	}else
		draw();
}
//ת��
function Turn(text) {

	switch(text) {
		case 'left':
			turn--
			changeTurn();
			break;
		case 'right':
			turn++;
			changeTurn();
			break;
		default:
			console.log("Unbelievable error!");
	}
}

//ת��ӳ��
function changeTurn() {
	turn += 4;
	turn = turn % 4;
	console.log('turn:'+turn);
	switch(turn) {
		case 0:
			c = s.Front;
			draw();
			break;
		case 1:
			c = s.Left;
			draw();
			break;
		case 2:
			c = s.Back;
			draw();
			break;
		case 3:
			c = s.Right;
			draw();
			break;
	}
}