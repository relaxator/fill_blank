import React from "react";
import { Segment, Header } from "semantic-ui-react";

class HomePage extends React.Component {
	render() {
		return (
			<Segment
				inverted
				textAlign="center"
				style={{ padding: "1em 0em" }}
				vertical
			>
				<Header size="huge"> Bienvenue sur WTF Answers ! </Header>
			</Segment>
		);
	}
}

export default HomePage;
