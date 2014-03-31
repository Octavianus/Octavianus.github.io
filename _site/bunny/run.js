//bx byµÄÎ»ÖÃ²»ÄÜ·´ ÍÃÍ

var xx = 0, yy = 0; //¼ÇÂ¼ÍÃ×Óµ±Ç°ËùÔÚµ¥Ôª¸ñ×ø±ê,ÔÚÊý×émapÉÏµÄÎ»ÖÃ,ÓëµØÍ¼×ø±ê»¥Îª×ªÖÃ¾ØÕó
var ext = 0;

var isMoving = false;
var speed = 6; //Ã¿´ÎÐÐ¶¯6¸öµ¥Î»
var sx = [0,32,64];
var sy = [0,32,64,96];
var sWidth = 32,sHeight = 32;


var bx = 0,by = 0; //bx,byÓÃÓÚÉèÖÃÍ¼Æ¬µÄÏÔÊ¾×ø±ê, ÓÉÓÚÊÇµ¹×ÅÈ¡µÃ,bx = bu[1].. ËùÒÔ,bx by¾ÍÊÇµØÍ¼×ø±ê
var atom = 60;
var state = 1; //±äÁ¿stateÓÃÓÚÉèÖÃµ±Ç°ÎïÌåÒÆ¶¯Ê±µÄÍ¼Æ¬
var turn = 0; //µ±Ç°·½Ïò£¬Front£º0£¬left£º1£¬Back£º2£¬Right£º3 // ·½ÏòÉÏÓÐÎó, right:2, back:3. µ÷ÊÔµÄÊ±ºòÔÙ¿´
var s = {
	Front:[[0,0],[1,0],[2,0]],
	Left:[[0,1],[1,1],[2,1]],
	Right:[[0,2],[1,2],[2,2]],
	Back:[[0,3],[1,3],[2,3]]
};
var c = s.Front; //±äÁ¿cÓÃÓÚÉèÖÃµ±Ç°ÎïÌå·½Ïò,Ä¬ÈÏÉèÖÃÎªÇ°·½

var draw=function() {
	context.clearRect(0,0,600,600);	
	setObject();
	//ÍÃ×Ó
	drawBunny();
};

//ÒÆ¶¯
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
	//ÅÐ¶ÏÊÇ·ñ»á×ßµ½±ß½ç
	if(xx > 9 | xx < 0 | yy > 9 | yy < 0) {
		console.log('will out of the map');
		isMoving = false;
		return false;
	}else if('O' == LEVELS[level].map[xx][yy]) {
		//ÅÐ¶ÏÊÇ·ñ»á×ßµ½Ê¯Í·
		console.log('there is rock');
		isMoving = false;
		return false;
	}
	return true;
}

function moveOneStep(temp, ato, s) { 
	timeDraw = setInterval(draw,1000/25); //ÎÒÃÇ½«ÉèÖÃ¶¯»­Îª25fps[Ö¡Ã¿Ãë]£¬40/1000£¬¼´Îª¶þÊ®Îå·ÖÖ®Ò»  
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
	}, 2000/11);  //2ºÁÃëÖ´ÐÐ11´Î
}

function stopMoving() {	
	state = 1;
	isMoving = false;
	clearInterval(timeDraw);
	clearInterval(stepDraw);
	context.drawImage(bunny,sx[c[state][0]],sy[c[state][1]],sWidth,sHeight,bx,by,atom,atom);
	//ÅÐ¶ÏÊÇ·ñÒÆ¶¯½øË®
	if('~' == LEVELS[level].map[xx][yy]) {
		console.log('drop in water!');
		commands.length = 0;
		ext = 1;
		document.getElementById('drop').play();
		showTip(0,3);
	}else
		draw();
}
//×ªÏò
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

//×ªÏòÓ³Éä
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