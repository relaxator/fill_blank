import React from "react";
import { Card, Button, Header, Form, Message } from "semantic-ui-react";

class VoteForm extends React.Component {
	state = {
		display: [],
		success: false,
		tempPseudo: "",
		disable: false,
		game: [],
		tours: "",
		hidden: true,
		cardDroite: "",
		cardGauche: "",
		fin: {
			hidden: true,
			message: ""
		}
	};

	componentDidMount() {
		const { socket, ScoreCount } = this.props;

		socket.on("showVote", scr => {

			this.setState({
				hidden: false
			});

			var display = this.state.display;

			var j1 = 0,
				j2 = 0;
			var winner = "green",
				looser = "red";
			var fin;

			for (var i in scr) {
				if (scr[i].pseudo === display[0].pseudo) {
					j1 = j1 + 1;
				}
				if (scr[i].pseudo === display[1].pseudo) {
					j2 = j2 + 1;
				}
			}

			if (j1 > j2) {
				fin = {
					hidden: false,
					message: display[0].pseudo + " a remporté le plus de vote !"
				};
				this.setState({
					cardDroite: winner,
					cardGauche: looser,
					fin: fin
				});
			}
			if (j1 < j2) {
				fin = {
					hidden: false,
					message: display[1].pseudo + " a remporté le plus de vote !"
				};
				this.setState({
					cardGauche: winner,
					cardDroite: looser,
					fin: fin
				});
			}

			if (j1 === j2) {
				fin = {
					hidden: false,
					message: "Les joueurs ont fait une égalité !"
				};
				this.setState({
					fin: fin
				});
			}

			setTimeout(function() {
				ScoreCount();
			}, 4000);
		});
	}

	componentWillMount() {
		var game = this.props.game;
		var group = this.props.group;
		var tours = this.props.tours;
		var answ;
		var q;
		var pseudo;
		var display = [];

		for (var j in group[tours]) {
			if (group[tours][j] === game.host.id) {
				pseudo = game.host.id;

				q = game.host.answers[0].question[0];
				game.host.answers[0].question.splice(0, 1);

				answ = game.host.answers[0].answer[0];
				game.host.answers[0].answer.splice(0, 1);

				display.push({
					answer: answ,
					question: q,
					pseudo: pseudo
				});
			} else {
				for (var i in game.players) {
					if (group[tours][j] === game.players[i].id) {
						pseudo = game.players[i].id;

						q = game.players[i].answers[0].question[0];
						game.players[i].answers[0].question.splice(0, 1);

						answ = game.players[i].answers[0].answer[0];
						game.players[i].answers[0].answer.splice(0, 1);

						display.push({
							answer: answ,
							question: q,
							pseudo: pseudo
						});
					}
				}
			}
		}

		this.setState({
			display: display,
			game: game,
			tours: tours
		});
	}

	componentDidUpdate(prevProps, prevState) {
		// Next turn

		var fin = {
			hidden: true,
			message: ""
		};

		var game = this.props.game;
		var group = this.props.group;
		var tours = this.props.tours;
		var answ;
		var q;
		var pseudo;
		var display = [];

		if (prevProps.tours !== this.props.tours) {
			this.setState({
				tours: tours,
				disable: false,
				success: false,
				hidden: true,
				fin: fin,
				cardDroite: "",
				cardGauche: ""
			});

			for (var j in group[tours]) {
				if (group[tours][j] === game.host.id) {
					pseudo = game.host.id;

					q = game.host.answers[0].question[0];
					game.host.answers[0].question.splice(0, 1);

					answ = game.host.answers[0].answer[0];
					game.host.answers[0].answer.splice(0, 1);

					display.push({
						answer: answ,
						question: q,
						pseudo: pseudo
					});
				} else {
					for (var i in game.players) {
						if (group[tours][j] === game.players[i].id) {
							pseudo = game.players[i].id;

							q = game.players[i].answers[0].question[0];
							game.players[i].answers[0].question.splice(0, 1);

							answ = game.players[i].answers[0].answer[0];
							game.players[i].answers[0].answer.splice(0, 1);

							display.push({
								answer: answ,
								question: q,
								pseudo: pseudo
							});
						}
					}
				}
			}

			this.setState({
				display: display
			});
		}
	}

	handleClick = pseudo => {
		this.setState({ tempPseudo: pseudo });
	};

	handleSubmit = () => {
		const { socket } = this.props;

		this.setState({
			success: true,
			disable: true
		});

		var game = this.state.game;

		socket.emit("userVote", game.room_id, this.state.tempPseudo);
	};

	componentWillUnmount() {
		const { socket } = this.props;
		socket.removeListener("userVote");
		socket.removeListener("showVote");
	}

	render() {
		const {
			display,
			cardDroite,
			cardGauche
		} = this.state;

		

		return (
			<Form
				success={this.state.success}
				style={{
					display: "flex",
					justifyContent: "space-around",
					height: "100%",
					flexFlow: "column"
				}}
			>
				<Header size="huge">{display[0].question}</Header>
				<Card.Group centered>
					<Card style={{ backgroundColor: cardDroite }}>
						<Card.Content>
							<Card.Header>
								<Message hidden={this.state.hidden}>
									{display[0].pseudo}
								</Message>
							</Card.Header>
							<Card.Description>
								{display[0].answer}
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<div className="ui two buttons">
								<Button
									fluid
									color="green"
									onClick={() =>
										this.handleClick(display[0].pseudo)
									}
									disabled={this.state.disable}
								>
									Voter
								</Button>
							</div>
						</Card.Content>
					</Card>
					<Card style={{ backgroundColor: cardGauche }}>
						<Card.Content>
							<Card.Header>
								<Message hidden={this.state.hidden}>
									{display[1].pseudo}
								</Message>
							</Card.Header>
							<Card.Description>
								{display[1].answer}
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<div className="ui two buttons">
								<Button
									fluid
									color="green"
									onClick={() =>
										this.handleClick(display[1].pseudo)
									}
									disabled={this.state.disable}
								>
									Voter
								</Button>
							</div>
						</Card.Content>
					</Card>
				</Card.Group>
				<Button
					onClick={this.handleSubmit}
					style={{ alignSelf: "center" }}
				>
					Confirmez votre vote !
				</Button>
				<Message
					success
					header="Vote envoyé !"
					hidden={!this.state.hidden}
					content="Votre vote a bien été pris en compte."
				/>
				<Message
					hidden={this.state.fin.hidden}
					header="Vote terminé !"
					content={this.state.fin.message}
				/>
			</Form>
		);
	}
}

export default VoteForm;
