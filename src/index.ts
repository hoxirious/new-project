import { CrsProfile } from './expressEntry/CrsProfile';

async function main() {
    const crsProfile = new CrsProfile();
    await crsProfile.initializeTerminals();

    // Wait for the options to be initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        let allTerminals = crsProfile.getAllTerminals();
        console.log('All Terminals Unselected:', allTerminals.length);

        // Example usage of setValue
        const option = { id: "123e4567-e89b-12d3-a456-426614174004", label: "Annulled Marriage" };
        await crsProfile.setValue("123e4567-e89b-12d3-a456-426614174000", option);

        // Get all terminals
        allTerminals = crsProfile.getAllTerminals();
        console.log(`All Terminals ${option.label}: `, allTerminals.length);

        // Example usage of setValue
        const option2 = { id: "123e4567-e89b-12d3-a456-426614174005", label: "Common Law" };
        await crsProfile.setValue("123e4567-e89b-12d3-a456-426614174000", option2);


        // Get all terminals
        allTerminals = crsProfile.getAllTerminals();
        console.log(`All Terminals ${option2.label}: `, allTerminals.length);

        // Get all terminals
        await crsProfile.setValue("123e4567-e89b-12d3-a456-426614174000", option);
        allTerminals = crsProfile.getAllTerminals();
        console.log(`All Terminals ${option.label}: `, allTerminals.length);
        // Example usage of getScore
        await crsProfile.head!.updateScore();
        const score = crsProfile.head!.score;
        console.log('Current Score:', score);
    } catch (error: any) {
        console.error('Error:', error);
    }
}

main();