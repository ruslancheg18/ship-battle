export default () => {
	var field = [];

	for (let i = 0; i < 12; i++) {
		field[i] = [];
		for (let j = 0; j < 12; j++) {
			field[i][j] = '';
		}
	}

	return field;
};