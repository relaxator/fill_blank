import React from "react";
import { Form, Container, Button, Message, Segment } from "semantic-ui-react";

class Game extends React.Component {
	state = {
		data: {
			answer: ""
		},
		questions: [],
		answer: [],
		sendAnswer: false
	};

	componentDidMount() {

		const { group, questions, pseudo } = this.props;

		let q = [];

		for (var i in group) {
			for (var j in group[i]) {
				if (group[i][j] === pseudo) {
					q.push(questions[i]);
				}
			}
		}
		this.setState({ questions: q });
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.answer !== prevState.answer) {
			if (this.state.answer.length === 2) {
				var reponse = {
					question: this.state.questions,
					answer: this.state.answer
				};
				this.props.sendAnswer(reponse);

			}
		}
	}

	onChange = event => {
		this.setState({
			data: {
				...this.state.data,
				[event.target.name]: event.target.value
			}
		});
	};

	setAnswer = () => {
		this.setState({
			answer: [...this.state.answer, this.state.data.answer]
		});

		this.setState({ data: { answer: "" } });

	};


	render() {
		const { data, answer } = this.state;

		let question = (
			<Message
				style={{
					position: "absolute",
					top: "0",
					width: "100%"
				}}
			>
				<Message.Header>Première Question :</Message.Header>
				<p>{this.state.questions[0]}</p>
			</Message>
		);

		if (answer.length === 1) {
			question = (
				<Message
					style={{
						position: "absolute",
						top: "0",
						width: "100%"
					}}
				>
					<Message.Header>Deuxième Question :</Message.Header>
					<p>{this.state.questions[1]}</p>
				</Message>
			);
		}

		if (answer.length > 1) {
			return (
				<Container>
					<Segment>En attente des autres Joueurs.</Segment>
				</Container>
			);
		}

		return (
			<div
				style={{
					display: "flex",
					flexFlow: "column",
					width: "100%",
					justifyContent: "center",
					position: "relative"
				}}
			>
				{question}
				<Form
					style={{
						justifySelf: "center",
						alignSelf: "center",
						width: "50%"
					}}
				>
					<Form.Field>
						Votre Réponse
						<input
							name="answer"
							value={data.answer}
							onChange={this.onChange}
							placeholder="Votre réponse"
						/>
					</Form.Field>
					<Button onClick={this.setAnswer}>
						Envoyer votre réponse !
					</Button>
				</Form>
			</div>
		);
	}
}

export default Game;
