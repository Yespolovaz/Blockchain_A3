const contractAddress = "0x412A5d897892433050EC4Ed6F72D947FDe02Ca66"; 
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"betAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"choice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"result","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"GameResult","type":"event"},{"inputs":[],"name":"depositFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_bet","type":"uint256"},{"internalType":"uint256","name":"_choice","type":"uint256"}],"name":"flip","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isContractActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

let signer;
let contract;

provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Connected to contract:", contract);
  });
});

async function playGame() {
  try {
    const bet = document.getElementById("bet").value; 
    const choice = document.getElementById("choice").value; 
    const tx = await contract.flip(ethers.utils.parseEther(bet), parseInt(choice), { value: ethers.utils.parseEther(bet) });
    await tx.wait();
    alert("Game played successfully. Check the contract logs!");
  } catch (error) {
    console.error("Error playing the game:", error);
    alert("Error playing the game. Check console for details.");
  }
}

async function getContractBalance() {
  try {
    const balance = await contract.getContractBalance();
    document.getElementById("contract-balance").innerText = ethers.utils.formatEther(balance) + " ETH";
  } catch (error) {
    console.error("Error fetching contract balance:", error);
  }
}