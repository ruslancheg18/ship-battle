var app = new Vue({
	el: '#app',
	data: {
		ships : [
			{
				type: 'Четырехпалубный',
				quantity: 1,
				size: 4
			},
			{
				type: 'Трехпалубный',
				quantity: 2,
				size: 3
			},
			{
				type: 'Двухпалубный',
				quantity: 3,
				size: 2
			},
			{
				type: 'Однопалубный',
				quantity: 4,
				size: 1
			}
		],
		fieldSize: 12,
		userField: '',
		compField: ''
	},
	methods: {
		createCleanField () {
			let arr = [];
			for (let i = 0; i < this.fieldSize; i++) {
				this.$set(arr, i, []);
				for (let j = 0; j < this.fieldSize; j++) {
					this.$set(arr[i], j, 0);
				}
			}
			return arr;
		},
		createFieldWithShips (field) {
			var me = this;

			this.ships.forEach(function(item, i, arr) {
				var quantity = item.quantity;
				while (quantity) {
					if (me.checkPlaceForShip(field, item)) {
						quantity--
					}
				}
			});

		},
		createShip (field, ship, row, col, direction) {
			if (direction) {

				for (let i = 0; i < ship.size; i++) {
					this.$set(field[row], (col + i), ship.size);
				}

				for (let i = -1; i < ship.size + 1; i++) {
					this.$set(field[row - 1], (col + i), -1);
					this.$set(field[row + 1], (col + i), -1);
				}

				this.$set(field[row], (col - 1), -1);
				this.$set(field[row], (col + ship.size), -1);

			} else {

				for (let i=0; i < ship.size; i++) {
					this.$set(field[row + i], col, ship.size);
				}

				for (let i = -1; i < ship.size + 1; i++) {
					this.$set(field[row + i], (col - 1), -1);
					this.$set(field[row + i], (col + 1), -1);
				}

				this.$set(field[row - 1], col, -1);
				this.$set(field[row + ship.size], col, -1);
			}
		},
		checkPlaceForShip (field, ship) {
			let row = this.random(1, 10),
					col = this.random(1, 10),
					direction = this.random(0, 1),
					isAvailable = true;

			if (field[row][col] == 0) {
				// Горизонт
				if (direction) {
					if (col + ship.size - 1 <= 10) {
						// console.log('корабль "' + ship.type + '" влезет по горизонтали, вершина: [' + row + ',' + col + ']');
						if (ship.size == 4) {
							this.createShip(field, ship, row, col, direction);
						} else {

							for (let i = 0; i < ship.size; i++) {
								if (field[row][col + i] != 0) {
									isAvailable = false;
									break;
								}
							}

							for (let i = -1; i < ship.size + 1; i++) {
								if (field[row - 1][col + i] > 0 || field[row][col + i] > 0 || field[row + 1][col + i] > 0) {
									isAvailable = false;
									break;
								}
							}


							if (isAvailable) {
								this.createShip(field, ship, row, col, direction);
							}
						}
					} else {
						// console.log('корабль "' + ship.type + '" не влезет по горизонтали, вершина: [' + row + ',' + col + ']');
						isAvailable = false;
					}
				} else {
					if (row + ship.size - 1 <= 10) {
						// console.log('корабль "' + ship.type + '" влезет по вертикали, вершина: [' + row + ',' + col + ']');
						if (ship.size == 4) {
							this.createShip(field, ship, row, col, direction);
						} else {

							for (let i = 0; i < ship.size; i++) {
								if (field[row + i][col] != 0) {
									isAvailable = false;
									break;
								}
							}

							for (let i = -1; i < ship.size + 1; i++) {
								if (field[row + i][col + 1] > 0 || field[row + i][col] > 0 || field[row + i][col - 1] > 0) {
									isAvailable = false;
									break;
								}
							}

							if (isAvailable) {
								this.createShip(field, ship, row, col, direction);
							}
						}
					} else {
						// console.log('корабль "' + ship.type + '" не влезет по вертикали, вершина: [' + row + ',' + col + ']');
						isAvailable = false;
					}
				}
			} else {
				isAvailable = false;
			}

			return isAvailable;
		},
		random(min, max) {
			var rand = min + Math.random() * (max + 1 - min);
			rand = Math.floor(rand);
			return rand;
		},
		shuffleUserShips () {
			this.userField = this.createCleanField();
			this.createFieldWithShips(this.userField);
		},
		startGame () {
			
		},
		shot () {
			console.log('shot')
		},
		newGame () {
			this.compField = this.createCleanField();
			this.userField = this.createCleanField();
			
			this.createFieldWithShips(this.userField);
			this.createFieldWithShips(this.compField);
		}
	}
});