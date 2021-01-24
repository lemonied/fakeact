import { h, render } from '../lib';
import { Component } from '../lib/component';
import { Observe } from '../lib/component';

class App extends Component {
  @Observe count = '';
  render() {
    return (
      <div>
        <span title={234}>123</span>
        <span />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
