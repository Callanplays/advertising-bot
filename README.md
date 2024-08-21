# Minecraft Advertising Bot

This project is a Minecraft bot designed for automating various tasks on the Hypixel network, with a primary focus on advertising for housings & guilds. It leverages the Mineflayer library to interact with the Minecraft server and perform a variety of functions such as handling chat messages, joining parties, advertising, and more.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Commands](#commands)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

### Prerequisites

Ensure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Steps

1. Clone the repository.
    ```sh
    git clone https://github.com/callanplays/advertising-bot
    cd advertising-bot
    ```
2. Install the required dependencies.
    ```sh
    npm install
    ```
3. Start the bot.
    ```sh
    node index.js
    ```
4. Optional:
   ```
   Visit http://localhost:3007 to view a prismarine-viewer instance of the bot.
   ```
   
## Features

### 1. Automated Advertising
- Automatically sends advertisements in hypixel lobbies.
- Rotates through different randomized advertising messages to avoid spam detection.

### 2. Chat Commands
- Responds to specific commands sent by authorized users to perform tasks such as restarting, reporting, and more.

### 3. Event Handling
- Listens to several Minecraft events such as login, kick, spawn, and more to handle them effectively.

### 4. Skyblock Support
- Special handling for advertising in Hypixel Skyblock.

## Commands
The bot responds to the following commands sent in the chat by authorized users:
| Command       | Description                                           |
|---------------|-------------------------------------------------------|
| `.restart`    | Restarts the bot.                                      |
| `.cr <user>`  | Reports a user for chat abuse.                         |
| `.manualAdv <type>` | Manually sends an advertisement of the given type.|
| `.startAdv`   | Starts the advertisement loop.                          |
| `.come`       | Moves to the player's position who issued the command. |
| `.attack`     | Attacks the nearest player.                            |
| `.stop`       | Stops any ongoing advertisement.                       |
| `.skyblockAdv`| Starts the Skyblock advertisement loop.                |

## Configuration
Edit the [config.mjs](./config.js) file to configure bot settings.

### Example Configuration

```javascript
export const botArgs = {
    host: 'hypixel.net',
    port: 25565,
    version: '1.8',
    auth: 'microsoft'
};
export const Operators = [
    "operator1",
    "operator2"
];

export const gifter = ["gifter"];
export const botSettings = [
    {
        gmail: "email@emailservice.sus", // Email associated with the bot
        settings: {
            autoVisitUsername: "House owner"", // Auto visit username
            autoVisitSlot: 1, // Slot to visit
            wholesomeAdvertise: false, // Whether to use wholesome advertising
            wholesomeDelay: 5, // Delay for wholesome advertising in minutes
            rejoinDelay: 180, // Delay for bot to rejoin after being kicked, in minutes
            housingID: 1 // ID of the housing
        }
    }
];
```

## Contributing

1. Fork the repo.
2. Create your feature branch:
    ```sh
    git checkout -b feature/new-feature
    ```
3. Commit your changes:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature/new-feature
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries, please reach out to:

- **Chickendoodle08**: chinkn on Discord
- **Callan**: callanftw on Discord