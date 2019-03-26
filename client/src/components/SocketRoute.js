import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

const SocketRoute = ({ component: Component, socket, ...rest }) => (

	<Route
		{...rest}
		render={props =>
			<Component {...props} socket={socket}/>
		}
	/>
);

SocketRoute.propTypes = {
	component: PropTypes.func.isRequired
	
};

export default SocketRoute;