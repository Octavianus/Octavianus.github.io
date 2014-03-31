var birth = 0;

//关键词
var CODES = ['left', 'right', 'move', 'guangguang', 'birthday'];
  
//解析命令为"cmd(count)"
var COMMAND_MATCH = /^\s*([a-z]+)(?:\(([0-9]+)\))?\s*$/ ;

var commands = [];//所有的指令集合 一个连续数组存

//解析输入命令，得到命令序列并执行
function Command() {
	readCmd();
	runCmd();
}

//解析输入命令 (核心部分)
function readCmd() {
	var text = document.getElementById("program").value;

	var lineText = text.split(/\r?\n/); //将读取到得文本分成每一行
	for(var i in lineText) {
		var match = COMMAND_MATCH.exec(lineText[i]);

		if(match) {
			var count = match[2]; 
			/*
			move(3)--match: ["move(3)", "move", "3"] command.js:33
			right -- match: ["right", "right", undefined] 
			*/

			if(isCmd(match[1])) { //match[1]:命令
				if(!count || count < 1)
					count = 1;
				for(var j = 0; j < count; j++) {
					commands.push(match[1]);
					console.log("match:",match);
				}
			}else
				console.log("invalid command:It's not a command!");
				// 提示
		}else {
			if (/^\s*$/.exec(lineText)) {
				console.log("blank line!"); //空行
				// 提示
			}else {
				console.log("invalid command:the format is not valid!");
				// 提示
			}
		}
	}
}

//判断是否为合法词汇 命令是否在关键字之中
function isCmd(code) {
	for(var i = 0; i < CODES.length; i++){
		if(code === CODES[i])
			return true;
	}
	return false;
}

//执行命令序列
function runCmd() {
	var i = 0;

	var steep = function(){
		switch(commands[i]) {
			case 'move':
				document.getElementById('walk').play();
				Move();
				setTimeout(function() {
					document.getElementById('walk').pause();
				}, 1600);
				break;
			case 'right': case 'left':
				Turn(commands[i]);
				break;
			/*case 'guangguang':
				break;*/
			case 'birthday':
				birthday();
				birth++;
				break;
			default:
				console.log("Amazing error!");
			}//switch

		i++;
		if(i >= commands.length) {
			clearInterval(stepByStep);
			//执行完后清空命令序列
			commands.length = 0;
			//关卡处理
			setTimeout(function() {
				if('$' == LEVELS[level].map[xx][yy]) {
					showTip(2,4);
					document.getElementById('laugh').play();
					console.log('carrot!');
				}else if(0 == ext && 0 == birth) {
					showTip(1,3);
					document.getElementById('cry').play();
				}
			}, 2000);
			}//if-else
		}//steep
	var stepByStep = setInterval(steep, 2000);// 执行 steep = function() {} java srcrip 里的函数可以嵌套另一个函数的全部！！
}//function