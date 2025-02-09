import { ObjectId } from 'mongodb';
import { Database } from '../database/Database';
import { Option, Key } from './Option';
import dotenv from 'dotenv';

dotenv.config();

class CrsProfile {
    public head: Question | null = null;
    private map: WeakMap<Key, Question> = new WeakMap();
    private childrenCache: Map<Key, Question[]> = new Map();

    constructor() {}

    public async initializeOptions(): Promise<void> {
        const db = await Database.getInstance();
        const optionsCollection = db.getDb().collection('options');

        const optionId = process.env.CRS_OPTION_INIT_ID as string;
        const optionData = await optionsCollection.findOne({ _id: new ObjectId(optionId) });

        if (optionData) {
            const option = new Option(optionData.key, optionData.value, optionData.score);
            this.head = new Question(option);
            this.map.set(option.key, this.head);
        } else {
            throw new Error(`Option with ObjectId ${optionId} not found`);
        }
    }

    public async getNextQuestions(curKey: Key, value: string): Promise<Option[]> {
        const currentQuestion = this.map.get(curKey);
        if (!currentQuestion) {
            throw new Error(`The selected option ${curKey} not found`);
        }

        const cachedChildren = this.childrenCache.get(curKey);
        if (cachedChildren) {
            currentQuestion.next = cachedChildren;
            return cachedChildren.map(question => question.option);
        }

        const nextOptions = await currentQuestion.option.getNextOptions(value);
        currentQuestion.next = nextOptions.map(option => {
            const nextQuestion = new Question(option);
            this.map.set(option.key, nextQuestion);
            return nextQuestion;
        });

        this.childrenCache.set(curKey, currentQuestion.next);
        return nextOptions;
    }

    public getScore(): number {
        if (!this.head) {
            throw new Error('Option is not initialized');
        }
        return this.head.option.getScore();
    }

    public reset(): void {
        this.head = null;
        this.map = new WeakMap();
        this.childrenCache = new Map();
    }
}

class Question {
    public next: Question[] = [];

    constructor(public option: Option) {}
}

export { CrsProfile };