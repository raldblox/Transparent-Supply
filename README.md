# IoT: Transparent Supply

This project is a blockchain-based solution for transparent supply chain with logistics solutions and real-time recording of data from IoT device modules.

## Deployment

The smart contracts for this project are deployed on the Polygon Mumbai network. You can find the deployed contracts at the following addresses:

- `FoodStorage.sol`: [0x35f1c5493c1733E2b32DD5dCBD0D189BFF920daD](https://mumbai.polygonscan.com/address/0x35f1c5493c1733E2b32DD5dCBD0D189BFF920daD#code)

## Functionalities

### Food Storage Tracking

#### Registering Crops

To register crops for delivery, use the `registerCrop` function in the `FoodStorage` contract. This function requires the following parameters:

- `cropName`: The name of the crop/food to be delivered.

#### Recording Food Storage Data

To record food storage data, use the `recordFoodStorageData` function in the `FoodStorage` contract. This function requires the following parameters:

- `temperature`: The temperature of the storage environment.
- `humidity`: The humidity of the storage environment.
- `ethylene`: The ethylene level in the storage environment.
- `oxygen`: The oxygen level in the storage environment.
- `carbonDioxide`: The carbon dioxide level in the storage environment.

#### Retrieving Food Storage Data

To retrieve recorded food storage data, use the `getFoodStorageDataByIndex` function in the `FoodStorage` contract. This function requires the following parameter:

- `index`: The index of the recorded data.

### Delivery Tracking

#### Registering Crops

To register crops for delivery, use the `registerCrop` function in the `DeliveryTracking` contract. This function requires the following parameter:

- `cropName`: The name of the crop/food to be delivered.

#### Registering the Driver

To register the driver who will make the delivery, use the `registerDriver` function in the `DeliveryTracking` contract. This function requires the following parameters:

- `driverAddress`: The wallet address of the driver.
- `driverName`: The name of the driver.
- `driverStatus`: The status of the driver (true or false).

#### Starting the Delivery Cycle

To start the delivery cycle, use the `startLocationTracking` function in the `DeliveryTracking` contract. This function requires the following parameters:

- `startLongitude`: The longitude of the starting location.
- `startLatitude`: The latitude of the starting location.

#### Ending the Delivery Cycle

To end the delivery cycle, use the `endLocationTracking` function in the `DeliveryTracking` contract. This function requires the following parameters:

- `endLongitude`: The longitude of the ending location.
- `endLatitude`: The latitude of the ending location.
- `distanceTravelled`: The distance travelled during the delivery.

#### Retrieving Delivery Data

To retrieve delivery data, use the `getDeliveryDataByIndex` function in the `DeliveryTracking` contract. This function requires the following parameter:

- `index`: The index of the recorded data.

## Retrieving Data

Both the food storage and delivery tracking functionalities allow for the retrieval of data using the index of the recorded data. This can be useful for auditing purposes or to track the history of the food being delivered.

It's important to note that the recorded data is public and can be accessed by anyone with access to the Ethereum network. Therefore, it's crucial to ensure that sensitive information is not recorded on the blockchain.

## Smart Contracts

The smart contracts for this project are written in Solidity and can be found in the `smart-contracts/contracts` directory.

- `FoodStorage.sol`: This contract is used for recording the data of the food storage and recording the data of the delivery process.

### Testing

Automated tests for the smart contracts can be found in the `test` directory. To run the tests, navigate to the project root directory and run the following command:

``bash

## Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/): For their Solidity smart contract library and their comprehensive documentation on blockchain development.
- [Hardhat](https://hardhat.org/): For their development environment and testing framework for Ethereum development.
- [Polygon](https://polygon.technology/): For their fast and low-cost blockchain network.
