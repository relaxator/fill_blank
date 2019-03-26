import React from "react";
import {
	Button,
	List,
	Container,
	Statistic,
	Divider,
	Header,
	Icon
} from "semantic-ui-react";
import InlineError from "../messages/InlineErrors";

class GameWait extends React.Component {

	state = {
		host: false
	};

	componentDidMount() {
		const { socket } = this.props;
		if (socket.pseudo) {
			socket.emit(
				"isHost",
				function(data) {

					if (data === true) {
						this.setState({ host: true });
					} else {
						this.setState({ host: false });
					}
				}.bind(this)
			);
		}

	}

	Submit = () => {
		if (this.state.host === true) {

			if(this.props.list.length > 1){
				this.props.WaitSubmit();
			}else{
				this.setState({err: "vous devez être au moins deux pour lancer une partie."});
			}
			
		} else {

			this.setState({ err: "Seul l'hôte peut lancer la partie." });
		}
	};

	render() {
		const { list } = this.props;
		return (
			<div>
				<Container>
					La partie commencera lorsque tout le monde sera prêt.
					<br />
					Pour que vos amis puissent vous rejoindre envoyez leur l'id
					de votre partie
					<br />
					<Statistic color="red" inverted>
						<Statistic.Value>{this.props.room}</Statistic.Value>
						<Statistic.Label>Room id</Statistic.Label>
					</Statistic>
					<Divider section />
					<Icon.Group size="huge">
						<Icon loading size="big" name="circle notch" inverted />
						<Icon name="user" />
					</Icon.Group>
					<Header as="h5" inverted>
						Listes des joueurs
					</Header>
					<List items={list} />
					<Button onClick={this.Submit}>READY !</Button>
				</Container>
				{this.state.err && <InlineError text={this.state.err} />}
			</div>
		);
	}
}

export default GameWait;
