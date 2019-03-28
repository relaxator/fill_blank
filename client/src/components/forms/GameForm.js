import React from "react";
import { Segment, Header, Button, Container } from "semantic-ui-react";
import PropTypes from "prop-types";
import CreateGameForm from "./CreateGameForm";
import JoinGameForm from "./JoinGameForm";
import HomePage from "../page/HomePage";

class GameForm extends React.Component {
	state = {
		create: false,
		join: false,
		error: {}
	};

	componentDidMount() {
		const { socket } = this.props;
		socket.on("createError", this.CreateError);
		socket.on("disconnect", () => {
			window.location.reload();
		});
	}

	componentWillUnmount() {
		const { socket } = this.props;
		socket.removeListener("createError", this.CreateError);
	}

	CreateError = err => {
		this.setState({ error: err });
	};

	GameCreate = () => {
		this.setState({ create: true });
		this.setState({ join: false });
	};

	GameJoin = () => {
		this.setState({ join: true });
		this.setState({ create: false });
	};

	submitGame = data => {
		const { socket } = this.props;

		socket.emit("create", data);

		socket.on("GameCreated", games => {
			socket.pseudo = data.Pseudo;
			socket.isHost = true;

			this.props.history.push({
				pathname: "/GameBoard",
				state: { games: games }
			});
		});
	};

	joinGame = data => {
		const { socket } = this.props;

		socket.emit("join", data);

		socket.on("GameJoin", (games, id) => {
			socket.pseudo = data.Pseudo;
			this.props.history.push({
				pathname: "/GameBoard",
				state: { games: games, id: id }
			});
		});
	};

	render() {
		const { create, join } = this.state;

		return (
			<div>
				<HomePage />
				<Segment
					style={{ padding: "8em 0em" }}
					vertical
					textAlign="center"
				>
					<Segment style={{ marginBottom: "0" }}>
						<Header as="h1" content="Ready ?" />
						<Button.Group>
							<Button onClick={this.GameJoin}>Join Game</Button>
							<Button.Or text="ou" />
							<Button positive onClick={this.GameCreate}>
								Create Game
							</Button>
						</Button.Group>
					</Segment>
					<Container>
						{create ? (
							<CreateGameForm
								submitGame={this.submitGame}
								error={this.state.error}
							/>
						) : (
							""
						)}
						{join ? (
							<JoinGameForm
								joinGame={this.joinGame}
								error={this.state.error}
							/>
						) : (
							""
						)}
					</Container>
				</Segment>
			</div>
		);
	}
}

GameForm.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default GameForm;
