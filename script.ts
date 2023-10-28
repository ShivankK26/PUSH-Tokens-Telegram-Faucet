require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { ethers } = require('ethers')
const Bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })



// Infura Project ID
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_SEPOLIA)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


const contractABI = [{
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },];


const pushContract = new ethers.Contract(process.env.PUSH_TOKEN_ADDRESS, contractABI, wallet)


Bot.on('message', (msg: { chat: { id: any } }) =>{
    const chatId = msg.chat.id;

    Bot.sendMessage(chatId, "Welcome to the PushBot. Do you want some tokens? 🤔");
    Bot.sendMessage(chatId, "To receive PUSH Tokens type /sendpushtokens command, followed by your ETH wallet address. For Example- /sendpushtokens 0xRecipientAddress")
});


Bot.onText(/\/sendpushtokens (.+)/, async(msg: { chat: { id: any } }, match: any) =>{
    const chatId = msg.chat.id;
    const recepientAddress = match[1]; // Wallet address
    const amountToSend = ethers.utils.parseUnits('10', 18); // PUSH Tokens to send

    try {
        const tx = await pushContract.transfer(recepientAddress, amountToSend, { gasLimit: 200000 })
    } catch (error) {
        Bot.sendMessage(chatId, `Error: ${error.message}`)
    }
})
