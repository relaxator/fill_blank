module.exports = {
	shuffle: function(Q) {
		for (var x = Q.length - 1; x > 0; x--) {
			let y = Math.floor(Math.random() * (x + 1));
			var dump = Q[x];
			Q[x] = Q[y];
			Q[y] = dump;
		}
		return Q;
	},
	makeId: function (games) {
					var id = "";
					for (var i = 0; i < 4; i++) {
						id += Math.floor(Math.random() * 9);
					}
					for (var i in games) {
						if (games[i].room_id === id) {
							makeId();
						}
					}
					return id;
				}
};

return module.exports;
