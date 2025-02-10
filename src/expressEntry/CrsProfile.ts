import { ObjectId } from 'mongodb';
import { Database } from '../database/Database';
import { Option, Terminal } from './Terminal';
import { Guid } from '../common/Guid';
import dotenv from 'dotenv';

dotenv.config();

class CrsProfile {
    public head?: Terminal;
    private map: Map<Guid, Terminal> = new Map();

    constructor() {}

    public async initializeTerminals(): Promise<void> {
        const db = await Database.getInstance();
        const optionsCollection = db.getDb().collection<Terminal>('terminals');

        const terminalId = process.env.CRS_TERMINAL_INIT_ID as string;
        const terminalData = await optionsCollection.findOne({ _id: new ObjectId(terminalId) });

        if (terminalData) {
            const valueGuidToChildrenGuids = new Map<Guid, Guid[]>(
                Object.entries(terminalData.valueGuidToChildrenGuids)
            );

            const terminal = new Terminal(
                terminalData.id,
                valueGuidToChildrenGuids,
                terminalData.label,
                terminalData.description,
                terminalData.options,
                terminalData.value,
                terminalData.expressionScore,
                terminalData.score
            )
            this.head = terminal;
            this.map.set(terminal.id, this.head);
        } else {
            throw new Error(`Option with ObjectId ${terminalId} not found`);
        }
    }

    public async setValue(id: Guid, value: Option): Promise<void> {
        const terminal = this.map.get(id);
        if (!terminal) {
            throw new Error(`Option with GUID ${id} not found`);
        }

        const nextTerminals =  await terminal.setValue(value);
        for (const nextTerminal of nextTerminals) {
            this.map.set(nextTerminal.id, nextTerminal);
        }
    }

    public getAllTerminals(): Terminal[] {
        if (!this.head) {
            throw new Error('Head terminal is not initialized');
        }

        const terminals: Terminal[] = [];
        const stack: Terminal[] = [this.head];

        while (stack.length > 0) {
            const current = stack.pop()!;
            terminals.push(current);

            for (const childTerminal of current.children) {
                if (childTerminal) {
                    console.log(`Parent: ${current.id}, Child: ${childTerminal.id}`);
                    stack.push(childTerminal);
                }
            }
        }

        return terminals;
    }
}

export { CrsProfile };