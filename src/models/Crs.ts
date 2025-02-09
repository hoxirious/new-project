interface Crs {
    spouseOrCommonLawPartnerFactors: SpouseOrCommonLawPartnerFactors;
    coreHumanCapitalFactors: CoreHumanCapitalFactors;
    skillTransferabilityFactors: SkillTransferabilityFactors;
    additionalPoints: AdditionalPoints;
};

interface CriteriaAndScores {
    criteria: string;
    scores: number;
}

interface SpouseOrCommonLawPartnerFactors {
    levelOfEducation: CriteriaAndScores;
    firstLanguageSpeaking: CriteriaAndScores;
    firstLanguageListening: CriteriaAndScores;
    secondLanguageSpeaking: CriteriaAndScores;
    secondLanguageListening: CriteriaAndScores;
    canadianWorkExperience: CriteriaAndScores;
    foreignWorkExperience: CriteriaAndScores;
    certificateOfQualification: CriteriaAndScores;
    spouseOrCommonLawPartnerFactors: CriteriaAndScores;
}

interface CoreHumanCapitalFactors {
    age: CriteriaAndScores;
    levelOfEducation: CriteriaAndScores;
    firstLanguageSpeaking: CriteriaAndScores;
    firstLanguageListening: CriteriaAndScores;
    secondLanguageSpeaking: CriteriaAndScores;
    secondLanguageListening: CriteriaAndScores;
    canadianWorkExperience: CriteriaAndScores;
    foreignWorkExperience: CriteriaAndScores;
    certificateOfQualification: CriteriaAndScores;
    coreHumanCapitalFactors: CriteriaAndScores;
}

interface SkillTransferabilityFactors {
    education: CriteriaAndScores;
    foreignWorkExperience: CriteriaAndScores;
    certificateOfQualification: CriteriaAndScores;
    skillTransferabilityFactors: CriteriaAndScores;
}

interface AdditionalPoints {
    additionalPoints: CriteriaAndScores;
}

export { Crs, SpouseOrCommonLawPartnerFactors, CoreHumanCapitalFactors, SkillTransferabilityFactors, AdditionalPoints, CriteriaAndScores};