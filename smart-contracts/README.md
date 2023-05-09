# IoT: Transparent Supply

[DEPLOYED SMART CONTRACT ON POLYGON MUMBAI](https://mumbai.polygonscan.com/address/0xc48fdf73Aed5Fee03224B0456A6c8396b2d6F165#code)

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

Some hardhat commands:

```shell
npx hardhat help
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network mumbai
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```
