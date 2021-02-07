import { h, render, Component, Observe } from '../lib';

class Children extends Component {
  @Observe name = 'ChenJiYuan';
  render() {
    return (
      <p>{ this.name }</p>
    );
  }
}

class App extends Component {
  @Observe count = 'onClick';
  @Observe test = 'test';
  onClick() {
    console.log(this.count);
  }
  render() {
    return (
      <div>
        <span title={234} onClick={this.onClick}>{this.count}</span>
        <span />
        <Children count={this.count} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root')).then((vNodes) => {
  console.log(vNodes);
});
