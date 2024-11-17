const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./rock_paper_sol_CoinFlip.abi", "utf-8");
  const binary = fs.readFileSync("./rock_paper_sol_CoinFlip.bin", "utf-8");

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("Deploying the contract...");
  const contract = await contractFactory.deploy(); 
  await contract.waitForDeployment(); 

  console.log(`Contract deployed at address: ${contract.target}`);

  console.log("Checking contract balance...");
  const balance = await contract.getContractBalance();
  console.log(`Initial contract balance: ${ethers.formatEther(balance)} ETH`);

  console.log("Depositing funds into the contract...");
  const depositTx = await wallet.sendTransaction({
    to: contract.target,
    value: ethers.parseEther("0.00000001"),
  });
  await depositTx.wait();
  console.log("Funds deposited.");

  const updatedBalance = await contract.getContractBalance();
  console.log(`Updated contract balance: ${ethers.formatEther(updatedBalance)} ETH`);

  console.log("Playing the game...");
  const betAmount = ethers.parseEther("0.00000001"); 
  const choice = 1; 
  const playTx = await contract.flip(betAmount, choice, {
    value: betAmount, 
   });
  const playReceipt = await playTx.wait();

  console.log("Game played. Check events for result.");
  const events = playReceipt.logs.map((log) => contract.interface.parseLog(log));
  console.log(events);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
