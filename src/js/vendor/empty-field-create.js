export default (field) => {
	for (let i = 0; i < 12; i++) {
		this.$set(field, i, []);
		for (let j = 0; j < 12; j++) {
			this.$set(field[i], j, 0);
		}
	}

	return field;
};