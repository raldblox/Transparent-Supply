/**
 *
 * ░█▀▄░█▀█░█░░░█▀▄░█▀▄░█░░░█▀█░█░█
 * ░█▀▄░█▀█░█░░░█░█░█▀▄░█░░░█░█░▄▀▄
 * ░▀░▀░▀░▀░▀▀▀░▀▀░░▀▀░░▀▀▀░▀▀▀░▀░▀
 *
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 *
 * @author github.com/raldblox
 * @title A smart contract that tracks/records Food Storage data(e.g. temperature, humidity, temperature,
 * ethylene, oxygen, CO2) from IoT sensor devices, register driver information(full name, wallet address),
 * and tracks GPS location(longitude, latitude) of each delivery cycle.
 *
 */
contract FoodStorage {
    using SafeMath for uint256;
    address public admin;

    struct foodstorage {
        bytes32 txhash;
        uint256 timestamp;
        uint256 cropID;
        uint256 temperature;
        uint256 humidity;
        uint256 ethylene;
        uint256 oxygen;
        uint256 carbondioxide;
    }

    struct locationdata {
        string crops;
        uint256 deliveryID;
        address driverID;
        uint256 longitude1;
        uint256 latitude1;
        uint256 longitude2;
        uint256 latitude2;
        bytes32 departureTx;
        uint256 departureTime;
        bytes32 arrivalTx;
        uint256 arrivalTime;
        uint256 distanceTravelled;
    }

    uint256 public deliveryIDs;
    uint256 public driverCount;

    foodstorage[] public foodstorages;
    locationdata[] public locationdatas;

    // Map deliveryID to Crops
    mapping(uint256 => string) public crops;

    bool public isFilled;
    bool public forDelivery;

    // Map Food Storage IDs to Storage Names
    mapping(uint256 => string) public foodStorageNames;

    // Map driver IDs to storage IDs
    mapping(address => uint256) public assignedDeliveries;

    // Map delivery status of delivery IDs
    mapping(uint256 => bool) public activeDeliveries;

    // Map addresses to drivers names
    mapping(address => string) public driverNames;
    mapping(address => bool) public isDrivers;

    constructor() {
        admin = msg.sender;
    }

    modifier isAdmin() {
        require(admin == msg.sender);
        _;
    }

    // Register crops stored in food storage
    function registerCrop(string memory _crops) public isAdmin {
        require(!isFilled, "With crops already.");
        require(!forDelivery, "With crops already.");
        crops[deliveryIDs] = _crops;
        isFilled = true;
        deliveryIDs++;
    }

    function getCrop(
        uint256 _deliveryID
    ) external view returns (string memory) {
        return crops[_deliveryID];
    }

    // Register drivers
    function registerDriver(
        address _walletAddress,
        string memory _driverName,
        bool _isDriver
    ) public isAdmin {
        driverNames[_walletAddress] = _driverName;
        isDrivers[_walletAddress] = _isDriver;
        driverCount++;
    }

    function getDriver(
        address _walletAddress
    ) public view returns (string memory) {
        return driverNames[_walletAddress];
    }

    function isDriver(address _walletAddress) external view returns (bool) {
        return isDrivers[_walletAddress];
    }

    // Record food storage data
    function recordFoodStorageData(
        uint256 _temperature,
        uint256 _humidity,
        uint256 _ethylene,
        uint256 _oxygen,
        uint256 _carbondioxide
    ) public {
        require(isFilled, "Food storage is empty");
        foodstorage storage data = foodstorages.push();
        data.txhash = blockhash(block.number);
        data.timestamp = block.timestamp;
        data.cropID = deliveryIDs - 1;
        data.temperature = _temperature;
        data.humidity = _humidity;
        data.ethylene = _ethylene;
        data.oxygen = _oxygen;
        data.carbondioxide = _carbondioxide;
    }

    function getFoodStorageDataByIndex(
        uint256 index
    )
        public
        view
        returns (
            bytes32 txhash,
            uint256 timestamp,
            uint256 temperature,
            uint256 humidity,
            uint256 ethylene,
            uint256 oxygen,
            uint256 carbondioxide
        )
    {
        return (
            foodstorages[index].txhash,
            foodstorages[index].timestamp,
            foodstorages[index].temperature,
            foodstorages[index].humidity,
            foodstorages[index].ethylene,
            foodstorages[index].oxygen,
            foodstorages[index].carbondioxide
        );
    }

    function getStorageLength() public view returns (uint256) {
        return foodstorages.length;
    }

    // Start Delivery
    function startLocationTracking(
        uint256 _longitude1,
        uint256 _latitude1
    ) public {
        require(isDrivers[msg.sender], "Not a driver");
        uint256 deliveryId = deliveryIDs - 1;
        assignedDeliveries[msg.sender] = deliveryId;
        if (!activeDeliveries[deliveryId]) {
            locationdata storage data = locationdatas.push();
            data.crops = crops[deliveryId];
            data.deliveryID = deliveryId;
            data.driverID = msg.sender;
            data.departureTx = blockhash(block.number);
            data.longitude1 = _longitude1;
            data.latitude1 = _latitude1;
            data.departureTime = block.timestamp;
            activeDeliveries[deliveryId] = true;
        }
    }

    // Finish Delivery
    function endLocationTracking(
        uint256 _longitude2,
        uint256 _latitude2,
        uint256 _distanceTravelled
    ) public {
        uint256 deliveryID = getAssignedDelivery(msg.sender);
        require(activeDeliveries[deliveryID], "Inactive Delivery");
        locationdata storage data = locationdatas[deliveryID]; // get the latest starting location data
        data.arrivalTx = blockhash(block.number);
        data.longitude2 = _longitude2;
        data.latitude2 = _latitude2;
        data.arrivalTime = block.timestamp;
        data.distanceTravelled = _distanceTravelled;
        isFilled = false;
    }

    function getDeliveryDataByIndex(
        uint256 index
    )
        public
        view
        returns (
            string memory cropInfo,
            string memory driverName,
            string memory location1,
            string memory location2,
            string memory departure,
            string memory arrival,
            string memory distanceTravelled
        )
    {
        string memory drivername = getDriver(
            address(locationdatas[index].driverID)
        );
        string memory location1_ = string(
            abi.encodePacked(
                "(",
                Strings.toString(locationdatas[index].longitude1),
                ",",
                Strings.toString(locationdatas[index].latitude1),
                ")"
            )
        );
        string memory location2_ = string(
            abi.encodePacked(
                "(",
                Strings.toString(locationdatas[index].longitude2),
                ",",
                Strings.toString(locationdatas[index].latitude2),
                ")"
            )
        );
        string memory departure_ = string(
            abi.encodePacked(
                Strings.toString(locationdatas[index].departureTime),
                " - HASH:",
                Strings.toString(uint256(locationdatas[index].departureTx))
            )
        );
        string memory arrival_ = string(
            abi.encodePacked(
                Strings.toString(locationdatas[index].arrivalTime),
                " - HASH:",
                Strings.toString(uint256(locationdatas[index].arrivalTx))
            )
        );
        string memory distanceTravelled_ = string(
            abi.encodePacked(
                Strings.toString(locationdatas[index].distanceTravelled),
                "meters"
            )
        );
        return (
            locationdatas[index].crops,
            drivername,
            location1_,
            location2_,
            departure_,
            arrival_,
            distanceTravelled_
        );
    }

    function getAssignedDelivery(
        address _driver
    ) public view returns (uint256) {
        return assignedDeliveries[_driver];
    }
}
