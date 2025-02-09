import { Database } from '../database/Database';
import { Guid } from "../common/Guid";

type FactorKey = 'coreHumanCapitalFactors' | 'spouseOrCommonLawPartnerFactors' | 'skillTransferabilityFactors' | 'additionalPointsFactors';

interface ExpressionScore {
    expression: boolean;
    score: number;
}

export interface Option {
   id: Guid;
   label: string;
}

export class Terminal {
    public children: Terminal[] = [];

    constructor(public id: Guid,
                public valueGuidToChildrenGuids: Map<Guid, Guid[]>, public label: string,
                public description: string, public options: Option[],
                public value?: Option, public expressionScore?: ExpressionScore[],
                public score: number = 0,
                public parent: Terminal = this,
    ) {}

    private async getNextTerminal(): Promise<Terminal[]> {
        if (this.valueGuidToChildrenGuids.size == 0) {
            return [];
        }
        if (!this.value) {
            throw new Error('Value is not set');
        }
        if (!this.valueGuidToChildrenGuids.has(this.value.id)) {
            throw new Error(`Value cannot be found: ${this.value.id, this.value.label}`);
        }
        const db = await Database.getInstance();
        const terminalCollection = db.getDb().collection<Terminal>('terminals');
        const nextTerminals = await terminalCollection.find({ id: { $in: this.valueGuidToChildrenGuids.get(this.value.id) } }).toArray();
        if (!nextTerminals) {
            throw new Error('No terminals found for the given children GUIDs');
        }
        return nextTerminals.map(terminalData => new Terminal(
            terminalData.id,
            new Map<Guid, Guid[]>(Object.entries(terminalData.valueGuidToChildrenGuids)),
            terminalData.label,
            terminalData.description,
            terminalData.options,
            terminalData.value,
            terminalData.expressionScore,
            terminalData.score,
            this
        ));
    }

    public async setValue(value: Option): Promise<Terminal[]> {
        if (this.value == value){
            return [];
        }
        this.value = value;
        this.children = []; // Clear old children
        const nextTerminals = await this.getNextTerminal();
        // If there are no next terminals, then the current terminal is a leaf node
        if (nextTerminals.length == 0) {
            this.updateScore();
        }
        for (const terminal of nextTerminals) {
            this.subscribeChild(terminal);
        }
        return nextTerminals;
    }

    public getValue(): Option {
        if (!this.value) throw new Error('Value is not set');
        return this.value;
    }

    public subscribeChild(child: Terminal): void {
        this.children.push(child);
    }

    public async updateScore(): Promise<void> {
        if (this.children.length > 0) {
            if (this.expressionScore && this.expressionScore.length > 0) {
                for (const expScore of this.expressionScore) {
                    if (expScore.expression) {
                        this.score = expScore.score;
                    }
                }
            }
        }

        if (this.parent !== this) {
            await this.parent.updateScore();
        }
    }
}