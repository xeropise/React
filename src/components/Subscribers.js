import React from "react";
import { connect } from "react-redux";
import { addSubscriber } from "../redux";

const Subscribers = ({ count, addSubscriber }) => {
  return (
    <div classname="items">
      <p>구독자 수: {count}</p>
      <button onClick={() => addSubscriber()}>구독하기!</button>
    </div>
  );
};

const mapStateToProps = ({ subscribers }) => {
  return {
    count: subscribers.count,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addSubscriber: () => dispatch(addSubscriber()),
//   };
// };

//ES6 에서는 key와 value가 같은 경우 에는 생략 가능해서 아래 에서 addSubscriber 만 적어도 addSubscriber : addSubscriber 와 같이 작동
const mapDispatchToProps = {
  addSubscriber,
};
export default connect(mapStateToProps, mapDispatchToProps)(Subscribers);
