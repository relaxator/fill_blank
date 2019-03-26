import React from "react";
import { Container, Form, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import InlineError from "../messages/InlineErrors";

class GameForm extends React.Component {
	state = {
		data: {
			pseudo: "",
			password: ""
		},
		errors: {}
	};

	onChange = event => {
		this.setState({
			data: {
				...this.state.data,
				[event.target.name]: event.target.value
			}
		});
	};

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.submit(this.state.data);
		}
	};

	validate = data => {
		const errors = {};
		if (!data.pseudo) {
			errors.pseudo = "Can't be blank!";
		}
		if (!data.password) {
			errors.password = "Can't be blank!";
		}

		return errors;
	};

	render() {
		const { data, errors } = this.state;

		return (
			<Container>
				<Form onSubmit={this.onSubmit}>
					<Form.Field error={!!errors.pseudo}>
						Pseudo:
						<input
							type="text"
							name="pseudo"
							placeholder="Pseudo"
							value={data.pseudo}
							onChange={this.onChange}
						/>
						{errors.pseudo && <InlineError text={errors.pseudo} />}
					</Form.Field>
					<Form.Field error={!!errors.password}>
						Password:
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={data.password}
							onChange={this.onChange}
						/>
						{errors.password && <InlineError text={errors.password} />}
					</Form.Field>
					<Button>submit</Button>
				</Form>
			</Container>
		);
	}
}

GameForm.propTypes = {
	submit: PropTypes.func.isRequired
}


export default GameForm;
