import React from "react";
import { Container, Segment, Button, Form, Divider } from "semantic-ui-react";
import PropTypes from "prop-types";
import InlineError from "../messages/InlineErrors";

class CreateGameForm extends React.Component {
	state = {
		data: {
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
		this.props.submitGame(this.state.data);
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
						<Divider horizontal inverted>
							Paramètres de la partie
						</Divider>

						<Form.Field>
							Game Password
							<input
								name="gamePassword"
								value={data.gamePassword}
								onChange={this.onChange}
								type="password"
								placeholder="Game Password"
							/>
						</Form.Field>
						<Button onClick={this.GameSubmit}>Launch Game !</Button>
					</Form>
				</Container>
			</Segment>
		);
	}
}

CreateGameForm.propTypes = {
	submitGame: PropTypes.func.isRequired
};

export default CreateGameForm;
