var context;
var canvas;
var level = -1;
var isClick = false; //是否响应鼠标点击
var soundOn = 0;

function onLoad() {
	init();
	loadPics();
	Welcome();
	round();
}//初始化画布


function init() {
	document.getElementById('loop').play();
	document.getElementById('loop').volume = 0.5

	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");

	canvas.width = 600;
	canvas.height = 600; //必须得设置，否则仍未默认值300,150,。css中设置的值则会成比例对应过来
}

function round() {
	canvas.addEventListener('click', function(evt) {
		if(isClick) {
			context.clearRect(0,0,600,600);
			level++;
			if(level < LEVELS.length){
				showBegin();
				isClick = false;
			}else {
				showTip(5,6);
				level = -1;
			}
		}
	}, false);
}

function sound() {
	if(0 == soundOn) {
		document.getElementById('loop').pause(); 
		document.getElementById('mus').src = "images/Music2.png";
		soundOn++;
	}else {
		document.getElementById('loop').play();
		document.getElementById('loop').volume = 0.5;
		document.getElementById('mus').src = "images/Music.png";
		soundOn--;
	}
}//getelemetbyid 按照#后的内容读取.
