// config.js

// Configuration settings for the bot connection
export const botArgs = {
    host: 'hypixel.net',
    port: 25565,
    version: '1.8',
    auth: 'microsoft'
};

// List of operators (authorized users) who can control the bot
export const Operators = [
    "chickendoodle08",
    "onvm",
    "Tusr",
    "6nna",
    "Callanplays",
    "h00dz",
    "Cashn",
    "NOO6",
    "Mihd",
    "Dharma",
    "skywurs",
    "Cheese_Sheep",
    "ENNO20",
    "Ohpls_",
    "duckman_1013",
    "Agentwinters_"
];

// List of gifters for advertising purposes
export const gifter = ["Tusr"];

// Bot settings configuration
export const botSettings = [
    {
        gmail: "callanplays@proton.me", // Email associated with the bot
        settings: {
            autoVisitUsername: "Agentwinters_", // Auto visit username
            autoVisitSlot: 1, // Slot to visit
            wholesomeAdvertise: false, // Whether to use wholesome advertising
            wholesomeDelay: 5, // Delay for wholesome advertising in minutes
            rejoinDelay: 180, // Delay for bot to rejoin after being kicked, in minutes
            housingID: 1 // ID of the housing
        }
    }
];