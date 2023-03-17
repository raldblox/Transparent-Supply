# IoT: Transparent Supply

This project is a blockchain-based solution for transparent supply chain with logistics solutions and real-time recording of data from IoT device modules.

## Deployment

The `smart-contracts` for this project are deployed on the Polygon Mumbai network. You can find the deployed contracts at the following addresses:

- `FoodStorage.sol`: [0x35f1c5493c1733E2b32DD5dCBD0D189BFF920daD](https://mumbai.polygonscan.com/address/0x35f1c5493c1733E2b32DD5dCBD0D189BFF920daD#code)


## Functionalities

### Food Storage Tracking

#### Registering Food/Crops

To register crops for delivery, use the `registerCrop` function in the `FoodStorage` contract. This function requires the following parameters:

- `cropName`: The name of the crop/food to be delivered.

#### Recording Food Storage Data

To record food storage data, use the `recordFoodStorageData` function in the `FoodStorage` contract. This function requires the following parameters:

- `temperature`: The temperature of the storage environment.
- `humidity`: The humidity of the storage environment.
- `ethylene`: The ethylene level in the storage environment.
- `oxygen`: The oxygen level in the storage environment.
- `carbonDioxide`: The carbon dioxide level in the storage environment.

#### Retrieving Storage Data

To retrieve recorded food storage data, use the `getFoodStorageData` function. This function requires the following parameter:

- `index`: The index of the recorded data.

The function returns a tuple containing the following elements:

- `txBlock`: The block number where the data was recorded.
- `timestamp`: The timestamp when the data was recorded.
- `temperature`: The temperature during the storage.
- `humidity`: The humidity during the storage.
- `ethylene`: The ethylene level during the storage.
- `oxygen`: The oxygen level during the storage.
- `carbondioxide`: The carbon dioxide level during the storage.

To retrieve recorded delivery cycle data, use the `getDeliveryDataByIndex` function. This function requires the following parameter:

- `index`: The index of the recorded data.

The function returns a tuple containing the following elements:

- `cropInfo`: The name of the crop/food being delivered.
- `driverName`: The name of the driver.
- `location1`: An object containing the (longitude, latitude) coordinate of the starting location.
- `location2`: An object containing the (longitude, latitude) coordinate of the ending location.
- `departure`: An object containing the block.timestamp and block.number of the departure time.
- `arrival`: An object containing the block.timestamp and block.number of the arrival time.
- `distanceTravelled`: The distance travelled during the delivery.

### Delivery Tracking

#### Registering Crops

To register crops for delivery, use the `registerCrop` function in the `FoodStorage` contract. This function requires the following parameter:

- `cropName`: The name of the crop/food to be delivered.

#### Registering the Driver

To register the driver who will make the delivery, use the `registerDriver` function. This function requires the following parameters:

- `driverAddress`: The wallet address of the driver.
- `driverName`: The name of the driver.
- `driverStatus`: The status of the driver (true or false).

#### Starting the Delivery Cycle

To start the delivery cycle, use the `startLocationTracking` function. This function requires the following parameters:

- `startLongitude`: The longitude of the starting location.
- `startLatitude`: The latitude of the starting location.

#### Ending the Delivery Cycle

To end the delivery cycle, use the `endLocationTracking` function. This function requires the following parameters:

- `endLongitude`: The longitude of the ending location.
- `endLatitude`: The latitude of the ending location.
- `distanceTravelled`: The distance travelled during the delivery.

#### Retrieving Delivery Data

To retrieve recorded delivery cycle data, use the `getDeliveryDataByIndex` function. This function requires the following parameter:

- `index`: The index of the recorded data.

The function returns a tuple containing the following elements:

- `cropInfo`: The name of the crop/food being delivered.
- `driverName`: The name of the driver.
- `location1`: An object containing the (longitude, latitude) coordinate of the starting location.
- `location2`: An object containing the (longitude, latitude) coordinate of the ending location.
- `departure`: An object containing the block.timestamp and block.number of the departure time.
- `arrival`: An object containing the block.timestamp and block.number of the arrival time.
- `distanceTravelled`: The distance travelled during the delivery.


## Storing and Retrieving Data

Both the food storage and delivery tracking functionalities allow for the retrieval of data using the index of the recorded data. This can be useful for auditing purposes or to track the history of the food being delivered.

It's important to note that the recorded data is public and can be accessed by anyone with access to the Ethereum network. Therefore, it's crucial to ensure that sensitive information is not recorded on the blockchain.

## Smart Contracts

The smart contracts for this project are written in Solidity and can be found in the `smart-contracts/contracts` directory.

- `FoodStorage.sol`: This contract is used for recording the data of the food storage and recording the data of the delivery process.

### Testing Locally

Automated tests for the smart contracts can be found in the `smart-contracts/test directory`. To run the tests, navigate to the smart-contracts directory and run the following command:

```
npx hardhat test
```

## Web UI

This project also includes a web UI built with Next.js and TailwindCSS. To start the web UI, navigate to the `web-app` directory and run the following command:

```
npm install
npm run dev
```

The web UI can then be accessed at `http://localhost:3000`. Please note that the web UI requires a MetaMask or Web3-enabled wallet to interact with the smart contract.

## Contributing

Contributions to this project are welcome. If you're interested in contributing, please fork the repository and submit a pull request.

## Contact

If you have any questions or concerns about this project, please feel free to contact raldblox@outlook.com.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/): For their Solidity smart contract library and their comprehensive documentation on blockchain development.
- [Hardhat](https://hardhat.org/): For their development environment and testing framework for Ethereum development.
- [Polygon](https://polygon.technology/): For their fast and low-cost blockchain network.
- [Ethers.js](https://docs.ethers.io/v5/): For their library for interacting with the Ethereum blockchain and their comprehensive documentation.
- [Next.js](https://nextjs.org/): For their React-based web framework.
- [TailwindCSS](https://tailwindcss.com/): For their utility-first CSS framework.
