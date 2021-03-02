import { h, render, Component, Observe } from '../lib';

class Children extends Component {
  name = 'ChenJiYuan';
  render() {
    return (
      <div>
        <p>{ this.props.count }</p>
        <p>{ this.name }</p>
      </div>
    );
  }
}

class Input extends Component {
  @Observe value = '';
  onChange(e: InputEvent) {
    this.value = (e.target as any).value;
  }
  render() {
    return (
      <div>
        <input type="text" onInput={this.onChange}/>
        <p>{ this.value }</p>
      </div>
    );
  }
}
class Input2 extends Component {
  render() {
    return (
      <Input />
    );
  }
}

class App extends Component {
  count = 123;
  test = 'test';
  onClick() {
    console.log(this);
    this.count++;
  }
  render() {
    return (
      <div>
        <span title={234} onClick={this.onClick}>{this.count}</span>
        <span />
        <Children count={this.count} />
        <Input2 />
      </div>
    );
  }
}

render(<App />, document.getElementById('root')!);
