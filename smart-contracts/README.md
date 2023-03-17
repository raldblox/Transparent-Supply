# Hardhat Project

Some hardhat commands:

```shell
npx hardhat help
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network mumbai
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```

## Food Storage Tracking

- Register the crops to deliver using `registerCrop`
  - Parameters:
    - Crop/food name (e.g. Brocolli, Cauliflower, Beef)
- Record food storage data by using `recordFoodStorageData`
  - Parameters:
    - temperature
    - humidity
    - ethylene
    - oxygen
    - carbondioxide
- Retrieve recorded food storage data using `getFoodStorageDataByIndex`

## Delivery Tracking

- Register the crops to deliver using `registerCrop`
  - Parameters:
    - Crop/food name (e.g. Brocolli, Cauliflower, Beef)
- Register the driver who will deliver using `registerDriver`
  - Parameters:
    - Driver's Wallet Address
    - Driver's Name
    - Driver Status (true or false)
- Start delivery cycle using `startLocationTracking`
  - Parameters:
    - Longitude
    - Latitude
- Finish delivery cycle using `endLocationTracking`
  - Parameters:
    - Longitude
    - Latitude
    - Distance Travelled
- Retrieve delivery data using `getDeliveryDataByIndex`
