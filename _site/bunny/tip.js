//文字提示:关于welcome showtip就是游戏中弹出文字 和每一关开始的文字提示
function Welcome() {
	context.fillStyle = "rgba(0,30,0,0.3)";//红绿蓝透明度
	context.fillRect(0,70,600,450);//x,y,宽,高
	var text = ["Rabbit's adventure for carrot...",
		"You should write some commands to pass the game, the commands",
		"that you can use is as follow:",
		"move    right    left",
		"Remember: Each command takes a line, you can use the", 
		"format 'move(x)'(x=1,2,3...)to take the same action for",
		"x time(s). After finishing your input, click the 'run' button to",
		"start,Let's see whether the rabbit could eat the carrot.",
		"Click to play"
	];
	context.font = "36px 微软雅黑";
	context.fillStyle = "rgba(255,255,255,1)";
	context.fillText(text[0], 30, 150);
	context.font = "16px 微软雅黑";
	context.fillText(text[1], 60, 210);
	context.fillText(text[2], 20, 240);
	context.fillText(text[4], 20, 320);
	context.fillText(text[5], 20, 350);
	context.fillText(text[6], 20, 380);
	context.fillText(text[7], 20, 410);
	context.font = "bold 18px 微软雅黑";
	context.fillText(text[3], 200, 280);
	context.fillText(text[8], 420, 470);
	

	isClick = true;
}

function showTip(i,j) {
	context.fillStyle = "rgba(0,30,0,0.3)";
	context.fillRect(0,150,600,300);
	var text = ["The rabbit falls into the water.",
		"Fails to get the carrot!",
		"You win!",
		"Click any key to restart.",
		"Click any key to continue.",
		"Sorry, no more challenge now.",
		"Let we replay the game."
	];
	context.font = "36px 微软雅黑";
	context.fillStyle = "white";
	context.fillText(text[i], 80, 280);
	context.font = "24px 微软雅黑";
	context.fillText(text[j], 130, 360);

	if(3 == j)
		level--;//未知 牵涉

	document.getElementById("program").value = '';
	isClick = true;
}

function showBegin() {
	context.fillStyle = "rgba(0,30,0,0.3)";
	context.fillRect(0,150,600,300);
	var text = "Level "+level+"   "+LEVELS[level].name;
	context.font = "36px 微软雅黑";
	context.fillStyle = "white";
	context.fillText(text, 80, 280);
	ext = 0;
	birth = 0;
	setTimeout(function() {
		context.clearRect(0,0,600,600);
		Level();
	}, 1500); //每关开始前消除屏显
}

function birthday() {
}