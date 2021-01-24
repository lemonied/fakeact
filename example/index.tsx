import { h, render } from '../lib';
import { Component } from '../lib/component';
import { Observe } from '../lib/component';

class App extends Component {
  @Observe count = 'onClick';
  onClick() {
    console.log(this.count);
  }
  render() {
    return (
      <div>
        <span title={234} onClick={this.onClick}>{this.count}</span>
        <span />
      </div>
    );
  }
}

console.log(<App />);
render(<App />, document.getElementById('root'));
