import emptyMatrix './empty-field-create';


export default () => {
	let startPoints = [
		[ [7,1], [3,1], [1,3], [1,7] ],
		[ [4,1], [8,1], [10,3], [10,7] ]
	],
	shootMatrixAI = [];
	shootMatrix = emptyMatrix();

	for (let i = 0, length = startPoints.length; i < length; i++) {

		var arr = startPoints[i];
		for (var j = 0, lh = arr.length; j < lh; j++) {

			var x = arr[j][0],
				y = arr[j][1];

			switch(i) {
				case 0:
					while(x <= 10 && y <= 10) {
						shootMatrixAI.push([x,y]);
						x = (x <= 10) ? x : 10;
						y = (y <= 10) ? y : 10;
						x++; y++;
					};
					break;

				case 1:
					while(x >= 1 && x <= 10 && y <= 10) {
						shootMatrixAI.push([x,y]);
						x = (x >= 1 && x <= 10) ? x : (x < 1) ? 1 : 10;
						y = (y <= 10) ? y : 10;
						x--; y++;
					};
					break;
			}
		}
	}

	function compareRandom(a, b) {
		return Math.random() - 0.5;
	}
	
	shootMatrix.sort(compareRandom);
	shootMatrixAI.sort(compareRandom);


};