import { h, render, Component } from '../lib';
import { List } from './list';

class App extends Component {

  render() {
    return (
      <div>
        <List />
      </div>
    );
  }
}

render(<App />, document.getElementById('root')!);
