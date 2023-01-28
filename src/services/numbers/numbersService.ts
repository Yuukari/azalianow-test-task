import Storage from '../../storage';

import { NumberRecord } from './types';

export default class NumbersService {
    private storage: Storage;

    constructor() {
        this.storage = new Storage('numbers.json');
    }

    public async addNumberRecord(value: number): Promise<NumberRecord> {
        const numberRecords = (await this.storage.get()).reverse() as NumberRecord[];
        const lastNumberRecord: NumberRecord | undefined = numberRecords[0];

        const newRecord: NumberRecord = {
            prevValue: lastNumberRecord != undefined ? lastNumberRecord.currentValue : null,
            currentValue: value,
            result: lastNumberRecord != undefined ? (lastNumberRecord.currentValue + value) / 2 : null
        }

        await this.storage.add(newRecord);
        return newRecord;
    }

    public async getNumberRecords(): Promise<NumberRecord[]> {
        return await this.storage.get() as NumberRecord[];
    }
}