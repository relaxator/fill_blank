import React from "react";
import { Button, Container, Table } from "semantic-ui-react";

class GameEnd extends React.Component {
	state = {
		display: []
	};

	componentWillMount() {
		const { game } = this.props;

		var winner = game.host.score;

		for (var i in game.players) {
			if (winner < game.players[i].score) {
				winner = game.players[i].score;
			}
		}

		var temp = [];

		temp.push({ pseudo: game.host.id, score: game.host.score });

		for (var y in game.players) {
			temp.push({
				pseudo: game.players[y].id,
				score: game.players[y].score
			});
		}

		temp.sort(function(a, b) {
			return a - b;
		});

		this.setState({
			display: temp.reverse()
		});
	}

	
	render() {
		const { display } = this.state;

		return (
			<Container>
				<Table celled inverted>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Joueurs</Table.HeaderCell>
							<Table.HeaderCell>Scores</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{display.map((tab, index) => {
							return(
								<Table.Row key={index}>
									<Table.Cell>{tab.pseudo}</Table.Cell>
									<Table.Cell>{tab.score}</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
				<Button onClick={this.props.gameContinue}>Continuer ?</Button>
			</Container>
		);
	}
}

export default GameEnd;
