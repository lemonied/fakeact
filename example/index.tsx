import { h, createRoot, Component } from '../lib';

interface AppProps {
  name: string;
}
class App extends Component<AppProps> {

  render() {
    return (
      <>
        <div className={'app'}>
          <span>123 <span>123</span>{123}</span>
          {null}
          <p>
            name: {this.props.name}
          </p>
        </div>
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
