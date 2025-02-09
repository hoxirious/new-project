import { CrsProfile } from './expressEntry/CrsProfile';

async function main() {
    const crsProfile = new CrsProfile();
    await crsProfile.initializeOptions();

    // Wait for the options to be initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Example usage of getNextOptions
        const nextOptions = await crsProfile.getNextOptions("annulledMarriage");
        console.log('Next Options:', nextOptions);

        // Example usage of getScore
        const score = crsProfile.getScore();
        console.log('Current Score:', score);

        // Reset the linked list
        crsProfile.reset();
    } catch (error: any) {
        console.error('Error:', error);
    }
}

main();