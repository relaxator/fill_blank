import React from "react";
import PropTypes from "prop-types";
import {
	Container,
	Grid,
	Segment,
	Dimmer,
	List,
	Header,
	Menu,
	Button
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Game from "./Game";
import GameWait from "./GameWait";
import Vote from "./Vote";
import GameEnd from "./GameEnd";

let playerList;

class GameBoard extends React.Component {
	state = {
		room: "",
		pseudo: "",
		playerList: [],
		active: true,
		start: true,
		questions: [],
		group: [],
		updatePlayerList: "",
		vote: false,
		game: [],
		end: false,
		deconnexion: false
	};
	componentWillMount() {
		const { socket } = this.props;


		if (socket.pseudo) {
			var games = this.props.location.state.games;
			var id = this.props.location.state.id;
			if (socket.isHost) {
				this.setState({ room: games.room_id, pseudo: games.host.id });
			} else {
				for (var i in games.players) {
					if (games.players[i].id === id) {
						this.setState({
							room: games.room_id,
							pseudo: games.players[i].id
						});
					}
				}
			}

			if (games.active) {
				this.setState({ active: false });
			}
		} else {
			this.setState({ deconnexion: true });
		}
	}

	componentDidMount() {
		const { socket } = this.props;

		const room = this.state.room;
		if (socket.pseudo) {

			socket.emit("playerList", room);

			socket.on("GameReady", (questions, group, game) => {
				this.setState({
					active: false,
					start: true,
					questions: questions,
					group: group,
					game: game
				});
			});

			socket.on("updatePlayerList", pseudo => {
				this.setState(prevState => ({
					updatePlayerList: [...prevState.updatePlayerList, pseudo]
				}));
			});

			socket.on("startVote", game => {
				this.setState({
					vote: true,
					game: game
				});
			});

			socket.on("NextRound", game => {
				this.setState({
					end: true,
					vote: false,
					start: false,
					game: game
				});
			});

			socket.on("gameRestart", (questions, group) => {
				this.setState({
					start: true,
					end: false,
					questions: questions,
					group: group
				});
			});

			socket.on("GamePlayer", player => {
				this.setState({ playerList: player });
			});
		}

		socket.on("hostKill", () => {
			this.userDisconnect();
		});
	}

	componentWillUnmount() {
		const { socket } = this.props;
		socket.removeListener("GameReady");
		socket.removeListener("hostKill");
		socket.removeListener("playerList");
		socket.removeListener("gameCompleted");
		socket.removeListener("GamePlayer");
	}

	WaitSubmit = () => {

		const { socket } = this.props;
		socket.emit("GameWait", this.state.room);
	};

	userDisconnect = () => {
		const { socket } = this.props;

		for (var i in this.state.playerList) {
			if (this.state.playerList[i] === this.state.pseudo) {
				this.state.playerList.splice(this.state.playerList[i], 1);
			}
		}

		if (this.state.game !== "undefined") {

			if (this.state.playerList.length === 1) {
				socket.emit(
					"gameCompleted",
					this.state.room,
					this.state.pseudo
				);
			} else {
				if (this.state.game.host.id === this.state.pseudo) {
					socket.emit(
						"gameCompleted",
						this.state.room,
						this.state.pseudo
					);
				} else {
					socket.disconnect();
				}
			}
		}

		this.setState({
			deconnexion: true
		});

	};

	sendAnswer = answer => {
		// envoie les réponses aux servers et les ajoutes à la game à l'id du joueur
		const { socket } = this.props;
		let room = this.state.room;
		let pseudo = this.state.pseudo;
		socket.emit("sendAnswer", room, answer, pseudo);
	};

	gameContinue = () => {
		const { socket } = this.props;
		if (socket.isHost) {
			const { socket } = this.props;
			let room = this.state.room;
			socket.emit("gameContinue", room);
		}
	};

	render() {
		const { socket } = this.props;
		const { active, start, vote, end, deconnexion } = this.state;

		let gameBoard;
		if (!this.state.updatePlayerList) {
			playerList = (
				<Segment>
					<Header>Players list</Header>
					<List items={this.state.playerList} />
				</Segment>
			);
		} else {

			playerList = (
				<Segment>
					<Header>Players list</Header>
					<List items={this.state.playerList} />
					<span style={{ color: "green" }}>
						{this.state.updatePlayerList}
					</span>
				</Segment>
			);
		}

		if (active === true) {
			gameBoard = (
				<Container
					style={{
						minHeight: "700px",
						backgroundColor: "blue"
					}}
				/>
			);

		} else {
			if (start === true) {
				gameBoard = (
					<Container
						style={{
							minHeight: "700px",
							backgroundColor: "#4C5C8F",
							display: "flex",
							justifyContent: "center",
							padding: "40px"
						}}
					>
						<Game
							socket={socket}
							questions={this.state.questions}
							group={this.state.group}
							pseudo={this.state.pseudo}
							sendAnswer={this.sendAnswer}
						/>
					</Container>
				);
			}
		}

		if (vote === true) {
			gameBoard = (
				<Container
					style={{
						minHeight: "700px",
						backgroundColor: "#4C5C8F",
						display: "flex",
						justifyContent: "center",
						padding: "40px"
					}}
				>
					<Vote
						socket={socket}
						pseudo={this.state.pseudo}
						questions={this.state.questions}
						group={this.state.group}
						game={this.state.game}
					/>
				</Container>
			);
		}

		if (end === true) {
			// Replay ?
			gameBoard = (
				<GameEnd
					game={this.state.game}
					gameContinue={this.gameContinue}
				/>
			);
		}

		if (deconnexion === true) {
			gameBoard = <Redirect to="/" />;
		}

		return (
			<div>
				<Dimmer.Dimmable dimmed={active}>
					<Menu style={{ backgroundColor: "#707EAC" }}>
						<Menu.Menu position="right">
							<Menu.Item>
								<Button
									color="red"
									onClick={this.userDisconnect}
								>
									Déconnexion
								</Button>
							</Menu.Item>
						</Menu.Menu>
					</Menu>
					<Grid>
						<Grid.Row>
							<Grid.Column width={14}>{gameBoard}</Grid.Column>
							<Grid.Column
								width={2}
								style={{
									backgroundColor: "#4C5C8F",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingRight: "2rem"
								}}
							>
								<Container>{playerList}</Container>
							</Grid.Column>
						</Grid.Row>
					</Grid>
					<Dimmer active={active} page>
						<GameWait
							list={this.state.playerList}
							room={this.state.room}
							WaitSubmit={this.WaitSubmit}
							socket={socket}
						/>
					</Dimmer>
				</Dimmer.Dimmable>
			</div>
		);
	}
}

GameBoard.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default GameBoard;
