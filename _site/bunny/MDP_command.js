var bu_x = 0, bu_y = 0; //兔子当前所在方格坐标
var vturn = 0; //虚拟转向记录

function MDP_command() {
	bu_x = LEVELS[level].bu[0];
	bu_y = LEVELS[level].bu[1];
	
	vturn = turn;
	
	
	console.log(Pi);
	while('+' != Pi[bu_x][bu_y] && '-' != Pi[bu_x][bu_y]) {
		//读取当前方格状态，生成移动命令
		putOutCmd(Pi[bu_x][bu_y]);
	}
	
	console.log(commands);
	//执行移动命令
	runCmd();
}

function putOutCmd(status) {
	console.log("turnnn:"+turn);
	
	switch(status) {
		case 'N':
			if(0 == vturn) {
				commands.push('left');
				commands.push('left');
				commands.push('move');
			}else if(1 == vturn) {
				commands.push('right');
				commands.push('move');
			}else if(2 == vturn) {
				commands.push('move');
			}else if(3 == vturn) {
				commands.push('left');
				commands.push('move');
			}
			bu_x--;
			vturn = 2;
			break;
		case 'W':
			if(3 == vturn) {
				commands.push('left');
				commands.push('left');
				commands.push('move');
			}else if(0 == vturn) {
				commands.push('right');
				commands.push('move');
			}else if(1 == vturn) {
				commands.push('move');
			}else if(2 == vturn) {
				commands.push('left');
				commands.push('move');
			}
			bu_y--;
			vturn = 1;
			break;
		case 'S':
			if(2 == vturn) {
				commands.push('left');
				commands.push('left');
				commands.push('move');
			}else if(3 == vturn) {
				commands.push('right');
				commands.push('move');
			}else if(0 == vturn) {
				commands.push('move');
			}else if(1 == vturn) {
				commands.push('left');
				commands.push('move');
			}
			bu_x++;
			vturn = 0;
			break;
		case 'E':
			if(1 == vturn) {
				commands.push('left');
				commands.push('left');
				commands.push('move');
			}else if(2 == vturn) {
				commands.push('right');
				commands.push('move');
			}else if(3 == vturn) {
				commands.push('move');
			}else if(0 == vturn) {
				commands.push('left');
				commands.push('move');
			}
			bu_y++;
			vturn = 3;
			break;
	}
}
