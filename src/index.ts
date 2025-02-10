import { CrsProfile } from './expressEntry/CrsProfile';

async function main() {
    const crsProfile = new CrsProfile();
    await crsProfile.initializeOptions();

    // Wait for the options to be initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Example usage of setValue
        const option = { id: "123e4567-e89b-12d3-a456-426614174005", label: "Option 2" };
        await crsProfile.setValue("123e4567-e89b-12d3-a456-426614174000", option);

        // Get all terminals
        const allTerminals = crsProfile.getAllTerminals();
        console.log('All Terminals:', allTerminals.length, allTerminals);

        // Example usage of getScore
        await crsProfile.head!.updateScore();
        const score = crsProfile.head!.score;
        console.log('Current Score:', score);
    } catch (error: any) {
        console.error('Error:', error);
    }
}

main();