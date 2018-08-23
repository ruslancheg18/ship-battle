import './vendor';
import Vue from 'vue/dist/vue';
import emptyField from './vendor/empty-field-create';
import fleetData from './vendor/fleet';

var app = new Vue({
	el: '#app',
	data: {
		gamers: {
			computer: {
				fleet: Array,
				field: emptyField(),
				fleetSize: 0,
				winner: false
			},
			user: {
				fleet: Array,
				field: emptyField(),
				fleetSize: 0,
				winner: false
			}
		},
		isComputerTurn: true,
		gameSteps: {
			newGame: false,
			isStarting: false,
			isFinished: false
		}
	},
	methods: {
		addShips (gamer) {
			gamer.field = emptyField();
			gamer.fleetSize = 0;
			gamer.fleet = [];


			fleetData.forEach((ship, i, arr) => {
				let shipsQuantity = ship.quantity;

				gamer.fleetSize += ship.quantity;

				if (ship.size == 4) {
					this.createShip(gamer, ship, this.getCoordinates(ship.size));
				} else {
					while (shipsQuantity) {
						var coords = this.getCoordinates(ship.size);
						if (this.checkEmptyCell(gamer, ship, coords)) {
							this.createShip(gamer, ship, coords);
							shipsQuantity--
						}
					}
				}
			});
		},
		getCoordinates(n) {
			let row, col, direction = this.random(0,1);
			if (direction == 1) {
					row = this.random(1,10);
					col = this.random(1, 10 - n);
				} else {
					row = this.random(1, 10 - n);
					col = this.random(1, 10);
				}

			return {
				row: row,
				col: col,
				direction: direction
			}
		},
		checkEmptyCell (gamer, ship, coords) {
			let isAvailable = true,
					row = coords.row,
					col = coords.col,
					direction = coords.direction;

			if (gamer.field[row][col] == 0) {
				if (direction == 1) {
					for (let i = -1; i < ship.size + 1; i++) {
						if (gamer.field[row - 1][col + i] > 0 || gamer.field[row][col + i] > 0 || gamer.field[row + 1][col + i] > 0) {
							isAvailable = false;
							break;
						}
					}
				} else {
					for (let i = -1; i < ship.size + 1; i++) {
						if (gamer.field[row + i][col + 1] > 0 || gamer.field[row + i][col] > 0 || gamer.field[row + i][col - 1] > 0) {
							isAvailable = false;
							break;
						}
					}
				}
			} else {
				isAvailable = false;
			}

			return isAvailable;
		},
		createShip (gamer, ship, coords) {
			var coordinates = [],
					row = coords.row,
					col = coords.col,
					direction = coords.direction;

			if (direction == 1) {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row], (col + i), ship.size);
					coordinates.push([row, col + i]);
				}
			} else {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row + i], col, ship.size);
					coordinates.push([row + i, col]);;
				}
			}

			gamer.fleet.push({
				ship: ship.size,
				coords: coordinates,
				isAlive: true
			});
		},
		random(min, max) {
			var rand = min - 0.5 + Math.random() * (max - min + 1)
					rand = Math.round(rand);
					return rand;
		},
		newGame () {
			for (let key in this.gamers) {
				this.addShips(this.gamers[key]);
			}
			this.$set(this.gameSteps, 'newGame', true);
		},
		startGame () { 
			if (this.random(0, 1) == 1) {
				this.isComputerTurn = false;
			}

			if (this.isComputerTurn) {
				this.serviceMessage = 'Первым ходит компьютер';
				setTimeout(() => {
					this.computerShot();
				}, 1000);
			} else {
				this.serviceMessage = 'Вы ходите первым';
			}

			this.$set(this.gameSteps, 'isStarting', true);
		},
		userShot (row, cellValue, cellIndex) {
			if (!this.isComputerTurn) {
				if (cellValue > 0) {
					this.$set(row, cellIndex, -3);
					this.checkEnemyFleetBalance(this.gamers.computer);
				} else {
					this.$set(row, cellIndex, -2);
					// Выстрел компьютера
					this.computerShot();
				}
			}
		},
		checkEnemyFleetBalance (gamer) {
			if (gamer.fleetSize === 0) {
				this.gameSteps.isFinished = true;
			}
		},
		computerShot () {
			let row = this.random(1, 10),
					col = this.random(1, 10),
					me = this;

			if (this.luckyShot === '') {
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
			} else {
				this.computerAimingShot();
			}
		},
		exitGame () {
			if (!this.gameSteps.isFinished) {
				this.serviceMessage = 'Вы проиграли'
			}
		},
	}
});