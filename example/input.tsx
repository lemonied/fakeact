import { Component, h, Observe, PropsWithChildren } from '../lib';

interface InputProps {
  initialValue: string;
}
export class Input extends Component<InputProps> {
  @Observe value = '';
  inputElement?: HTMLInputElement;
  onInput(e: any) {
    this.value = e.target.value;
  }
  created() {
    this.value = this.props.initialValue;
    console.log('Input created');
    console.log('Input ref created', this.inputElement);
  }
  mounted() {
    console.log('Input mounted');
    console.log('Input ref mounted', this.inputElement);
  }

  beforeDestroy() {
    console.log('beforeDestroy');
  }
  onPropsChange(nextProps: PropsWithChildren<InputProps>, preProps: PropsWithChildren<InputProps>) {
    console.log(nextProps, preProps);
  }
  updated() {
    console.log('Input updated');
  }

  render() {
    return (
      <div style={{ border: '1px solid red', padding: '10px', margin: '10px' }}>
        <input type="text" onInput={this.onInput} ref={(e: HTMLInputElement) => this.inputElement = e} />
        <p>value： { this.value }</p>
        <p>initialValue： { this.props.initialValue }</p>
      </div>
    );
  }
}
