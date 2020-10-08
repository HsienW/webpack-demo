import {commonTest} from '../common/common-test';
import {commonTestTwo} from '../common/common-test-2';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

export function test() {
    console.log('test');
}

export default function testLoad() {
    console.log('test lazy load');
}
