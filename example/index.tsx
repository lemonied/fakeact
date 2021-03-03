import { h, render, Component, Observe } from '../lib';

class Input extends Component<{ initialValue: string }> {
  @Observe value = '';
  onInput(e: any) {
    this.value = e.target.value;
  }
  created() {
    this.value = this.props.initialValue;
  }
  beforeDestroy() {
    console.log('beforeDestroy');
  }

  render() {
    return (
      <div>
        <input type="text" onInput={this.onInput}/>
        <p>value： { this.value }</p>
      </div>
    );
  }
}

class App extends Component {
  @Observe count = 1;
  @Observe toggleShowInput = true;
  onClick() {
    console.log(this);
    this.count++;
  }
  render() {
    return (
      <div>
        <div>
          <span>计数：</span>
          <span title={this.count}>{this.count}</span>
          &nbsp;&nbsp;&nbsp;
          <button onClick={this.onClick}>+1</button>
        </div>
        <br/>
        {
          this.toggleShowInput ?
            <Input initialValue={'init'} /> :
            null
        }
        <button onClick={() => this.toggleShowInput = !this.toggleShowInput}>显示/隐藏input</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('root')!);
