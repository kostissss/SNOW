import * as React from "react";
import { Range } from "react-range";

export default class Slider extends React.Component {
  state = { values: [50] };
  render() {
    return (
      <>
        <h3>GeeksforGeeks- Slider</h3>
        <Range
          step={0.1}
          min={0}
          max={100}
          values={this.state.values}
          onChange={(values) => this.setState({ values })}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ccc",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "42px",
                width: "42px",
                backgroundColor: "#999",
              }}
            />
          )}
        />
      </>
    );
  }
}
