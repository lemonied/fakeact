import { h, createRoot, Component } from '../lib';

interface AppProps {
  name: string;
  show: boolean;
}
class App extends Component<AppProps> {

  render() {
    return (
      <>
        <div className={'app'}>
          <span>123 <span>123</span>{123}</span>
          {null}
          {
            this.props.show ?
              <p>Show</p> :
              null
          }
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
  <App name={'ChenJiYuan'} show={false} />
);

setTimeout(() => {
  root.render(
    <App name={'YuanLinLin'} show={true} />
  );
}, 2000);
