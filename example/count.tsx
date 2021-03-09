import { Component, h, Observe } from '../lib';

export class Count extends Component {
  @Observe count = 1;
  onClick() {
    this.count++;
  }

  render() {
    return (
      <div>
        <span>计数器：</span>
        <span title={this.count}>{ this.count }</span>
        &nbsp;&nbsp;&nbsp;
        <button onClick={this.onClick}>+1</button>
      </div>
    );
  }
}
