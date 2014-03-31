LEVELS = [
	{
		name: 'Go and get it',
		bu: [3, 1],
		map: [
			'...$......',
			'.O.~......',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........'
		]
	},
	
	{
		name: 'Like a rock',
		bu: [2, 5],
		map: [
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'.....O....',
			'..........',
			'.....$....',
			'..........',
			'..........'
		]
	},
	
	{
		name: '   Opps',
		bu: [8, 2],
		map: [
			'..........',
			'..........',
			'..........',
			'..........',
			'......$...',
			'OOOOOOOOO.',
			'..........',
			'..........',
			'..........',
			'..........'
		]
	}
];

//����ؿ���ͼ
function Level() {
	setObject();
	xx = LEVELS[level].bu[0];
	yy = LEVELS[level].bu[1];

	bx = LEVELS[level].bu[1]*60;
	by = LEVELS[level].bu[0]*60;
	turn = 0;
	c = s.Front;
	drawBunny();
}

//���õ�ͼԪ��
function setObject() {
	for(var i = 0; i < LEVELS[level].map.length; i++) {
		for(var j = 0; j < LEVELS[level].map[i].length; j++) {
			mapObject(j, i, LEVELS[level].map[i][j]);//��0��ʼ, ����x*60,y*60�ܹ��պû����������ڴ�
			//use http://www.w3schools.com/tags/canvas_drawimage.asp
		}
	}
}