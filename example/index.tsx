import { h, createRoot, Component } from '../lib';

interface AppProps {
  name: string;
}
class App extends Component<AppProps> {

  render() {
    return (
      <>
        <div className={'app'}>
          <span>123</span>
          456
          {null}
          {undefined}
          {0}
          <div>
            <p>789</p>
          </div>
          <p>
            name: {this.props.name}
          </p>
        </div>
        <p>你好</p>
      </>
    );
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <App name={'ChenJiYuan'} />
);

setTimeout(() => {
  root.render(
    <App name={'YuanLinLin'} />
  );
}, 2000);
