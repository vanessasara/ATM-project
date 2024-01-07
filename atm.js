"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
class User {
    id;
    pin;
    balance;
    constructor(id, pin) {
        this.id = id;
        this.pin = pin;
        this.balance = Math.floor(Math.random() * 5000) + 1000;
    }
}
class ATM {
    users;
    constructor() {
        this.users = new Map();
    }
    addUser(id, pin) {
        const user = new User(id, pin);
        this.users.set(id, user);
    }
    authenticateUser(id, pin) {
        const user = this.users.get(id);
        if (user && user.pin === pin) {
            return user;
        }
        return undefined;
    }
    async start() {
        console.log('Welcome to the ATM!\n');
        const { userId, userPin } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'userId',
                message: 'Enter User ID:',
            },
            {
                type: 'password',
                name: 'userPin',
                message: 'Enter PIN:',
            },
        ]);
        const authenticatedUser = this.authenticateUser(userId, userPin);
        if (authenticatedUser) {
            console.log(`Welcome, ${userId}!\n`);
            await this.mainMenu(authenticatedUser);
        }
        else {
            console.log('Invalid User ID or PIN. Exiting...\n');
        }
    }
    async mainMenu(user) {
        while (true) {
            const { choice } = await inquirer_1.default.prompt({
                type: 'list',
                name: 'choice',
                message: 'ATM Menu:',
                choices: [
                    'Check Balance',
                    'Withdraw Money',
                    'Exit',
                ],
            });
            switch (choice) {
                case 'Check Balance':
                    console.log(`Your Balance: $${user.balance}\n`);
                    break;
                case 'Withdraw Money':
                    const { amount } = await inquirer_1.default.prompt({
                        type: 'number',
                        name: 'amount',
                        message: 'Enter withdrawal amount:',
                    });
                    if (amount <= user.balance) {
                        user.balance -= amount;
                        console.log(`Withdrawal successful! Remaining balance: $${user.balance}\n`);
                    }
                    else {
                        console.log('Insufficient funds.\n');
                    }
                    break;
                case 'Exit':
                    console.log('Exiting ATM. Goodbye!\n');
                    process.exit(0);
                default:
                    console.log('Invalid choice. Please try again.\n');
            }
        }
    }
}
// Create an instance of the ATM
const atm = new ATM();
// Generate random user data
for (let i = 1; i <= 5; i++) {
    const userId = `user${i}`;
    const pin = Math.floor(Math.random() * 9000) + 1000;
    atm.addUser(userId, pin.toString());
}
// Start the ATM application
atm.start();
