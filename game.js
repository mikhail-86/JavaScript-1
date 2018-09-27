function random(min, max) {
	return Math.floor(Math.random() * (max-min)) + min;
};

var game = {
	size: 20,
	snake: [],
	food: {},
	foodCounter: 0,
	wall: [],
	direction: {
		row: -1,
		col: 0
	},
	createBoard: function () {  // создание поля
		console.log('create board');
		var table = document.createElement('table');
		table.classList.add('game-table');

		for ( var i = 0; i < this.size; i++ ) {
			var tr = document.createElement('tr');

			for ( var j = 0; j < this.size; j++ ) {
				td = document.createElement('td');
				td.classList.add('game-table-cell');
				td.setAttribute('id', 'cell-' + i + '-' + j);
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}

		document.getElementById('snake-field').appendChild(table);
	},
	createSnake: function () {  // создание змеи
		this.snake.push({row: 10, col: 10});
		this.snake.push({row: 11, col: 10});
		console.log('create snake');

	},
	render: function () {  // отрисовка элементов
		var elements = document.getElementsByTagName('td');
		for ( var i =0; i< elements.length; i++ ) {
			elements[i].classList.remove('snake-unit');
			elements[i].classList.remove('food-unit');
			elements[i].classList.remove('wall-unit');
		}
		for ( var i = 0; i < this.snake.length; i++) {
			var cell = this.snake[i];
			var id = 'cell-' + cell.row + '-' + cell.col;
			document.getElementById(id).classList.add('snake-unit');
		}

		if (this.food.row && this.food.col) {
			var id = 'cell-' + this.food.row + '-' + this.food.col;
			document.getElementById(id).classList.add('food-unit');
			document.getElementById('foodcounter').innerHTML = 'Количество съеденой еды: ' + this.foodCounter;
		}
		for ( var i = 0; i < this.wall.length; i++) {
			var cell = this.wall[i];
			if (cell.row && cell.col) {
				var id = 'cell-' + cell.row + '-' + cell.col;
				document.getElementById(id).classList.add('wall-unit');
			}
		}
	},
	isSnakeCell: function (row, col) { // проверка принадлежности ячейки змее
		for ( var i = 0; i < this.snake.length; i++) {
			var cell = this.snake[i];
			if (cell.row == row && cell.col == col) {
				return true;
			}
		}

		return false;
	},
	createFood: function () { // создание еды
		console.log('create food');
		var pool = [];
		for ( var i = 0; i < this.size; i++ ) {
			for ( var j = 0; j < this.size; j++ ) {
				if (!this.isSnakeCell (i, j)) {
					pool.push({row: i, col: j});
				}
			}
		}

		var index = random(0, pool.length);
		this.food = pool[index];
	},
	isFood: function (row, col) {
		var cell = this.food;
		if (cell.row == row && cell.col == col) {
			return true;
		}

	return false;
	},
	createWall: function () { // создание препятствий
		console.log('create wall');
		var pool = [];
		var wallQuantity = random(1,10);
		for ( var i = 0; i < this.size; i++ ) {
			for ( var j = 0; j < this.size; j++ ) {
				if (!this.isSnakeCell (i, j) || !this.isFood (i, j)) {
					pool.push({row: i, col: j});
				}
			}
		}

		for ( var i = 0; i < wallQuantity; i++) {
			var index = random(0, pool.length);
			this.wall[i] = pool[index];
		}
	},
	isWallCell: function (row, col) { // проверка принадлежности ячейки препятсвию
		for ( var i = 0; i < this.wall.length; i++) {
			var cell = this.wall[i];
				if (cell.row == row && cell.col == col) {
					return true;
				}
			}
		return false;
	},
	setEvents: function () {
		this.intervalID = setInterval(this.move.bind(this), 500);
		document.addEventListener('keydown', this.changeDirection.bind(this));
	},
	changeDirection: function (e) { // изменение направления движения змеи
		console.log(e.keyCode);
		switch ( e.keyCode ) {
			case 37:
				//left
				this.direction = {
					row: 0,
					col: -1
				}
				break;
			case 38:
				//up
				this.direction = {
					row: -1,
					col: 0
				}
				break;
			case 39:
				//right
				this.direction = {
					row: 0,
					col: 1
				}
				break;
				case 40:
					//downn
					this.direction = {
						row: 1,
						col: 0
					}
					break;
				default:
					break;

		}
	},
	checkCell: function (row, col) { // проверка принадлежности следующей ячейки змее и препятсвию
		//if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
		//	return false;
		//}

		if ( this.isSnakeCell (row, col) || this.isWallCell (row, col)) {
			return false;
		}

		return true;

	},
	over: function () { // завершение игры
		alert("Game over!");
		clearInterval(this.intervalId);
		location.reload(true);
	},
	move: function () { // движение змеи
		// смотрим направление движения
		// в зависимости от направления
		// определить голову змеи и создаем новую голову
		var row = this.snake[0].row + this.direction.row;
		var col = this.snake[0].col + this.direction.col;

		if (!this.checkCell(row, col)) {
			this.over();
		}
		if (row < 0) {
			row = this.size - 1;
		} else if (row >= this.size) {
			row = 0;
		} else if (col < 0) {
			col = this.size - 1;
		} else if (col >= this.size) {
			col = 0;
		}
		//добавляем элемент в начало - создаем новую голову
		this.snake.unshift({row: row, col: col});
		// удаляем элемент из хвоста змеи
		if (!this.food || this.food.row !== row || this.food.col !== col) {
			// еды нет
			this.snake.pop();
		} else {
			//еду съели
			++this.foodCounter;
			this.createFood();
			this.createWall();
		}

		this.render();
		console.log('move');
	},
	run: function () { // запуск игры
		console.log('run game!');
		this.createBoard();
		this.createSnake();
		this.render();
		this.createFood();
		this.createWall();
		this.setEvents();
	}
};

window.addEventListener('load', function() {
	game.run();
});
