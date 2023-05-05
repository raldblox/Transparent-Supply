# WORKAROUNDS

## FULL DELIVERY CYCLE

1. Deploy `FoodStorage.sol`
2. Get contractABI from polygonscan
3. Register crops using `registerCrop()` function
4. Register driver using `registerDriver()` function
5. When crop registration is successful, registered driver can `startLocationTracking()`
6. After successful delivery, driver can now `endLocationTracking`

## ADDING AND READING FOOD STORAGE DATA

1. When foodcrop is registered and not delivered yet, admin can `recordFoodStorageData()`
2. Retrieve recorded data using `getFoodStorageDataByIndex()`
3. Retrieve full delivery data cycle `getDeliveryDataByIndex()`
