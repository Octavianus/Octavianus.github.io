var birth = 0;

//�ؼ���
var CODES = ['left', 'right', 'move', 'guangguang', 'birthday'];
  
//��������Ϊ"cmd(count)"
var COMMAND_MATCH = /^\s*([a-z]+)(?:\(([0-9]+)\))?\s*$/ ;

var commands = [];//���е�ָ��� һ�����������

//������������õ��������в�ִ��
function Command() {
	readCmd();
	runCmd();
}

//������������ (���Ĳ���)
function readCmd() {
	var text = document.getElementById("program").value;

	var lineText = text.split(/\r?\n/); //����ȡ�����ı��ֳ�ÿһ��
	for(var i in lineText) {
		var match = COMMAND_MATCH.exec(lineText[i]);

		if(match) {
			var count = match[2]; 
			/*
			move(3)--match: ["move(3)", "move", "3"] command.js:33
			right -- match: ["right", "right", undefined] 
			*/

			if(isCmd(match[1])) { //match[1]:����
				if(!count || count < 1)
					count = 1;
				for(var j = 0; j < count; j++) {
					commands.push(match[1]);
					console.log("match:",match);
				}
			}else
				console.log("invalid command:It's not a command!");
				// ��ʾ
		}else {
			if (/^\s*$/.exec(lineText)) {
				console.log("blank line!"); //����
				// ��ʾ
			}else {
				console.log("invalid command:the format is not valid!");
				// ��ʾ
			}
		}
	}
}

//�ж��Ƿ�Ϊ�Ϸ��ʻ� �����Ƿ��ڹؼ���֮��
function isCmd(code) {
	for(var i = 0; i < CODES.length; i++){
		if(code === CODES[i])
			return true;
	}
	return false;
}

//ִ����������
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
			//ִ����������������
			commands.length = 0;
			//�ؿ�����
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
	var stepByStep = setInterval(steep, 2000);// ִ�� steep = function() {} java srcrip ��ĺ�������Ƕ����һ��������ȫ������
}//function