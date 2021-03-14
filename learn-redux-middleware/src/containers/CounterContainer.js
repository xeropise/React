import React from "react";
import { connect } from "react-redux";
import { increaseAsync, decreasAsync } from "../modules/counter";
import Counter from "../components/Counter";

const CounterContainer = ({ number, increaseAsync, decreasAsync }) => {
  return (
    <Counter
      number={number}
      onIncrease={increaseAsync}
      onDecrease={decreasAsync}
    />
  );
};

export default connect(
  (state) => ({
    number: state.counter,
  }),
  {
    increaseAsync,
    decreasAsync,
  }
)(CounterContainer);
