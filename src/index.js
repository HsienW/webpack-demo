import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import '../src/style/style.scss';
import {commonTest} from './common/common-test';
import {commonTestTwo} from './common/common-test-2';
// import {componentTest} from 'component'; // 可以省略長的 import path

const array = ['a', 'aa', 'b', 'bb', 'ccc', 'ccc', 'ddd'];

const TestReact = () => {
    return (
        <div>我是 react test </div>
    );
};


ReactDOM.render(
    <TestReact/>
    , document.getElementById('root'));

// class Animal {
//     constructor(name) {
//         this.name = name;
//     }
//
//     getName() {
//         return this.name;
//     }
//
//     arrayFilter() {
//         _.filter(array, 'a');
//     }
//
//     test() {
//         componentTest();
//     }
// }

// const dog = new Animal('dog');
console.log('test');

// this use mocker-api lib fake call api
fetch("/login/account", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: "this-demo",
        password: "this-demo"
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
