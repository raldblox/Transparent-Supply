/**
 *
 * ░█▀▄░█▀█░█░░░█▀▄░█▀▄░█░░░█▀█░█░█
 * ░█▀▄░█▀█░█░░░█░█░█▀▄░█░░░█░█░▄▀▄
 * ░▀░▀░▀░▀░▀▀▀░▀▀░░▀▀░░▀▀▀░▀▀▀░▀░▀
 *
 * @author github.com/raldblox
 *
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TransparentSupply {
    using SafeMath for uint256;

    struct foodstorage {
        bytes32 txhash;
        uint256 timestamp;
        uint256 storageID;
        uint256 temperature;
        uint256 humidity;
        uint256 ethylene;
        uint256 oxygen;
        uint256 carbondioxide;
    }

    struct locationdata {
        uint256 storageID;
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
    foodstorage[] public foodstorages;
    locationdata[] public locationdatas;

    // Map Food Storage IDs to Storage Names
    mapping(uint256 => string) public foodStorageNames;

    // Map driver IDs to storage IDs
    mapping(address => uint256) public assignedDeliveries;

    // Map delivery status of delivery IDs
    mapping(uint256 => bool) public activeDeliveries;

    // Map addresses to drivers names
    mapping(address => string) public driverNames;

    constructor() {
        registerFoodStorage("CROPS STORAGE", 101); // @note registers new Food Storage with '1' as Storage ID
        registerDriver(msg.sender, "RALD BLOX"); // @note registers new Food Storage with '1' as Storage ID
    }

    // register new food storage with 'name' and 'ID' as parameters
    function registerFoodStorage(string memory _storageName, uint256 _storageID)
        public
    {
        foodStorageNames[_storageID] = _storageName;
    }

    // register new drivers with their addresses
    function registerDriver(address _walletAddress, string memory _driverName)
        public
    {
        driverNames[_walletAddress] = _driverName;
    }

    // record food storage data with timestamp and tx.hash
    function recordFoodStorageData(
        uint256 _storageID,
        uint256 _temperature,
        uint256 _humidity,
        uint256 _ethylene,
        uint256 _oxygen,
        uint256 _carbondioxide
    ) public {
        foodstorage storage data = foodstorages.push();
        data.txhash = blockhash(block.number);
        data.timestamp = block.timestamp;
        data.storageID = _storageID;
        data.temperature = _temperature;
        data.humidity = _humidity;
        data.ethylene = _ethylene;
        data.oxygen = _oxygen;
        data.carbondioxide = _carbondioxide;
    }

    // start location tracking
    function startLocationTracking(
        uint256 _longitude1,
        uint256 _latitude1,
        uint256 _storageID
    ) public {
        locationdata storage data = locationdatas.push();
        data.deliveryID = deliveryIDs;
        data.storageID = _storageID;
        data.driverID = msg.sender;
        data.departureTx = blockhash(block.number);
        data.longitude1 = _longitude1;
        data.latitude1 = _latitude1;
        data.departureTime = block.timestamp;
        assignedDeliveries[msg.sender] = _storageID;
        activeDeliveries[_storageID] = true;
    }

    // end location tracking
    function endLocationTracking(
        uint256 _longitude2,
        uint256 _latitude2,
        uint256 _distanceTravelled
    ) public {
        uint256 storageID = assignedDeliveries[msg.sender];
        require(activeDeliveries[storageID]);
        locationdata storage data = locationdatas[locationdatas.length - 1]; // get the latest starting location data
        data.arrivalTx = blockhash(block.number);
        data.longitude2 = _longitude2;
        data.latitude2 = _latitude2;
        data.arrivalTime = block.timestamp;
        data.distanceTravelled = _distanceTravelled;
    }
}
