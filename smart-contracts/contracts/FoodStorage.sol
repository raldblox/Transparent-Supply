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
    uint256 public foodID;
    address public masterAdmin;

    struct Storage {
        uint256[] foodId;
        mapping(uint256 => string) foodcrops;
        mapping(uint256 => address) driver;
        mapping(uint256 => uint256[]) txBlock;
        mapping(uint256 => uint256[]) timestamp;
        mapping(uint256 => string[]) temperature;
        mapping(uint256 => string[]) humidity;
        mapping(uint256 => string[]) ethylene;
        mapping(uint256 => string[]) oxygen;
        mapping(uint256 => string[]) carbondioxide;
    }

    struct Delivery {
        uint256[] deliveryId;
        mapping(uint256 => bool) isFilled;
        mapping(uint256 => bool) delivered;
        mapping(uint256 => bool) onDelivery;
        mapping(uint256 => address) driverWallet;
        mapping(uint256 => string) driverName;
        mapping(uint256 => string) startlocation;
        mapping(uint256 => string) endlocation;
        mapping(uint256 => uint256) starttime;
        mapping(uint256 => uint256) endtime;
        mapping(uint256 => uint256) startBlock;
        mapping(uint256 => uint256) endBlock;
        mapping(uint256 => string) distanceTravelled;
    }

    struct Driver {
        address[] driverAddress;
        mapping(address => bool) status;
        mapping(address => string) names;
        mapping(address => uint256[]) deliveredCrops; // map address to array of deliveryIds
    }

    Delivery private deliveries;
    Storage private storages;
    Driver private drivers;

    bool public isFilled;
    bool public forDelivery;
    bool public onDelivery;

    mapping(address => bool) public isDrivers;
    mapping(address => bool) public isAdmins;

    constructor() {
        masterAdmin = msg.sender;
        isAdmins[msg.sender] = true;
        isDrivers[msg.sender] = true;
    }

    modifier isAdmin() {
        require(isAdmins[msg.sender] || masterAdmin == msg.sender);
        _;
    }

    // Register crops stored in food storage
    function registerCrop(string memory _crops) public isAdmin {
        require(!isFilled, "With crops already.");
        require(!forDelivery, "With crops already.");
        storages.foodId.push(foodID);
        storages.foodcrops[foodID] = _crops;
        deliveries.isFilled[foodID] = true;
        isFilled = true;
        forDelivery = true;
        foodID++;
    }

    function getCrop(uint256 _foodID) external view returns (string memory) {
        return storages.foodcrops[_foodID];
    }

    // Register admins
    function registerAdmin(address _walletAddress, bool _isAdmin) public {
        require(masterAdmin == msg.sender, "Not the master admin.");
        isAdmins[_walletAddress] = _isAdmin;
    }

    // Register drivers
    function registerDriver(
        address _walletAddress,
        string memory _driverName,
        bool _isDriver
    ) public isAdmin {
        drivers.driverAddress.push(_walletAddress);
        drivers.names[_walletAddress] = _driverName;
        drivers.status[_walletAddress] = _isDriver;
    }

    function getDriver(
        address _walletAddress
    ) public view returns (string memory) {
        return drivers.names[_walletAddress];
    }

    function isDriver(address _walletAddress) external view returns (bool) {
        return drivers.status[_walletAddress];
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
        storages.foodId.push(foodID - 1);
        storages.txBlock[foodID - 1].push(block.number);
        storages.timestamp[foodID - 1].push(block.timestamp);
        storages.temperature[foodID - 1].push(_temperature);
        storages.humidity[foodID - 1].push(_humidity);
        storages.ethylene[foodID - 1].push(_ethylene);
        storages.oxygen[foodID - 1].push(_oxygen);
        storages.carbondioxide[foodID - 1].push(_carbondioxide);
    }

    function getFoodDataByIndex(
        uint256 foodId
    )
        public
        view
        returns (
            string[] memory,
            string[] memory,
            string[] memory,
            string[] memory,
            string[] memory
        )
    {
        string[] memory temp = storages.temperature[foodId];
        string[] memory humid = storages.humidity[foodId];
        string[] memory ethyl = storages.ethylene[foodId];
        string[] memory oxy = storages.oxygen[foodId];
        string[] memory co2 = storages.carbondioxide[foodId];
        return (temp, humid, ethyl, oxy, co2);
    }

    function getFoodStorageDataByIndex(
        uint256 foodId
    ) public view returns (string memory, uint256[] memory, uint256[] memory) {
        string memory food = storages.foodcrops[foodId];
        uint256[] memory txblock = storages.txBlock[foodId];
        uint256[] memory time = storages.timestamp[foodId];

        return (food, txblock, time);
    }

    function getStorageLength() public view returns (uint256) {
        return (storages.foodId).length;
    }

    // Start Delivery
    function startLocationTracking(
        string memory _longitude1,
        string memory _latitude1
    ) public {
        require(isDrivers[msg.sender], "Not a driver");
        require(isFilled, "Fill in storage first");
        deliveries.driverWallet[foodID - 1] = msg.sender;
        deliveries.driverName[foodID - 1] = drivers.names[msg.sender];
        deliveries.deliveryId.push(foodID - 1);
        deliveries.startlocation[foodID - 1] = string(
            abi.encodePacked("(", _longitude1, ",", _latitude1, ")")
        );
        deliveries.starttime[foodID - 1] = block.timestamp;
        deliveries.startBlock[foodID - 1] = block.number;
        deliveries.onDelivery[foodID - 1] = true;
        onDelivery = true;
        forDelivery = false;
    }

    // Finish Delivery
    function endLocationTracking(
        string memory _longitude2,
        string memory _latitude2,
        string memory _distanceTravelled
    ) public {
        require(onDelivery, "Start location tracking first");
        deliveries.endlocation[foodID - 1] = string(
            abi.encodePacked(_longitude2, _latitude2)
        );
        deliveries.distanceTravelled[foodID - 1] = _distanceTravelled;
        deliveries.endtime[foodID - 1] = block.timestamp;
        deliveries.endBlock[foodID - 1] = block.number;
        deliveries.isFilled[foodID - 1] = false;
        deliveries.onDelivery[foodID - 1] = false;
        deliveries.delivered[foodID - 1] = true;
        onDelivery = false;
        isFilled = false;
    }

    function getDeliveryDataByIndex(
        uint256 deliveryId
    )
        public
        view
        returns (
            string memory driverName,
            string memory location1,
            string memory location2,
            string memory departure,
            string memory arrival,
            string memory distanceTravelled
        )
    {
        string memory drivername = deliveries.driverName[deliveryId];
        string memory startLocation = deliveries.startlocation[deliveryId];
        string memory endLocation = deliveries.endlocation[deliveryId];
        string memory departure_ = string(
            abi.encodePacked(
                Strings.toString(deliveries.starttime[deliveryId]),
                " - BLOCK:",
                Strings.toString(uint256(deliveries.startBlock[deliveryId]))
            )
        );
        string memory arrival_ = string(
            abi.encodePacked(
                Strings.toString(deliveries.endtime[deliveryId]),
                " - BLOCK:",
                Strings.toString(uint256(deliveries.endBlock[deliveryId]))
            )
        );
        string memory distanceTravelled_ = deliveries.distanceTravelled[
            deliveryId
        ];
        return (
            drivername,
            startLocation,
            endLocation,
            departure_,
            arrival_,
            distanceTravelled_
        );
    }
}
