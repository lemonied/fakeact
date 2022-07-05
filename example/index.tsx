import { h, createRoot, Component } from '../lib';

class App extends Component {

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
        </div>
        <p>你好</p>
      </>
    );
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <App />
);
