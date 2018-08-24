import './vendor';
import Vue from 'vue/dist/vue';
import emptyField from './vendor/empty-field-create';
import fleetData from './vendor/fleet';

var app = new Vue({
	el: '#app',
	data: {
		gamers: {
			computer: {
				shootMatrixAround: [],
				shootMatrixAiming: [],
				// shootMatrixAI: [],
				// shootMatrix: emptyField(),
				luckyShots: {
					totalHits: 0,
					firstHit: [],
					nextHit: [],
					kx: 0,
					ky: 0
				}
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
			this.$set(this.gamers[gamer], 'fleet', Object);
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
				let shipsQuantity = ship.quantity,
						id;

				gamer.fleetSize += ship.quantity * ship.size;

				if (ship.size == 4) {
					this.createShip(gamer, {size: ship.size, id: ship.id}, this.createCoordinates(ship.size));
				} else {
					while (shipsQuantity) {
						var coords = this.createCoordinates(ship.size);
						if (this.checkEmptyCell(gamer, ship, coords)) {
							this.createShip(gamer, {size: ship.size, id: ship.id + shipsQuantity}, coords);
							this.$set(gamer.fleet, ship.id + shipsQuantity, ship.size);
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
						if (gamer.field[row - 1][col + i] !== '' || gamer.field[row][col + i] !== '' || gamer.field[row + 1][col + i] !== '') {
							isAvailable = false;
							break;
						}
					}
				} else {
					for (let i = -1; i < ship.size + 1; i++) {
						if (gamer.field[row + i][col + 1] !== '' || gamer.field[row + i][col] !== '' || gamer.field[row + i][col - 1] !== '') {
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
					direction = coords.direction,
					coords = [];

			if (direction == 1) {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row], (col + i), {value: ship.size, id: ship.id});
					coords.push([row, col + i]);
				}
			} else {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row + i], col, {value: ship.size, id: ship.id});
					coords.push([row, col + i]);
				}
			}

			// gamer.fleet.push({
			// 	id: ship.id,
			// 	size: ship.size,
			// 	isAlive: true,
			// 	isAliveDecks: ship.size,
			// });

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
		userShot (row, col, info) {
			let value = info.value,
					computer = this.gamers.computer;


			if (!this.isComputerTurn) {
				if (value > 0) {
					this.$set(computer.field[row], col, {value: -3});
					this.checkFinishGame(computer);
					this.setExceptionsCells(computer, row, col);
				} else {
					this.$set(computer.field[row], col, {value: -1});
					this.isComputerTurn = true;

					this.serviceMessage = 'Промах';
					
					setTimeout(() => {
						this.computerShot();
					}, 500);
					
				}
			}
		},
		getCoordinateForShoot() {
			let computer = this.gamers.computer,
					coords;

			if (computer.shootMatrixAround.length > 0) {
				coords = computer.shootMatrixAround.pop();
			} else {
				coords = [this.random(1, 10), this.random(1, 10)];
			}
			return coords;
		},
		setExceptionsCells(enemy, row, col) {
			this.$set(enemy.field[row + 1], (col + 1), {value: -2});
			this.$set(enemy.field[row + 1], (col - 1), {value: -2});
			this.$set(enemy.field[row - 1], (col + 1), {value: -2});
			this.$set(enemy.field[row - 1], (col - 1), {value: -2});
		},
		setShootMatrixAround(row, col) {
			var computer = this.gamers.computer,
					user = this.gamers.user;

			// корабль расположен вертикально
			if (row > 1 && computer.luckyShots.ky == 0) computer.shootMatrixAround.push([row - 1, col]);
			if (row < 10 && computer.luckyShots.ky == 0) computer.shootMatrixAround.push([row + 1, col]);
			// корабль расположен горизонтально
			if (col > 1 && computer.luckyShots.kx == 0) computer.shootMatrixAround.push([row, col - 1]);
			if (col < 10 && computer.luckyShots.kx == 0) computer.shootMatrixAround.push([row, col + 1]);

			this.filterShootMatrixes(computer.shootMatrixAround);
		},
		filterShootMatrixes(matrix) {
			for (var i = matrix.length - 1; i >= 0; i--) {
				let x = matrix[i][0],
						y = matrix[i][1];

				if (this.gamers.user.field[x][y].value <= -1) {
					matrix.splice(i,1);
				}
			}
		},
		computerShot() {
			let user = this.gamers.user,
					comp = this.gamers.computer,
					coords = this.getCoordinateForShoot(),
					row = coords[0],
					col = coords[1],
					value = user.field[row][col].value;


			if (value > 0) {
					// Кидаем клетки исключения
					this.setExceptionsCells(user, row, col);
					// Проверяем не кончились корабли противника
					this.checkFinishGame(user);
					// Если корабль однопалубный топим его
					if (value === 1) {
						this.serviceMessage = 'Компьютер потопил ваш однопалубный корабль';
						this.$set(user.field[row], col, {value: -3});
						this.$set(user.field[row + 1], (col), {value: -1});
						this.$set(user.field[row], (col + 1), {value: -1});
						this.$set(user.field[row], (col - 1), {value: -1});
						this.$set(user.field[row - 1], (col), {value: -1});
						// Cтреляем повторно
						setTimeout(() => {
							this.computerShot();
						}, 1000)
						
					} else {
						this.serviceMessage = 'Компьютер попал';
						
						let shipId = user.field[row][col].id;

						for (let key in user.fleet) {
							if (user.fleet[key].id == shipId) {
								user.fleet[key].isAliveDecks--
								break;
							}
						}

						if (comp.luckyShots.kx == 0 && comp.luckyShots.ky == 0) {
								// Добавляем в счастливые выстрелы первое попадание
								if (Object.keys(comp.luckyShots.firstHit).length === 0) {
									comp.luckyShots.firstHit = [row, col];
									
								} else {
									// Добавляем в счастливые выстрелы второе попадание
									comp.luckyShots.nextHit = [row, col]

									comp.luckyShots.kx = (Math.abs(comp.luckyShots.firstHit[0] - comp.luckyShots.nextHit[0]) == 1) ? 1 : 0;
									comp.luckyShots.ky = (Math.abs(comp.luckyShots.firstHit[1] - comp.luckyShots.nextHit[1]) == 1) ? 1 : 0;
							}
						}

						this.setShootMatrixAround(row, col);

						this.$set(user.field[row], col, {value: -3});

						setTimeout(() => {
							this.computerShot();
						}, 2000)
					}
			} else if (value <= -1) {
				this.computerShot();
			} else {
				this.$set(user.field[row], col, {value: -1});
				this.isComputerTurn = false;
				this.serviceMessage = 'Компьютер промазал';
			}
		},
		maxShipsSizeOfEnemy(gamer) {
			var size;

			for (let i = 0; i < gamer.fleet.length; i++) {
				if (gamer.fleet[i].isAlive) {
					size = gamer.fleet[i].size;
					break
				}
			}

			return size;
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
		resetLuckyShots () {
			this.gamers.computer.luckyShots = {
				totalHits: 0,
				firstHit: [],
				nextHit: [],
				kx: 0,
				ky: 0
			};
		}
	}
});