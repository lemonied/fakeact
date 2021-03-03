import { h, render, Component, Observe } from '../lib';
import { Input } from './input';

class App extends Component {
  @Observe count = 1;
  @Observe toggleShowInput = true;
  @Observe inputInitialValue = 'init';
  onClick() {
    this.count++;
  }
  updated() {
    console.log('App updated');
  }
  onDataChange(key: string | symbol, newData: any, oldData: any) {
    console.log('App onDataChange', key, newData, oldData);
  }
  created() {
    console.log('App created');
  }
  mounted() {
    console.log('App mounted');
  }
  onInput(e: any) {
    this.inputInitialValue = e.target.value;
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
        <div>
          <span>initialValue：</span>
          <input type="text" onInput={this.onInput} />
        </div>
        {
          this.toggleShowInput ?
            <Input initialValue={this.inputInitialValue} /> :
            null
        }
        <button
          onClick={() => this.toggleShowInput = !this.toggleShowInput}
        >{ this.toggleShowInput ? '隐藏' : '显示' } Input组件</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('root')!);
