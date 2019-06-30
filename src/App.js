import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      messages: []
    };
  }
  componentDidMount() {
    const {endpoint} = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      console.log('data: ', data)
      this.setState({response: data})
    });

    socket.on('msgs', data => this.setState({messages: data}))
  }

  render() {
    const {response, messages} = this.state;
    return(
      <div style={{ textAlign: "center"}}>

        {messages.length} messages : {messages.map(item => <p key={item}>{item}</p>)}
        {/* {response
        ? <p>
          The temperature in Allen is: {response.currently.temperature} degrees Farenheit
        </p>
      
        : <p>Loading...</p>
        } */}
      </div>
    )
  }
  
}

export default App;