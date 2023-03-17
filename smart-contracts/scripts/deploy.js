async function main() {
    const ZoocietyNifty = await hre.ethers.getContractFactory("FoodStorage");
    const token = await ZoocietyNifty.deploy();
    await token.deployed();
    console.log("Deployed Contract Address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
