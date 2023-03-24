const { expect } = require("chai");

describe("Zoociety SmartContract System", function () {
    let SmartContract;
    let Contract;
    let owner;
    let user1;
    let user2;
    let user3;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        SmartContract = await ethers.getContractFactory("FoodStorage");
        [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();
        Contract = await SmartContract.deploy();
    });

    describe("Registration System", function () {
        it("Should register crops", async function () {
            await Contract.connect(owner).registerCrop("BROCOLLI");
            expect(await Contract.getCrop(0)).to.equal(
                "BROCOLLI"
            );
        });
        it("Should not register crops", async function () {
            await Contract.connect(owner).registerCrop("BROCOLLI");
            await expect(Contract.connect(owner).registerCrop("POTATO")).to.be.revertedWith(
                "With crops already."
            );
        });
        it("Should register drivers", async function () {
            await Contract.connect(owner).registerDriver(user1.address, "RALDBLOX", true);
            expect(await Contract.getDriver(user1.address)).to.equal(
                "RALDBLOX"
            );
        });
    });
    describe("Store Data", function () {
        it("Should store data", async function () {
            await Contract.connect(owner).registerCrop("BROCOLLI");
            await Contract.connect(owner).registerDriver(user1.address, "RALDBLOX", true);
            await Contract.connect(owner).recordFoodStorageData("10", "1", "1", "1", "1");
            await Contract.connect(owner).recordFoodStorageData("15", "1", "1", "1", "1");
            const data = await Contract.getFoodStorageDataByIndex(0);
            const data1 = await Contract.getFoodStorageDataByIndex(1);
            console.log(data);
            console.log(data1);
        });
    });
    describe("Store Location", function () {
        it("Should record location", async function () {
            await Contract.connect(owner).registerCrop("BROCOLLI");
            await Contract.connect(owner).registerDriver(user1.address, "RALDBLOX", true);
            expect(await Contract.isDriver(user1.address)).to.equal(
                true
            );
            await Contract.connect(user1).startLocationTracking("10", "11");
            await Contract.connect(user1).endLocationTracking("55", "23", "100");
            const data = await Contract.getDeliveryDataByIndex(0);
            console.log(data);
        });
    });
    describe("2 Delivery Cycles", function () {
        it("Should complete two cycles", async function () {
            await Contract.connect(owner).registerCrop("BROCOLLI");
            await Contract.connect(owner).registerDriver(user1.address, "RALDBLOX", true);
            expect(await Contract.isDriver(user1.address)).to.equal(
                true
            );
            await Contract.connect(user1).startLocationTracking("10", "11");
            await Contract.connect(user1).endLocationTracking("15", "23", "100");
            const data = await Contract.getDeliveryDataByIndex(0);
            console.log(data);
            await Contract.connect(owner).registerCrop("CAULIFLOWER");
            expect(await Contract.isDriver(user1.address)).to.equal(
                true
            );
            await Contract.connect(user1).startLocationTracking("1", "2");
            await Contract.connect(user1).endLocationTracking("12", "21", "33");
            const data1 = await Contract.getDeliveryDataByIndex(1);
            console.log(data1);
        });
    });
});
