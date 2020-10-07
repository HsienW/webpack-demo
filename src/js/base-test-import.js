import {commonTest} from '../common/common-test';
import {commonTestTwo} from '../common/common-test-2';

export function test() {
    console.log('test');
}

export default function testLoad() {
    console.log('test lazy load');
}
