import { ObjectId } from 'mongodb';
import { Database } from '../database/Database';
import { Option } from './Option';
import dotenv from 'dotenv';

dotenv.config();

class CrsProfile {
    private head: Question | null = null;
    private current: Question | null = null;

    constructor() {}

    public async initializeOptions(): Promise<void> {
        const db = await Database.getInstance();
        const optionsCollection = db.getDb().collection('options');

        const optionId = process.env.CRS_OPTION_INIT_ID as string;
        const optionData = await optionsCollection.findOne({ _id: new ObjectId(optionId) });

        if (optionData) {
            const option = new Option(optionData.key, optionData.value, optionData.score);
            this.head = new Question(option);
            this.current = this.head;
            console.log(option.key);
        } else {
            throw new Error(`Option with ObjectId ${optionId} not found`);
        }
    }

    public async getNextOptions(value: string): Promise<Option[]> {
        if (!this.current) {
            throw new Error('Option is not initialized');
        }

        const nextOptions = await this.current.option.getNextOptions(value);
        if (nextOptions.length > 0) {
            const nextLink = new Question(nextOptions[0]);
            this.current.next = nextLink;
            this.current = nextLink;
        }

        return nextOptions;
    }

    public getScore(): number {
        if (!this.head) {
            throw new Error('Option is not initialized');
        }

        return this.head.option.getScore();
    }

    public reset(): void {
        this.current = this.head;
    }
}

class Question {
    public next: Question | null = null;

    constructor(public option: Option) {}
}

export { CrsProfile };