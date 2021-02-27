import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // history, params, location 객체가 Router가 제공하지 않으면 이걸로 감싸서 받을수도 있어.
import NumberBaseball from '../2.숫자야구/NumberBaseballClass';
import RSP from '../5.가위바위보/RSPClass';
import Lotto from '../6.로또추첨기/LottoClass';

class GameMatcher extends Component {
    render() {
        let urlSearchparams = new URLSearchParams(this.props.location.search.slice(1));
        console.log(urlSearchparams.get('hello'));
        const { name } = this.props.match.params.name;

        if(name === 'number-baseball') {
            return <NumberBaseballClass />
        }else if(name === 'rock-scissors-paper') {
            return <RSP />
        }else if(name === 'lotto-generator') {
            return <Lotto />
        }

        return (
            <div>
                일치하는 게임이 없습니다.
            </div> 
        );
    }
}

export default GameMatcher;

//export default withRouter(GameMatcher);