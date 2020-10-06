import '../src/style/style.scss';
import {componentTest} from 'component'; // 可以省略長的 import path

const array = ['a', 'aa', 'b', 'bb'];

class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    arrayFilter() {
        _.filter(array, 'a');
    }

    test() {
        componentTest();
    }
}

const dog = new Animal('dog');
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
