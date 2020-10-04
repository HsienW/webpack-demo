import '../src/style/style.scss';

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
}

const dog = new Animal('dog');
console.log('test');
