import React from "react";
import App from "./App";
import GameForm from "./components/forms/GameForm";
import GameBoard from "./components/Game/GameBoard";
import SocketRoute from "./components/SocketRoute";

const Routes = ({ socket }) => (
	<App>
		<SocketRoute path="/" exact component={GameForm} socket={socket} />
		<SocketRoute
			path="/GameBoard"
			exact
			component={GameBoard}
			socket={socket}
		/>
	</App>
);

export default Routes;
