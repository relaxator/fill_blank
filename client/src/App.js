import React from "react";
import io from "socket.io-client";

// const socket = io.connect("https://fill-blank.herokuapp.com/");

const socket = io.connect("http://localhost:8080/");
// const io = openSocket("http://192.168.1.13:8080");

class App extends React.Component {

  state = {
    socket: socket
  };

 render() {
    const { children } = this.props;
    const { socket } = this.state;
    
    // On connecte le socket et on l'assigne au props de tout les composant enfant. Ils peuvent alors y accéder via leur props.

    const childrenProps = React.Children.map(children, child => {
      return React.cloneElement(child, {
        socket: socket
      });
    });

    return (
      <div>

        {childrenProps}

      </div>
    );
  }
}

export default App;
