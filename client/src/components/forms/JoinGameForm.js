import React from "react";
import { Container, Segment, Button, Form, Divider } from "semantic-ui-react";
import PropTypes from "prop-types";
import InlineError from "../messages/InlineErrors";

class JoinGameForm extends React.Component {
	state = {
		data: {
			gameName: "",
			gamePassword: "",
			Pseudo: ""
		}
	};

	onChange = event => {
		this.setState({
			data: {
				...this.state.data,
				[event.target.name]: event.target.value
			}
		});
	};

	GameSubmit = () => {
		
		this.props.joinGame(this.state.data);
	};

	render() {
		const { data } = this.state;
		const { error } = this.props;
		
		return (
			<Segment inverted>
				<Container>
					<Form>
						<Form.Field error={!!error.pseudo}>
							Pseudo
							<input
								name="Pseudo"
								value={data.Pseudo}
								onChange={this.onChange}
								placeholder="Pseudo"
							/>
							{error && <InlineError text={error.pseudo} />}
						</Form.Field>
						<Divider horizontal inverted>Rejoindre une partie</Divider>
						<Form.Field error={!error.room}>
							Game Name / id
							<input
								name="gameName"
								value={data.gameName}
								onChange={this.onChange}
								placeholder="Game Name"
							/>
							{error && <InlineError text={error.room} />}
						</Form.Field>
						<Form.Field error={!!error.password}>
							Game Password
							<input
								name="gamePassword"
								value={data.gamePassword}
								onChange={this.onChange}
								type="password"
								placeholder="Game Password"
							/>
							{error && <InlineError text={error.password} />}
						</Form.Field>
						<Button onClick={this.GameSubmit}>Launch Game !</Button>
						{error && <InlineError text={error.active} />}
						{error && <InlineError text={error.room} />}
					</Form>
				</Container>
			</Segment>
		);
	}
}

JoinGameForm.propTypes = {
	joinGame: PropTypes.func.isRequired
};

export default JoinGameForm;
