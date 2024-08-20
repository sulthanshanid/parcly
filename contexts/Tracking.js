import { createContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import tracking from "./Tracking.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ContractABI = tracking.abi;

// FETCHING the Smart Contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(contractAddress, ContractABI, signerOrProvider);

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Parcly Dapp";
  const [currentUser, setCurrentUser] = useState("");
  const [balance, setBalance] = useState(0);

  const createShipment = async (items) => {
    const { receiver, pickupTime, distance, price } = items;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );

      await createItem.wait();
      console.log("Shipment Created", createItem);
      window.location.reload();
    } catch (error) {
      console.log("Error in createShipment", error);
    }
  };

  const getAllShipments = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        distance: shipment.distance.toNumber(),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));

      return allShipments;
    } catch (error) {
      console.log("Error in getAllShipments", error);
    }
  };

  const getShipmentCount = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      //   We're not changing the state variable here so we don't need a new signer
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentCount = await contract.getShipmentsCount(accounts[0]);

      return shipmentCount.toNumber();
    } catch (error) {
      console.log("error in getShipmentCount", error);
    }
  };

  const completeShipment = async (completeShip) => {
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      //   We're changing the state variable here so we need a new signer
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      await transaction.wait();
      console.log(transaction);

      window.location.reload();
    } catch (error) {
      console.log("Error in completeShipment", error);
    }
  };

  const getShipment = async (index) => {
    try {
      if (!window.ethereum) return "install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1); //Multiplying with 1 to make it uint256
      // shipment.wait();

      const SingleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };

      return SingleShipment;
    } catch (error) {
      console.log("Error in getShipment", error);
    }
  };

  const startShipment = async (product) => {
    const { receiver, index } = product;
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index
      );

      await shipment.wait();

      window.location.reload();
    } catch (error) {
      console.log("Error in getShipment", error);
    }
  };

  // Check wallet connection
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account";
      }
    } catch (error) {
      console.log("Error in checkIfWalletConnected", error);
    }
  };

  // Connect with wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);

      const provider = new ethers.providers.JsonRpcProvider();
      const balanceWei = await provider.getBalance(accounts[0]);
      const balanceEther = ethers.utils.formatEther(balanceWei);

      setBalance(balanceEther);
    } catch (error) {
      console.log("Error in connectWallet", error);
      return "Error while connecting to wallet";
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        DappName,
        currentUser,
        balance,
        connectWallet,
        createShipment,
        getAllShipments,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentCount,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
