import React, { useState } from "react";
import { connect } from "react-redux";
import { addView } from "../redux/index";

const Views = ({ count, addView }) => {
  const [number, setNumber] = useState(1);

  return (
    <div classname="items">
      <p>조회수: {count}</p>
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <button onClick={() => addView(number)}>조회하기!</button>
    </div>
  );
};

const mapStateToProps = ({ views }) => {
  return {
    count: views.count,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addSubscriber: () => dispatch(addSubscriber()),
//   };
// };

//ES6 에서는 key와 value가 같은 경우 에는 생략 가능해서 아래 에서 addSubscriber 만 적어도 addSubscriber : addSubscriber 와 같이 작동
const mapDispatchToProps = {
  addView: (number) => addView(number),
};
export default connect(mapStateToProps, mapDispatchToProps)(Views);
