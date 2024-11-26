import { createVlayerClient } from "@vlayer/sdk";
import {
  getConfig,
  createContext,
  deployVlayerContracts,
} from "@vlayer/sdk/config";
import proverSpec from "../out/DDMemberProver.sol/DDMemberProver.json";
import verifierSpec from "../out/DDMemberVerifier.sol/DDMemberVerifier.json";
import { isAddress, WalletClient } from "viem";

const BLOCK_NUMBER = 19117727; // Adjust as necessary
const CLAIMER_ADDRESS = "0xaC56f7199E5D5361c7Ed75EB6C5B0608eFACc4b0"; // Replace as needed
const CHAIN_ID = 31337; // Local Foundry chain ID

(async () => {
  try {
    const config = getConfig();
    const {
      chain,
      ethClient,
      account: user,
      proverUrl,
    } = await createContext(config);

    const { prover, verifier } = await deployContracts({
      ethClient,
      proverArgs: [BLOCK_NUMBER],
    });

    const vlayer = createVlayerClient({ url: proverUrl });

    const { proof, owner, wasMember } = await generateProof({ vlayer, prover });

    const verificationStatus = await verifyProof({
      ethClient,
      verifier,
      proof,
      owner,
      wasMember,
      account: user,
    });

    console.log(`Final Verification Status: ${verificationStatus}`);
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1); // Exit with error
  }
})();

async function deployContracts({ ethClient, proverArgs }) {
  console.log("Deploying contracts...");

  const { prover, verifier } = await deployVlayerContracts({
    proverSpec,
    verifierSpec,
    proverArgs,
  });

  console.log(`Prover deployed at: ${prover}`);
  console.log(`Verifier deployed at: ${verifier}`);
  return { prover, verifier };
}

async function generateProof({ vlayer, prover }) {
  console.log("Generating proof...");

  const proveHash = await vlayer.prove({
    address: prover,
    proverAbi: proverSpec.abi,
    functionName: "checkDDMembership",
    args: [CLAIMER_ADDRESS],
    chainId: CHAIN_ID,
  });

  const result = await vlayer.waitForProvingResult(proveHash);
  const [proof, owner, wasMember] = result;

  if (!isAddress(owner)) {
    throw new Error(`Invalid owner address: ${owner}`);
  }

  console.log(`Proof generated. Claimer: ${owner}, WasMember: ${wasMember}`);
  return { proof, owner, wasMember };
}

async function verifyProof({
  ethClient,
  verifier,
  proof,
  owner,
  wasMember,
  account,
}: {
  ethClient: Client;
  verifier: string;
  proof: Proof;
  owner: string;
  wasMember: boolean;
  account: string;
}) {
  console.log("Verifying proof...");

  const verifyHash = await ethClient.writeContract({
    address: verifier,
    abi: verifierSpec.abi,
    functionName: "verifyDDMembership",
    args: [proof, owner, wasMember],
    account,
  });

  const receipt = await ethClient.waitForTransactionReceipt({
    hash: verifyHash,
    confirmations: 1, // Adjust confirmations if needed
    retryCount: 60,
    retryDelay: 1000,
  });

  console.log(`Verification result: ${receipt.status}`);
  return receipt.status;
}
