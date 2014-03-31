var context;
var canvas;
var level = -1;
var isClick = false; //�Ƿ���Ӧ�����
var soundOn = 0;

function onLoad() {
	init();
	loadPics();
	Welcome();
	round();
}//��ʼ������


function init() {
	document.getElementById('loop').play();
	document.getElementById('loop').volume = 0.5

	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");

	canvas.width = 600;
	canvas.height = 600; //��������ã�������δĬ��ֵ300,150,��css�����õ�ֵ���ɱ�����Ӧ����
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
}//getelemetbyid ����#������ݶ�ȡ.
