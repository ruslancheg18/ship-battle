import './vendor';
import Vue from 'vue/dist/vue';
import emptyField from './vendor/empty-field-create';
import fleetData from './vendor/fleet';

var app = new Vue({
	el: '#app',
	data: {
		gamers: {
			computer: {
				// shootMatrixAround: [],
				// shootMatrixAI: [],
				// shootMatrix: emptyField(),
				luckyShots: ''
			},
			user: {}
		},
		isComputerTurn: true,
		gameSteps: {
			newGame: false,
			isStarting: false,
			isFinished: false
		}
	},
	beforeMount() {
		for (let gamer in this.gamers) {
			this.$set(this.gamers[gamer], 'fleet', Array);
			this.$set(this.gamers[gamer], 'field', emptyField());
			this.$set(this.gamers[gamer], 'fleetSize', 0);
			this.$set(this.gamers[gamer], 'isWinner', false);
		}

		// this.shootMatrixexCreate();
	},
	methods: {
		compareRandom (a, b) {
			return Math.random() - 0.5;
		},
		shootMatrixexCreate() {
			var startPoints = [
				[ [7,1], [3,1], [1,3], [1,7] ],
				[ [4,1], [8,1], [10,3], [10,7] ]
			];

			for (var i = 1; i < 11; i++) {
				for(var j = 1; j < 11; j++) {
					this.gamers.computer.shootMatrix.push([i, j]);
				}
			}

			for (let i = 0, length = startPoints.length; i < length; i++) {

				var arr = startPoints[i];
				for (var j = 0, lh = arr.length; j < lh; j++) {

					var x = arr[j][0],
						y = arr[j][1];

					switch(i) {
						case 0:
							while(x <= 10 && y <= 10) {
								this.gamers.computer.shootMatrixAI.push([x,y]);
								x = (x <= 10) ? x : 10;
								y = (y <= 10) ? y : 10;
								x++; y++;
							};
							break;

						case 1:
							while(x >= 1 && x <= 10 && y <= 10) {
								this.gamers.computer.shootMatrixAI.push([x,y]);
								x = (x >= 1 && x <= 10) ? x : (x < 1) ? 1 : 10;
								y = (y <= 10) ? y : 10;
								x--; y++;
							};
							break;
					}
				}
			}


			this.gamers.computer.shootMatrix.sort(this.compareRandom);
			this.gamers.computer.shootMatrixAI.sort(this.compareRandom);
		},
		addShips (gamer) {
			gamer.field = emptyField();
			gamer.fleetSize = 0;
			gamer.fleet = [];


			fleetData.forEach((ship, i, arr) => {
				let shipsQuantity = ship.quantity;

				gamer.fleetSize += ship.quantity * ship.size;

				if (ship.size == 4) {
					this.createShip(gamer, ship, this.createCoordinates(ship.size));
				} else {
					while (shipsQuantity) {
						var coords = this.createCoordinates(ship.size);
						if (this.checkEmptyCell(gamer, ship, coords)) {
							this.createShip(gamer, ship, coords);
							shipsQuantity--
						}
					}
				}
			});
		},
		createCoordinates(n) {
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
			var row = coords.row,
					col = coords.col,
					direction = coords.direction;

			if (direction == 1) {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row], (col + i), ship.size);
				}
			} else {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row + i], col, ship.size);
				}
			}

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
			if (this.random(1, 1) == 1) {
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
		userShot (row, col, value) {

			if (!this.isComputerTurn) {
				if (value > 0) {
					this.$set(row, col, -3);
					this.checkFinishGame(this.gamers.computer);
				} else {
					this.$set(row, col, -1);
					this.isComputerTurn = true;

					this.serviceMessage = 'Промах';
					
					setTimeout(() => {
						this.computerShot();
					}, 500);
					
				}
			}
		},
		computerShot() {
			if (this.gamers.computer.luckyShots !== '') {
				this.computerAfterResultativeShot();
			} else {
				let row = this.random(1, 10),
						col = this.random(1, 10),
						value = this.gamers.user.field[row][col];


				if (value > 0) {
						this.$set(this.gamers.user.field[row], col, -3);
						
						this.$set(this.gamers.user.field[row + 1], (col + 1), -1);
						this.$set(this.gamers.user.field[row + 1], (col - 1), -1);
						this.$set(this.gamers.user.field[row - 1], (col + 1), -1);
						this.$set(this.gamers.user.field[row - 1], (col - 1), -1);

						this.serviceMessage = 'Компьютер попал';
						this.checkFinishGame(this.gamers.user);
						this.setLuckyShots(row, col);
						this.gamers.computer.luckyShots.totalHits++;
				} else if (value <= -1) {
					this.computerShot();
				} else {
					this.$set(this.gamers.user.field[row], col, -1);
					this.isComputerTurn = false;
					this.serviceMessage = 'Компьютер промазал';
				}
			}
		},
		computerAfterResultativeShot () {

		},
		checkFinishGame (gamer) {
			gamer.fleetSize--;

			if (gamer.fleetSize === 0) {
				this.gameSteps.isFinished = true;
				if (gamer == 'user') {
					this.serviceMessage = 'Вы проиграли'
				} else {
					this.serviceMessage = 'Вы выиграли'
				}
			}
		},
		exitGame () {
			if (!this.gameSteps.isFinished) {
				this.serviceMessage = 'Вы проиграли'
			}
		},
		setLuckyShots (col, row) {
			this.gamers.computer.luckyShots = {
				totalHits: 0,
				firstHit: {},
				nextHit: {},
				kx: 0,
				ky: 0
			};
		}
	}
});