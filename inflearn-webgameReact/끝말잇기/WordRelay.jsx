const React = require('react');
const { useState, useRef } = React;

const WordRelay = () => {
    const [word, setWord] = useState('xeropise');
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const inputRef = useRef(null);

    const onSubmitForm = (e) => {
        e.preventDefault();
        if (word[this.state.word.length -1] === value[0]) {
            setResult('딩동댕');
            setWorkd(value);
            value('');
            inputRef.current.focus();
        }else {
            setResult('땡');
            setValue('');
            inputRef.current.focus();
        }
    };

    const onChangeInput = (e) => {
        setValue(e.target.value);
    };

       return (
           <>
             <div>{this.state.word}</div>
             <form onSubmit={tonSubmitForm}>
                 <input id="wordInput" className="wordInput" ref={inputRef} value={value} onChange={onChangeInput} />
                 <button>입력!</button>
             </form>
             <div>{result}</div>
           </>
       )
};

module.exports = WordRelay;