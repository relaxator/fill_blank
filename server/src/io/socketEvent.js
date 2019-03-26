var validation = require("../utils/validation");
var util = require("../utils/util");
var games = [];
var questions = [
	"La chose la plus petite que j'ai vu, c'est ____",
	"Si l'un d'entre vous devait être une licorne, qui serait cette personne ?",
	"Votre devise favorite.",
	"Un nom accrocheur pour une banque de sperme.",
	"Une mauvaise raison d'appeller le 911.",
	"Un bon nom pour un robot sexuel.",
	"Un bon signe qui indique que votre maison est hantée.",
	"une attraction touristique en enfer.",
	"Le tweet d'un homme préhistorique.",
	"Un animal que Noé n'aurait pas dû sauver.",
	"Si tu ne réussis pas du premier coup, ...",
	"Donne un nom à cette toute nouvelle MST."
];

exports = module.exports = function(io) {
	io.on("connection", function(socket) {
		socket.on("join", params => {
			var err = {};

			if (validation.isRealString(params.Pseudo)) {
				if (games.length > 0) {
					for (var i in games) {
						if (games[i].room_id === params.gameName) {
							if (games[i].active === false) {
								if (games[i].password === params.gamePassword) {
									if (games[i].host.id !== params.Pseudo) {
										if (games[i].players.length > 0) {
											for (var y in games[i].players) {
												if (
													games[i].players[y].id ===
													params.Pseudo
												) {
													err.pseudo =
														"Pseudo déjà pris.";
													break;
													// send error message pseudo identique
												} else {
													socket.join(
														params.gameName
													);
													socket.pseudo =
														params.Pseudo;
													socket.room =
														params.gameName;
													socket.isHost = false;
													games[i].players.push({
														id: params.Pseudo,
														answers: [],
														score: 0
													});
													socket.emit(
														"GameJoin",
														games[i],
														params.Pseudo
													);
													break;
												}
											}
										} else {
											socket.join(params.gameName);
											socket.pseudo = params.Pseudo;
											socket.room = params.gameName;
											socket.isHost = false;
											games[i].players.push({
												id: params.Pseudo,
												answers: [],
												score: 0
											});
											socket.emit(
												"GameJoin",
												games[i],
												params.Pseudo
											);
										}
									} else {
										err.pseudo = "Pseudo déjà pris.";
									}
								} else {
									err.password = "wrong password";
								}
							} else {
								err.active = "La partie est déjà en cours.";
							}
						} else {
							err.room = "Aucune partie ne posséde cet id";
						}
					}
				} else {
					err.active = "Il n'y a aucune partie en cours";
				}
			} else {
				err.pseudo = "Vous devez préciser un Pseudo valide";
			}

			if (err) {
				socket.emit("createError", err);
			}
		});

		socket.on("create", params => {
			var username = !!params.Pseudo;
			if (!username) {
				var err = {};
				err.pseudo = "vous devez utiliser un Pseudo !";
				socket.emit("createError", err);
			} else {
				var room_id = util.makeId(games);

				socket.room = room_id;
				socket.pseudo = params.Pseudo;
				socket.isHost = true;

				games.push({
					room_id: room_id,
					active: false,
					round: 1,
					votes: [],
					password: params.gamePassword,
					host: { id: params.Pseudo, answers: [], score: 0 },
					players: [],
					group: []
				});

				for (var i in games) {
					if (games[i].room_id === room_id) {
						socket.join(room_id);
						socket.emit("GameCreated", games[i]);
					}
				}
			}
		});

		socket.on("GameWait", room => {
			// socket.to(room).emit("GameReady");

			var players = [];
			var Question = questions.slice(0);
			var GroupQuestion = [];
			var zgame;

			for (var i in games) {
				if (games[i].room_id === room) {
					// games[i].active = true;
					zgame = games[i];
					players.push(games[i].host);
					games[i].active = true;
					if (games[i].players.length > 0) {
						for (var y in games[i].players) {
							players.push(games[i].players[y]);
						}
					}
				}
			}

			if (players.length > 1) {
				var group = pairs(players);
				Question = util.shuffle(Question);
				GroupQuestion = Question.slice(0, players.length);

				for (i in games) {
					if (games[i].room_id === room) {
						for (var j in group) {
							games[i].group.push(group[j]);
						}
					}
				}
			} else {
			}

			io.of("/")
				.in(room)
				.emit("GameReady", GroupQuestion, group, zgame);

			function pairs(player) {
				let pair = [];
				let playercopy = [...player];

				for (let x of player) {
					var y = random(playercopy);

					while (x.id === y.id) {
						if (playercopy.length === 1) {
							pairs(player);
							break;
						} else {
							y = random(playercopy);
						}
					}

					for (var i in playercopy) {
						if (playercopy[i] === y) {
							playercopy.splice(i, 1);
						}
					}
					pair.push([x.id, y.id]);
				}

				return pair;
			}

			function random(player) {
				let rand = Math.floor(Math.random() * player.length);
				return player[rand];
			}
		});

		socket.on("playerList", room => {
			const list = [];

			for (var i in games) {
				if (games[i].room_id === room) {
					list.push(games[i].host.id);
					for (var y in games[i].players) {
						list.push(games[i].players[y].id);
					}
				}
			}

			io.to(room).emit("GamePlayer", list);
		});

		socket.on("isHost", fn => {
			fn(socket.isHost);
		});

		socket.on("sendAnswer", (room, answer, pseudo) => {
			let game;
			let reponse = answer;

			for (var i in games) {
				if (games[i].room_id === room) {
					game = games[i];
					if (games[i].host.id === pseudo) {
						games[i].host.answers.push(reponse);
						break;
					} else {
						for (var j in games[i].players) {
							if (games[i].players[j].id === pseudo) {
								games[i].players[j].answers.push(reponse);

								break;
							}
						}
					}
				}
			}

			//update view on game, send answer when everyone is ready

			let nbplayer = [];
			for (var i in games) {
				if (games[i].room_id === room) {
					nbplayer.push(games[i].host.id);
					for (var j in games[i].players) {
						nbplayer.push(games[i].players.id);
					}
				}
			}

			let nbanswers = [];

			for (var i in games) {
				if (games[i].room_id === room) {
					if (games[i].host.answers.length > 0) {
						if (games[i].host.answers[0].answer.length === 2) {
							nbanswers.push("oui");
						}
					}

					for (var j in games[i].players) {
						if (games[i].players[j].answers.length > 0) {
							if (
								games[i].players[j].answers[0].answer.length ===
								2
							) {
								nbanswers.push("oui");
							} else {
							}
						}
					}
				}
			}

			if (nbplayer.length === nbanswers.length) {
				// passage aux votes
				io.to(room).emit("startVote", game);
			}

			// io.to(room).emit("updatePlayerList", pseudo);
		});

		socket.on("disconnect", reason => {
			var list = [];
			var room = socket.room;

			for (var i in games) {
				if (games[i].room_id === socket.room) {
					list.push(games[i].host.id);
					if (socket.isHost === true) {
						games.splice(games.indexOf(games[i], 1));
						io.to(socket.room).emit("hostKill");
					} else {
						for (var y in games[i].players) {
							if (games[i].players[y].id === socket.pseudo) {
								games[i].players.splice(
									games[i].players.indexOf(
										games[i].players[y]
									),
									1
								);
							} else {
								if (
									games[i].players.length === 0 ||
									games[i].players[y] === "undefined"
								) {
									io.to(socket.room).emit("hostKill");
								} else {
									list.push(games[i].players[y].id);
								}
							}
						}
					}
				}
			}

			if (list.length > 1) {
				io.to(room).emit("GamePlayer", list);
			} else {
				io.to(socket.room).emit("hostKill");
			}
		});

		socket.on("userVote", (room, pseudo) => {
			var nbjoueur = 1;
			var game;

			var scoreAffichage = [];

			for (var i in games) {
				if (games[i].room_id === room) {
					game = games[i];

					if (games[i].host.id === pseudo) {
						games[i].host.score = games[i].host.score + 1;

						games[i].votes.push({
							pseudo: pseudo
						});
					}

					for (var j in games[i].players) {
						nbjoueur = nbjoueur + 1;

						if (games[i].players[j].id === pseudo) {
							games[i].players[j].score =
								games[i].players[j].score + 1;

							games[i].votes.push({
								pseudo: pseudo,
								score: 1
							});
						}
					}
				}
			}

			for (var k in games) {
				if (games[k].room_id === room) {
					if (games[k].votes.length === nbjoueur) {
						scoreAffichage = games[k].votes;
						games[k].votes = [];

						io.to(room).emit("showVote", scoreAffichage);
					}
				}
			}
		});

		socket.on("gameEnd", room => {
			for (var i in games) {
				if (games[i].room_id === room) {
					io.to(room).emit("NextRound", games[i]);
				}
			}
		});

		socket.on("gameContinue", room => {
			var players = [];
			var Question = questions.slice(0);
			var GroupQuestion = [];

			for (var i in games) {
				if (games[i].room_id === room) {
					games[i].host.answers = [];
					games[i].group = [];
					players.push(games[i].host);

					for (var j in games[i].players) {
						games[i].players[j].answers = [];
						players.push(games[i].players[j]);
					}
				}
			}

			if (players.length > 1) {
				var group = pairs(players);
				Question = util.shuffle(Question);
				GroupQuestion = Question.slice(0, players.length);

				for (i in games) {
					if (games[i].room_id === room) {
						for (var j in group) {
							games[i].group.push(group[j]);
						}
					}
				}
			} else {
			}

			io.to(room).emit("gameRestart", GroupQuestion, group);

			function pairs(player) {
				let pair = [];
				let playercopy = [...player];

				for (let x of player) {
					let y = random(playercopy);

					while (x.id === y.id) {
						if (playercopy.length === 1) {
							pairs(player);
							break;
						} else {
							y = random(playercopy);
						}
					}

					for (var i in playercopy) {
						if (playercopy[i] === y) {
							playercopy.splice(i, 1);
						}
					}
					pair.push([x.id, y.id]);
				}

				return pair;
			}

			function random(player) {
				let rand = Math.floor(Math.random() * player.length);
				return player[rand];
			}
		});

		socket.on("gameCompleted", (room, pseudo) => {
			for (var i in games) {
				if (games[i].room_id === room) {
					games.splice(i, 1);
				}
			}

			io.to(room).emit("hostKill");
		});
	});
};
