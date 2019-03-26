import React from "react";

import VoteForm from "./VoteForm";

class Vote extends React.Component {
	state = {
		group: [],
		question: [],
		pseudo: "",
		game: [],
		tours: 0,
		scoreCount: [],
	};

	componentWillMount() {
		const { pseudo, group, questions, game } = this.props;

		this.setState({
			group: group,
			question: questions,
			pseudo: pseudo,
			game: game
		});
	}

	componentDidMount() {


		const { socket } = this.props;

		socket.on("startVote", game => {});

		
	}

	

	ScoreCount = () => {

		const { socket } = this.props;
		setTimeout(() => {


			if(this.state.tours < this.state.group.length - 1){
				this.setState({
					tours: this.state.tours + 1
				});
			}else{

				this.setState({
					tours: 0
				});

				socket.emit("gameEnd", this.state.game.room_id);
				
			}

		}, 1000);

		
	};

	componentWillUnmount() {

	}

	render() {

		return (
			<div>
				<VoteForm
					game={this.state.game}
					group={this.state.group}
					questions={this.state.questions}
					tours={this.state.tours}
					ScoreCount={this.ScoreCount}
					socket={this.props.socket}
				/>
			</div>
		);
	}
}

export default Vote;
