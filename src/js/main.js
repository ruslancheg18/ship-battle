import './vendor'

var app = new Vue({
	el: '#app',
	data: {
		ships : [
			{
				type: 'Четырехпалубный',
				quantity: 1,
				size: 4,
				isCreated: false
			},
			{
				type: 'Трехпалубный',
				quantity: 2,
				size: 3,
				isCreated: false
			},
			{
				type: 'Двухпалубный',
				quantity: 3,
				size: 2,
				isCreated: false
			},
			{
				type: 'Однопалубный',
				quantity: 4,
				size: 1,
				isCreated: false
			}
		],
		fieldSize: 12,
		field: []
	},
	methods: {
		random(min, max) {
			var rand = min + Math.random() * (max + 1 - min);
			rand = Math.floor(rand);
			return rand;
		},
		checkPlaceForShip (ship) {
			let row = this.random(1, 10),
					col = this.random(1, 10),
					// direction = this.random(0, 1),
					direction = 1,
					isAvailable = true;

			if (this.field[row][col] == 0) {
				// Горизонт
				if (direction) {
					if (col + ship.size - 1 <= 10) {
						console.log('корабль "' + ship.type + '" влезет по горизонтали, вершина: [' + row + ',' + col + ']');
						if (ship.size == 4) {
							this.createShip(ship, row, col, direction);
						} else {

							for (let i = -1; i < ship.size + 1; i++) {
								if (!this.field[row + 1][col + i] <= 0 && !this.field[row][col + i] <= 0 && !this.field[row - 1][col + i] <= 0) {
									isAvailable = false;
									break;
								}
							}

							if (isAvailable) {
								this.createShip(ship, row, col, direction);
							}
						}
					} else {
						console.log('корабль "' + ship.type + '" не влезет по горизонтали, вершина: [' + row + ',' + col + ']');
						isAvailable = false;
					}
				} else {
					if (row + ship.size - 1 <= 10) {
						console.log('корабль "' + ship.type + '" влезет по вертикали, вершина: [' + row + ',' + col + ']');
						if (ship.size == 4) {
							this.createShip(ship, row, col, direction);
						} else {
							for (let i = -1; i < ship.size + 1; i++) {
								if (!this.field[row + i][col + 1] <= 0 && !this.field[row + i][col] <= 0 && !this.field[row + i][col - 1] <= 0) {
									isAvailable = false;
									break;
								}
							}

							if (isAvailable) {
								this.createShip(ship, row, col, direction);
							}
						}
					} else {
						console.log('корабль "' + ship.type + '" не влезет по вертикали, вершина: [' + row + ',' + col + ']');
						isAvailable = false;
					}
				}
			} else {
				isAvailable = false;
			}

			return isAvailable;
		},
		createShip (ship, row, col, direction) {
			if (direction) {

				for (let i = 0; i < ship.size; i++) {
					this.field[row][col + i] = ship.size;
				}

				for (let i = -1; i < ship.size + 1; i++) {
					this.field[row - 1][col + i] = -1;
					this.field[row + 1][col + i] = -1;
				}

				this.field[row][col - 1] = -1;
				this.field[row][col + ship.size] = -1;

			} else {

				for (let i=0; i < ship.size; i++) {
					this.field[row + i][col] = ship.size;
				}

				for (let i = -1; i < ship.size + 1; i++) {
					this.field[row + i][col - 1] = -1;
					this.field[row + i][col + 1] = -1;
				}

				this.field[row - 1][col] = -1;
				this.field[row + ship.size][col] = -1;

			}
		},
		createCleanField () {
			for (let i = 0; i < this.fieldSize; i++) {
				this.field[i] = []
				for (let j = 0; j < this.fieldSize; j++) {
					this.field[i][j] = 0;
				}
			}
			return this.field;
		},
	},
	computed: {
		addShips () {
			this.createCleanField();
			var me = this;

			this.ships.forEach(function(item, i, arr) {
				while (item.quantity) {
					if (me.checkPlaceForShip(item)) {
						item.quantity--
					}
				}

			});

			return this.field;
		}
	}
});