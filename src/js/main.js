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
			},
			user: {}
		},
		gameSteps: {
			newGame: false,
			isChoiced: false,
			fractionIsChoiced: false,
			personsIsChoiced: false,
			isStarting: false,
			isFinished: false
		},
		fractions: [
			{
				id: 'pirates',
				persons: ['jack', 'elizabeth', 'barbossa', 'turner'],
				name: 'Пираты Карибского моря',
				pharses: {
					slip: ['Черт побери!', 'Повезет в следующий раз...', 'Промах.'],
					hitting: ['Есть!', 'Пора отпраздновать это!', 'Удача на нашей стороне! Враг вот вот дрогнет! Стреляйте!']
				}
			},
			{
				id: 'company',
				persons: ['beckett', 'jones'],
				name: 'Ост-Индская торговая компания',
				pharses: {
					slip: ['Наводчикам надо стараться усерднее', 'Кому-то придется продлить службу ещё на 10 лет', 'Досада!'],
					hitting: ['Попадание зафиксировано. Нам нужен ещё один точный выстрел.', 'Наша эскадра непотляема! Огонь из всех орудий!', 'Готовьсь! Цельсь! Пли!']
				}
			}
		]
	},
	beforeMount() {
		for (let gamer in this.gamers) {
			this.$set(this.gamers[gamer], 'field', emptyField());
			this.$set(this.gamers[gamer], 'fleetSize', 0);
			this.$set(this.gamers[gamer], 'isWinner', false);
			this.$set(this.gamers[gamer], 'serviceMessage', '');
			this.$set(this.gamers[gamer], 'turn', false);
			this.$set(this.gamers[gamer], 'fraction', '');
			this.$set(this.gamers[gamer], 'person', '');
			this.$set(this.gamers[gamer], 'luckyShots', {
					totalHits: 0,
					firstHit: [],
					nextHit: [],
					kx: 0,
					ky: 0
				});
		}

		for (let i = 0; i < this.fractions.length; i++) {
			this.$set(this.fractions[i], 'isActive', false);
		}
	},
	methods: {
		newGame () {
			for (let key in this.gamers) {
				this.addShips(this.gamers[key]);
			}
			this.gameSteps.newGame = true;
		},
		fractionChoice(fraction, index) {
			let user = this.gamers.user,
					comp = this.gamers.computer;

		for (let i = 0; i < this.fractions.length; i++) {
			this.fractions[i].isActive = false;
			if (i != index) {
				comp.fraction = this.fractions[i].id;
			}
		}


			fraction.isActive = true;

			user.fraction = fraction.id;

			this.gameSteps.fractionIsChoiced = true;
		},
		personChoice(fraction, person) {
			let user = this.gamers.user,
					comp = this.gamers.computer;

			this.gameSteps.personsIsChoiced = true;
		},
		startGame () { 
			if (this.random(0, 1) == 1) {
				this.gamers.computer.turn = false;
			}

			if (this.gamers.computer.turn) {
				this.gamers.computer.serviceMessage = 'Я хожу первым';
				setTimeout(() => {
					this.computerShot();
				}, 2000);
			} else {
				this.gamers.user.turn = true;
				this.gamers.user.serviceMessage = 'Капитан, наши корабли уже на позиции! Стреляйте!';
			}

			this.$set(this.gameSteps, 'isStarting', true);
		},
		exitGame () {
			if (!this.gameSteps.isFinished) {
				this.serviceMessage = 'Вы проиграли'
			}
		},
		shuffleShips () {
			this.addShips(this.gamers.user);
		},
		random(min, max) {
			var rand = min - 0.5 + Math.random() * (max - min + 1)
					rand = Math.round(rand);
					return rand;
		},
		addShips (gamer) {
			gamer.field = emptyField();
			gamer.fleetSize = 0;


			fleetData.forEach((ship, i, arr) => {
				let shipsQuantity = ship.quantity,
						id;

				gamer.fleetSize += ship.quantity * ship.size;

				if (ship.size == 4) {
					this.createShip(gamer, ship, this.createCoordinates(4));
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
			let coords = {};
			coords.direction = Math.abs(this.random(0, 1));

			if (coords.direction == 1) {
					coords.row = this.random(1, 10);
					coords.col = this.random(1, 10 - n);
				} else {
					coords.row = this.random(1, 10 - n);
					coords.col = this.random(1, 10);
				}

			return coords;
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
					cls = '';

			if (gamer == this.gamers.user) {
				switch (ship.size) {
					case 4:
					cls = 'large';
					break;
					case 3:
					cls = 'big';
					break;
					case 2:
					cls = 'medium';
					break;
					case 1:
					cls = 'small';
					break; 
				}
			}

			if (direction == 1) {
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row], (col + i), {value: ship.size, class: cls, index: i, direction: direction});
				}
			} else {
				cls = cls + ' vertical';
				for (let i = 0; i < ship.size; i++) {
					this.$set(gamer.field[row + i], col, {value: ship.size, class: cls, index: i, direction: direction});
				}
			}
		},
		computerShot() {
			let user = this.gamers.user,
					comp = this.gamers.computer,
					coords = this.getCoordinateForShoot(),
					row = coords[0],
					col = coords[1],
					luckyShots = comp.luckyShots,
					value = user.field[row][col].value,
					index = user.field[row][col].index;


			if (value > 0) {
				// Кидаем клетки исключения
				this.setExceptionsCells(user, row, col);
				// Проверяем не кончились корабли противника
				this.checkFinishGame(user);

				luckyShots.totalHits++;

				if (index == 0) {
					luckyShots.x0 = col;
					luckyShots.y0 = row;
				}

				if (luckyShots.kx == 0 && luckyShots.ky == 0) {
							// Добавляем в счастливые выстрелы первое попадание
					if (Object.keys(luckyShots.firstHit).length === 0) {
						luckyShots.firstHit = [row, col];
					} else {
							// Добавляем в счастливые выстрелы второе попадание
						luckyShots.nextHit = [row, col]

						luckyShots.ky = (Math.abs(luckyShots.firstHit[0] - luckyShots.nextHit[0]) == 1) ? 1 : 0;
						luckyShots.kx = (Math.abs(luckyShots.firstHit[1] - luckyShots.nextHit[1]) == 1) ? 1 : 0;

					}
					
				}

				if (luckyShots.totalHits >= value) {
					this.killShip(comp, user, row, col, value);
				} else {
					comp.serviceMessage = 'Попадание';
					this.setShootMatrixAround(row, col);
				}

				this.$set(user.field[row], col, {value: -3, class: 'cross'});

				if (!this.gameSteps.isFinished) {
					setTimeout(() => {
						this.computerShot();
					}, 2000);
				}

			} else if (value <= -1) {
				this.computerShot();
			} else {
				this.$set(user.field[row], col, {value: -1, class: 'slip'});
				setTimeout(() => {
					comp.turn = false;
					user.turn = true;
				}, 1000);
				comp.serviceMessage = 'Промах';
			}
		},
		userShot (row, col, info) {
			let value = info.value,
					direction = info.direction,
					index = info.index,
					comp = this.gamers.computer,
					user = this.gamers.user;

			if (user.turn) {
				if (value > 0) {
					if (direction == 1) {
						user.luckyShots.ky = 0;
						user.luckyShots.kx = 1;
					} else {
						user.luckyShots.ky = 1;
						user.luckyShots.kx = 0;
					}

					if (this.checkLifeCellsOfShip(user, comp, row, col)) {

						user.luckyShots.x0 = col - index * user.luckyShots.kx;
						user.luckyShots.y0 = row - index * user.luckyShots.ky;
						user.luckyShots.totalHits = value;

						this.killShip(user, comp, row, col, value);

					} else {
						user.serviceMessage = 'Попадание';
					}

					this.$set(comp.field[row], col, {value: -3, class: 'cross'});
					this.checkFinishGame(comp);
					this.setExceptionsCells(comp, row, col);

				} else {
					this.$set(comp.field[row], col, {value: -1, class: 'slip'});
					comp.turn = true;
					user.turn = false;

					this.gamers.user.serviceMessage = 'Промах';

					setTimeout(() => {
						this.computerShot();
					}, 500);
					
				}
			}
		},
		checkLifeCellsOfShip(user, enemy, row, col) {
			let noLivingCells = true,
					shipSize = enemy.field[row][col].value,
					index = enemy.field[row][col].index,
					kx = user.luckyShots.kx,
					ky = user.luckyShots.ky,
					y0 = row - (index*ky),
					x0 = col - (index*kx);

			if (shipSize > 1) {
				for (let i = 0; i < shipSize; i++) {
					if (y0 + i * ky == row && x0 + i * kx == col) continue;
					if (enemy.field[y0 + i * ky][x0 + i * kx].value > 0) {
						noLivingCells = false;
						break;
					}
				}
			}

			return noLivingCells;
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
			let data = {value: -2, class: 'fill'};

			if(enemy.field[row + 1][col + 1] == '') {
				this.$set(enemy.field[row + 1], (col + 1), data);
			}
			if(enemy.field[row + 1][col - 1] == '') {
				this.$set(enemy.field[row + 1], (col - 1), data);
			}
			if(enemy.field[row - 1][col + 1] == '') {
				this.$set(enemy.field[row - 1], (col + 1), data);
			}
			if(enemy.field[row - 1][col - 1] == '') {
				this.$set(enemy.field[row - 1], (col - 1), data);
			}
		},
		setShootMatrixAround(row, col) {
			var computer = this.gamers.computer,
					user = this.gamers.user;

			// корабль расположен вертикально
			if (row > 1 && computer.luckyShots.kx == 0) computer.shootMatrixAround.push([row - 1, col]);
			if (row < 10 && computer.luckyShots.kx == 0) computer.shootMatrixAround.push([row + 1, col]);
			// корабль расположен горизонтально
			if (col > 1 && computer.luckyShots.ky == 0) computer.shootMatrixAround.push([row, col - 1]);
			if (col < 10 && computer.luckyShots.ky == 0) computer.shootMatrixAround.push([row, col + 1]);

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
		oneDeksShipKill(enemy, row, col) {
			let data = {value: -2, class: 'fill'};

			if (enemy.field[row + 1][col] == '') {
				this.$set(enemy.field[row + 1], (col), data);
			}

			if (enemy.field[row - 1][col] == '') {
				this.$set(enemy.field[row - 1], (col), data);
			}

			if (enemy.field[row][col + 1] == '') {
				this.$set(enemy.field[row], (col + 1), data);
			}

			if (enemy.field[row][col - 1] == '') {
				this.$set(enemy.field[row], (col - 1), data);
			}
		},
		killShip(user, enemy, row, col, value) {
			var col1, row1, col2, row2;

			if (value == 1) {
				this.oneDeksShipKill(enemy, row, col);
			} else {
				row1 = user.luckyShots.y0 - user.luckyShots.ky;
				col1 = user.luckyShots.x0 - user.luckyShots.kx;
				row2 = user.luckyShots.y0 + user.luckyShots.ky * user.luckyShots.totalHits;
				col2 = user.luckyShots.x0 + user.luckyShots.kx * user.luckyShots.totalHits;


				if (enemy.field[row1][col1] == '') {
					this.$set(enemy.field[row1], col1, {value: -2, class: 'fill'});
				}
				
				if (enemy.field[row2][col2] == '') {
					this.$set(enemy.field[row2], col2, {value: -2, class: 'fill'});
				}
			}

			user.serviceMessage = 'Мы отправили их корабль на корм рыбам';

			this.resetLuckyShots(user);
		},
		checkFinishGame (gamer) {
			gamer.fleetSize--;

			if (gamer.fleetSize === 0) {
				this.gameSteps.isFinished = true;
				if (this.gamers.user.turn) {
					this.gamers.user.serviceMessage = 'Мы выиграли';
				} else {
					this.gamers.user.serviceMessage = 'Мы проиграли';
				}
			}
		},
		resetLuckyShots (user) {
			user.luckyShots = {
				totalHits: 0,
				firstHit: [],
				nextHit: [],
				kx: 0,
				ky: 0,
				x0: '',
				y0: ''
			};
		}
	}
});