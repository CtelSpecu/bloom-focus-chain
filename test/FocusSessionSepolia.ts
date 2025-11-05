import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { FocusSession } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("FocusSessionSepolia", function () {
  let signers: Signers;
  let focusSessionContract: FocusSession;
  let focusSessionContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const FocusSessionDeployment = await deployments.get("FocusSession");
      focusSessionContractAddress = FocusSessionDeployment.address;
      focusSessionContract = await ethers.getContractAt("FocusSession", FocusSessionDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("log a focus session with 25 minutes", async function () {
    steps = 10;
    this.timeout(4 * 40000);

    progress("Encrypting 25 minutes...");
    const encryptedMinutes = await fhevm
      .createEncryptedInput(focusSessionContractAddress, signers.alice.address)
      .add32(25)
      .encrypt();

    progress(
      `Call logSession(25) FocusSession=${focusSessionContractAddress} handle=${ethers.hexlify(encryptedMinutes.handles[0])} signer=${signers.alice.address}...`,
    );
    const tx = await focusSessionContract
      .connect(signers.alice)
      .logSession(encryptedMinutes.handles[0], encryptedMinutes.inputProof);
    await tx.wait();

    progress(`Call FocusSession.getSessionCount()...`);
    const encryptedCountAfter = await focusSessionContract.connect(signers.alice).getSessionCount();
    expect(encryptedCountAfter).to.not.eq(ethers.ZeroHash);

    progress(`Decrypting FocusSession.getSessionCount()=${encryptedCountAfter}...`);
    const clearCountAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedCountAfter,
      focusSessionContractAddress,
      signers.alice,
    );
    progress(`Clear FocusSession.getSessionCount()=${clearCountAfter}`);

    progress(`Call FocusSession.getTotalMinutes()...`);
    const encryptedMinutesAfter = await focusSessionContract.connect(signers.alice).getTotalMinutes();

    progress(`Decrypting FocusSession.getTotalMinutes()=${encryptedMinutesAfter}...`);
    const clearMinutesAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedMinutesAfter,
      focusSessionContractAddress,
      signers.alice,
    );
    progress(`Clear FocusSession.getTotalMinutes()=${clearMinutesAfter}`);

    // Verify that session was logged (count >= 1 after logging)
    expect(clearCountAfter).to.be.gte(1);
    // Verify minutes include at least 25
    expect(clearMinutesAfter).to.be.gte(25);
  });

  it("set weekly goal to 600 minutes", async function () {
    steps = 6;
    this.timeout(4 * 40000);

    progress("Encrypting goal: 600 minutes...");
    const encryptedGoal = await fhevm
      .createEncryptedInput(focusSessionContractAddress, signers.alice.address)
      .add32(600)
      .encrypt();

    progress(
      `Call setWeeklyGoal(600) FocusSession=${focusSessionContractAddress} handle=${ethers.hexlify(encryptedGoal.handles[0])} signer=${signers.alice.address}...`,
    );
    const tx = await focusSessionContract
      .connect(signers.alice)
      .setWeeklyGoal(encryptedGoal.handles[0], encryptedGoal.inputProof);
    await tx.wait();

    progress(`Call FocusSession.getWeeklyGoal()...`);
    const encryptedGoalAfter = await focusSessionContract.connect(signers.alice).getWeeklyGoal();
    expect(encryptedGoalAfter).to.not.eq(ethers.ZeroHash);

    progress(`Decrypting FocusSession.getWeeklyGoal()=${encryptedGoalAfter}...`);
    const clearGoalAfter = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedGoalAfter,
      focusSessionContractAddress,
      signers.alice,
    );
    progress(`Clear FocusSession.getWeeklyGoal()=${clearGoalAfter}`);

    expect(clearGoalAfter).to.eq(600);
  });
});

