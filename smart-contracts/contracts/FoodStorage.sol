/**
 *
 * ░█▀▄░█▀█░█░░░█▀▄░█▀▄░█░░░█▀█░█░█
 * ░█▀▄░█▀█░█░░░█░█░█▀▄░█░░░█░█░▄▀▄
 * ░▀░▀░▀░▀░▀▀▀░▀▀░░▀▀░░▀▀▀░▀▀▀░▀░▀
 *
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 *
 * @author github.com/raldblox
 * @title A smart contract that tracks/records Food Storage data(e.g. temperature, humidity, temperature,
 * ethylene, oxygen, CO2) from IoT sensor devices, register driver information(full name, wallet address),
 * and tracks GPS location(longitude, latitude) of each delivery cycle.
 *
 */
contract FoodStorage {
    using Strings for uint256;
    address public masterAdmin;
    mapping(address => bool) public isAdmins;

    struct foodstorage {
        uint256 txBlock;
        uint256 timestamp;
        uint256 cropID;
        string temperature;
        string humidity;
        string ethylene;
        string oxygen;
        string carbondioxide;
    }

    struct locationdata {
        string crops;
        uint256 deliveryID;
        address driverID;
        string longitude1;
        string latitude1;
        string longitude2;
        string latitude2;
        uint256 departureTxBlock;
        uint256 departureTime;
        uint256 arrivalTxBlock;
        uint256 arrivalTime;
        string distanceTravelled;
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
        masterAdmin = msg.sender;
        isAdmins[msg.sender] = true;
    }

    modifier isAdmin() {
        require(isAdmins[msg.sender] || masterAdmin == msg.sender);
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

    // Register admins
    function registerAdmin(
        address _walletAddress,
        string memory _name,
        bool _isDriver
    ) public {
        require(masterAdmin == msg.sender, "Not the master admin.");
        driverNames[_walletAddress] = _name;
        isDrivers[_walletAddress] = _isDriver;
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

    function isAuthorized(address _walletAddress) external view returns (bool) {
        return isAdmins[_walletAddress];
    }

    // Record food storage data
    function recordFoodStorageData(
        string memory _temperature,
        string memory _humidity,
        string memory _ethylene,
        string memory _oxygen,
        string memory _carbondioxide
    ) public {
        require(isFilled, "Food storage is empty");
        foodstorage storage data = foodstorages.push();
        data.txBlock = block.number;
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
            uint256 txBlock,
            uint256 timestamp,
            string memory temperature,
            string memory humidity,
            string memory ethylene,
            string memory oxygen,
            string memory carbondioxide
        )
    {
        return (
            foodstorages[index].txBlock,
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
        string memory _longitude1,
        string memory _latitude1
    ) public {
        require(isDrivers[msg.sender], "Not a driver");
        uint256 deliveryId = deliveryIDs - 1;
        assignedDeliveries[msg.sender] = deliveryId;
        if (!activeDeliveries[deliveryId]) {
            locationdata storage data = locationdatas.push();
            data.crops = crops[deliveryId];
            data.deliveryID = deliveryId;
            data.driverID = msg.sender;
            data.departureTxBlock = block.number;
            data.longitude1 = _longitude1;
            data.latitude1 = _latitude1;
            data.departureTime = block.timestamp;
            activeDeliveries[deliveryId] = true;
        }
    }

    // Finish Delivery
    function endLocationTracking(
        string memory _longitude2,
        string memory _latitude2,
        string memory _distanceTravelled
    ) public {
        uint256 deliveryID = getAssignedDelivery(msg.sender);
        require(activeDeliveries[deliveryID], "Inactive Delivery");
        locationdata storage data = locationdatas[deliveryID]; // get the latest starting location data
        data.arrivalTxBlock = block.number;
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
                locationdatas[index].longitude1,
                ",",
                locationdatas[index].latitude1,
                ")"
            )
        );
        string memory location2_ = string(
            abi.encodePacked(
                "(",
                locationdatas[index].longitude2,
                ",",
                locationdatas[index].latitude2,
                ")"
            )
        );
        string memory departure_ = string(
            abi.encodePacked(
                Strings.toString(locationdatas[index].departureTime),
                " - BLOCK:",
                Strings.toString(uint256(locationdatas[index].departureTxBlock))
            )
        );
        string memory arrival_ = string(
            abi.encodePacked(
                Strings.toString(locationdatas[index].arrivalTime),
                " - BLOCK:",
                Strings.toString(uint256(locationdatas[index].arrivalTxBlock))
            )
        );
        string memory distanceTravelled_ = locationdatas[index]
            .distanceTravelled;
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
