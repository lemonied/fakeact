import { h, Component, Observe } from '../lib';

export class List extends Component{
  input?: HTMLInputElement;
  @Observe list: string[] = [
    '初始数据 - 1',
    '初始数据 - 2',
    '初始数据 - 3',
  ];
  addItem(item: string) {
    this.list = this.list.concat([item]);
  }
  delItem(index: number) {
    this.list.splice(index, 1);
    this.list = this.list.slice(0);
  }
  add() {
    if (this.input) {
      this.addItem(this.input.value);
      this.input.value = '';
    }
  }
  render() {
    return (
      <div>
        <div>
          <input type="text" ref={(e: HTMLInputElement) => this.input = e}/>
          <button onClick={this.add}>添加</button>
        </div>
        {
          this.list.length ?
            <ul>
              {
                this.list.map((v, k) => {
                  return (
                    <li>
                      <span>{ v }</span>
                      <span
                        onClick={() => this.delItem(k)}
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                      >&times;</span>
                    </li>
                  );
                })
              }
            </ul> :
            <span>暂无数据</span>
        }
      </div>
    );
  }
}
