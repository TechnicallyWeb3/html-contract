import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import fs from "fs";
import path from "path";

describe("Web", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWeb() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const web = await hre.viem.deployContract("WebContract");

    const publicClient = await hre.viem.getPublicClient();

    return {
      web,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Root file adding", function () {
    it("Should set /index.html", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', '40kb.txt');
      const html = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/index.html";

      await web.write.setHTML([contractPath, html]);

      expect(await web.read.getHTML([contractPath])).to.equal(html);
    });

    it("Should set /styles.css", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', 'styles.css');
      const css = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/style.css";

      await web.write.setCSS([contractPath, css]);

      expect(await web.read.getCSS([contractPath])).to.equal(css);
    });

    it("Should set /script.js", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', 'script.txt');
      const js = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/script.js";

      await web.write.setJS([contractPath, js]);

      expect(await web.read.getJS([contractPath])).to.equal(js);
    });
  });

  describe("File adding with deeper directories", function () {
    it("Should set /nested/index.html", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', 'index.html');
      const html = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/nested/index.html";

      await web.write.setHTML([contractPath, html]);

      expect(await web.read.getHTML([contractPath])).to.equal(html);
    });

    it("Should set /nested/styles/main.css", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', 'styles.css');
      const css = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/nested/styles/main.css";

      await web.write.setCSS([contractPath, css]);

      expect(await web.read.getCSS([contractPath])).to.equal(css);
    });

    it("Should set /scripts/utils/script.js", async function () {
      const pathToFile = path.resolve(__dirname, 'samples', 'script.txt');
      const js = fs.readFileSync(pathToFile, 'utf8');
      const { web } = await loadFixture(deployWeb);
      const contractPath = "/scripts/utils/script.js";

      await web.write.setJS([contractPath, js]);

      expect(await web.read.getJS([contractPath])).to.equal(js);
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.write.withdraw()).to.be.rejectedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We retrieve the contract with a different account to send a transaction
  //       const lockAsOtherAccount = await hre.viem.getContractAt(
  //         "Lock",
  //         lock.address,
  //         { client: { wallet: otherAccount } }
  //       );
  //       await expect(lockAsOtherAccount.write.withdraw()).to.be.rejectedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.write.withdraw()).to.be.fulfilled;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount, publicClient } =
  //         await loadFixture(deployOneYearLockFixture);

  //       await time.increaseTo(unlockTime);

  //       const hash = await lock.write.withdraw();
  //       await publicClient.waitForTransactionReceipt({ hash });

  //       // get the withdrawal events in the latest block
  //       const withdrawalEvents = await lock.getEvents.Withdrawal();
  //       expect(withdrawalEvents).to.have.lengthOf(1);
  //       expect(withdrawalEvents[0].args.amount).to.equal(lockedAmount);
  //     });
  //   });
  // });
});
