import './vendor';
import Vue from 'vue/dist/vue';

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
		gamers: [
			{
				id: 'user',
				fleet: [],
				field: []
			},
			{
				id: 'computer',
				fleet: '',
				field: []
			}
		],
		userField: '',
		compField: '',
		userShipsQuantity: '',
		computerShipsQuantity: '',
		serviceMessage: '',
		computerLastLuckyShots: [],
		gameSteps: {
			newGame: false,
			isStarting: false,
			isFinished: false
		}
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
		newGame () {
			this.compField = this.createCleanField();
			this.userField = this.createCleanField();
			
			this.createFieldWithShips(this.userField);
			this.createFieldWithShips(this.compField);

			this.$set(this.gameSteps, 'newGame', true);
		},
		shuffleUserShips () {
			this.userField = this.createCleanField();
			this.createFieldWithShips(this.userField);
		},
		startGame () { 
			if (this.random(0, 1)) {
				this.serviceMessage = 'Первым ходит компьютер';
				this.computerShot();
			} else {
				this.serviceMessage = 'Вы ходите первым';
			}

			this.$set(this.gameSteps, 'isStarting', true);
		},
		userShot (row, cellValue, cellIndex) {
			var me = this;
			if (cellValue > 0) {
				this.$set(row, cellIndex, -3);
				this.serviceMessage = 'Вы попали';
				this.checkFinishGame(this.compField, 'Вы выиграли');
			} else {
				this.$set(row, cellIndex, -2);
				this.serviceMessage = 'Вы промахнулись';
				setTimeout(function () {
					me.computerShot();
				}, 500);
			}
		},
		resultativeShot (row, col) {
			switch (this.userField[row][col]) {
				case 1:
				this.serviceMessage = 'Компьютер потопил ваш "Однопалубный" корабль';
				for (let i = -1; i < shipSize + 1; i++) {
					this.$set(this.userField[row - 1], (col + i), -2);
					this.$set(this.userField[row + 1], (col + i), -2);
				}
				this.$set(this.userField[row], col, -2);
				this.$set(this.userField[row], (col + shipSize), -2);
				break; 
			}
			this.$set(this.userField[row], col, -3);
		},
		computerShot () {
			let row = this.random(1, 10),
					col = this.random(1, 10),
					me = this;

			if (this.userField[row][col] > 0) {
				this.resultativeShot(row, col);
			} else {
				if (this.userField[row][col] <= -2) {
					setTimeout(function () {
						me.computerShot();
					}, 500);
				} else {
					this.serviceMessage = 'Компьютер промахнулся';
					this.$set(this.userField[row], col, -2);
				}
			}
		},
		checkFinishGame (field, message) {
			var me = this,
					gameIsContinue = false;
			outerLoop: for (let i = 0; i < field.length; i++) {
				for (let j = 0; j < field[i].length; j++) {
					if (field[i][j] > 0) {
						gameIsContinue = true;
						break outerLoop;
					} 
				}
			}

			if (!gameIsContinue) {
				this.$set(this.gameSteps, 'isFinished', true);
				this.serviceMessage = message;
			}
		},
		exitGame () {
			console.log('exit game')
		}
	}
});