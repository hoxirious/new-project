import { Database } from '../database/Database';

interface Key {
    factorKey: FactorKey;
    optionKey: string;
    label: string;
}

interface Value {
    key: string;
    label: string;
    nextKey: string[];
    score: number;
}

type FactorKey = 'coreHumanCapitalFactors' | 'spouseOrCommonLawPartnerFactors' | 'skillTransferabilityFactors' | 'additionalPointsFactors';

interface CoreHumanCapitalFactors {
    age: number;
    levelOfEducation: number;
    firstLanguageSpeaking: number;
    firstLanguageListening: number;
    secondLanguageSpeaking: number;
    secondLanguageListening: number;
    canadianWorkExperience: number;
    foreignWorkExperience: number;
    certificateOfQualification: number;
    coreHumanCapitalFactors: number;
    total: number;
}

interface SpouseOrCommonLawPartnerFactors {
    levelOfEducation: number;
    firstLanguageSpeaking: number;
    firstLanguageListening: number;
    secondLanguageSpeaking: number;
    secondLanguageListening: number;
    canadianWorkExperience: number;
    foreignWorkExperience: number;
    certificateOfQualification: number;
    spouseOrCommonLawPartnerFactors: number;
    total: number;
}

interface SkillTransferabilityFactors {
    education: number;
    foreignWorkExperience: number;
    certificateOfQualification: number;
    skillTransferabilityFactors: number;
    total: number;
}

interface AdditionalPointsFactors {
    brotherOrSisterLivingInCanada: number;
    frenchLanguageAbilities: number;
    postSecondaryEducationInCanada: number;
    arrangedEmployment: number;
    provincialNomination: number;
    total: number;
}

interface Score {
    spouseOrCommonLawPartnerFactors: SpouseOrCommonLawPartnerFactors;
    coreHumanCapitalFactors: CoreHumanCapitalFactors;
    skillTransferabilityFactors: SkillTransferabilityFactors;
    additionalPointsFactors: AdditionalPointsFactors;
    total: number;
}

export class Option {
    constructor(public key: Key, public value: Value[], public score: Score) {}

    private updateScore = (factorKey: FactorKey, optionKey: string, score: number): void => {
        (this.score[factorKey] as any)[optionKey] += score;
    }

    public getNextOptions = async (value: string): Promise<Option[]> => {
        const foundValue = this.value.find((v) => v.key === value);
        if (!foundValue) {
            throw new Error(`The selected option ${value} not found`);
        }

        this.updateScore(this.key.factorKey, foundValue.key, foundValue.score);

        const db = await Database.getInstance();
        const optionsCollection = db.getDb().collection('options'); // Adjust the collection name as necessary

        const nextOptions = [];
        for (const optionKey of foundValue.nextKey) {
            const optionData = await optionsCollection.findOne({ 'key.optionKey': optionKey });
            if (optionData) {
                const option = new Option(optionData.key, optionData.value, this.score);
                nextOptions.push(option);
            }
        }

        return nextOptions;
    }

    public getScore = (): number => {
        return this.score.total;
    }
}