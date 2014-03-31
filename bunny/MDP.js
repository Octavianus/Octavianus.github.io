// General settings
var Ra = -3;//cost function
var gamma = 1;
var pGood = 0.8;
var pBad = 0.1;
var N = 100000;
var deltaMin = 1e-11;//收敛条件
var rMax = 10, cMax = 10;
var r1 = 0, c1 = 0; //存放carrot坐标
var r0 = [], c0 = []; //存放rock的坐标
var r_1 = [], c_1 = []; //存放sink的坐标

// Main data structure 4个二维数组
var U = Array(Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax));
var Up = Array(Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax));
var R = Array(Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax)); //每一单元格的reward 
var Pi = Array(Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax),Array(cMax));//存储的NEWS方向

function MDPGrid() {
	var r, c; //row, col
	var delta = 0;

	r0.length = 0;
	c0.length = 0;
	r_1.length = 0;
	c_1.length = 0;
	
	for(r = 0; r < rMax; r++)
		for(c = 0; c < cMax; c++)
			Up[r][c] = 0;

	for(r = 0;r < rMax; r++) {
		for(c = 0; c < cMax; c++) {
			switch(LEVELS[level].map[r][c]) {//bunnu.js round()中自增
				case '.':
					R[r][c] = Ra;
					break;
				case 'O':
					R[r][c] = 0; // unreachable state
					r0.push(r);
					c0.push(c);
					break;
				case '~':
					R[r][c] = -100; // negative sink state
					r_1.push(r);
					c_1.push(c);
					break;
				case '$':
					R[r][c] = 100; // positive sink state
					r1 = r;
					c1 = c;
					break;
				default:
					R[r][c] = Ra;
			}
		}
	}

	console.log(U);
	console.log(Up);
	console.log(R);
	console.log(Pi);

	// Now perform Value Iteration
	var n = 0;
	do {
		// Simultaneous updates: set U = Up, then compute changes in Up using 
		// prev value of U.
		duplicate(); // src, dest
		n++;
		for(r = 0;r < rMax; r++)
			for(c = 0; c < cMax; c++) {
				var delta = 0;
				updateUPrime(r, c);
				var diff = Math.abs(Up[r][c] - U[r][c]);
				if(diff > delta)
					delta = diff;
					//console.log('diff',n,diff);
					//console.log('delta',n,delta);
					//console.log('min',n,deltaMin);
			}
	}while(delta > deltaMin && n < N); //convergence prerequisite is this
	
	// Display final Matrix
	var Ustring = "After " + n + " iterations:\n";

	for(r = 0; r < rMax; r++) {
		for(c = 0; c < cMax; c++) {
			var temp = "" + U[r][c];
			Ustring += temp.substring(0,5)+'\t';
		}
		Ustring += '\n\r';
	}
	
	// Before display the best policy, insert chars in the sinks and the 
	// non-moving block
	Pi[r1][c1] = '+';
	for(var k in r_1) {
		Pi[r_1[k]][c_1[k]] = '-';
	}
	for(var k in r0) {
		Pi[r0[k]][c0[k]] = '#';
	}
	
	Ustring += "\nBest policy:\n";
	for(r = 0; r < rMax; r++) {
		for(c = 0; c < cMax; c++)
			Ustring += Pi[r][c]+"\t";
		Ustring += '\n\r';
	}
	document.getElementById("program").value = Ustring;
	
	//执行算法得到的行走路线
	MDP_command();
}// MDO_GRID

function updateUPrime(r, c) {
	// IMPORTANT: this modifies the value of Up, using values in U.
	
	var a = Array(4); // 4 actions
	
	//If at a sink, success state or unreachable state, use that value
	for(var k in r0) {
		if((r == r0[k] && c == c0[k]) || (r == r1 && c == c1)) {
			Up[r][c] = R[r][c];
			return;
		}
	}// to optimal the complexity of the code, the (r == r1 && c == c1) could move out
	for(var k in r_1) {
		if(r == r_1[k] && c == c_1[k]) {
			Up[r][c] = R[r][c];
			return;
		}
	}

	//每个方向的分数
	a[0] = aNorth(r, c) * pGood + aWest(r, c) * pBad + aEast(r, c) * pBad;
	a[1] = aSouth(r, c) * pGood + aWest(r, c) * pBad + aEast(r, c) * pBad;
	a[2] = aWest(r, c) * pGood + aSouth(r, c) * pBad + aNorth(r, c) * pBad;
	a[3] = aEast(r, c) * pGood + aSouth(r, c) * pBad + aNorth(r, c) * pBad;
		
	var best = maxindex(a);
		
	Up[r][c] = R[r][c] + gamma * a[best];
		
	// update policy
	Pi[r][c] = (best == 0 ? 'N' : (best == 1 ? 'S' : (best == 2 ? 'W' : 'E')));//swith 效率比较高
}

function maxindex(a) {
	var b = 0;
	for(var i = 0; i < a.length; i++)
		b = (a[b] > a[i]) ? b : i;
	return b;
}

function aNorth(r, c) {
	// can't go north if at row 0 or if in cell (2,1)
	for(var k in r0) {
		if((r == 0) || (r == r0[k]+1 && c == c0[k]))
			return U[r][c];
	}
	return U[r - 1][c];
}

function aSouth(r, c) {
	// can't go south if at row 2 or if in cell (0,1)
	for(var k in r0) {
		if((r == rMax - 1) || (r == r0[k]-1 && c == c0[k]))
			return U[r][c];
	}
	return U[r + 1][c];
}

function aWest(r, c) {
	// can't go west if at col 0 or if in cell (1,2)
	for(var k in r0) {
		if((c == 0) || (r == r0[k] && c == c0[k]+1))
			return U[r][c];
	}
	return U[r][c - 1];
}

function aEast(r, c) {
	// can't go east if at col 3 or if in cell (1,0)
	for(var k in r0) {
		if((c == cMax - 1) || (r == r0[k] && c == c0[k]-1))
			return U[r][c];
	}
	return U[r][c + 1];
}

function duplicate() {
	// Copy data from src to dest
	for(var x = 0; x < Up.length; x++)
		for(var y = 0; y < Up[x].length; y++)
			U[x][y] = Up[x][y];
}
