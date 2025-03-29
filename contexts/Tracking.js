import { createContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import tracking from "./Tracking.json";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ContractABI = tracking.abi;

const fetchContract = (signerOrProvider) => {
  console.log("fetchContract called with:", signerOrProvider);
  return new ethers.Contract(contractAddress, ContractABI, signerOrProvider);
};

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Parcly Dapp";
  const [currentUser, setCurrentUser] = useState("");
  const [balance, setBalance] = useState(0);

  const createShipment = async (items) => {
    console.log("createShipment called with:", items);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const createItem = await contract.createShipment(
        items.receiver,
        new Date(items.pickupTime).getTime(),
        items.distance,
        ethers.utils.parseUnits(items.price, 18),
        {
          value: ethers.utils.parseUnits(items.price, 18),
        }
      );
      await createItem.wait();
      console.log("Shipment Created", createItem);
      window.location.reload();
    } catch (error) {
      console.error("Error in createShipment", error);
    }
  };

  const getAllShipments = async () => {
    console.log("getAllShipments called");
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
      console.log("All Shipments:", allShipments);
      return allShipments;
    } catch (error) {
      console.error("Error in getAllShipments", error);
    }
  };

  const getShipmentCount = async () => {
    console.log("getShipmentCount called");
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentCount = await contract.getShipmentsCount(accounts[0]);
      console.log("Shipment Count:", shipmentCount.toNumber());
      return shipmentCount.toNumber();
    } catch (error) {
      console.error("Error in getShipmentCount", error);
    }
  };

  const completeShipment = async (completeShip) => {
    console.log("completeShipment called with:", completeShip);
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
      const transaction = await contract.completeShipment(
        accounts[0],
        completeShip.receiver,
        completeShip.index,
        { gasLimit: 300000 }
      );
      await transaction.wait();
      console.log("Shipment Completed", transaction);
      window.location.reload();
    } catch (error) {
      console.error("Error in completeShipment", error);
    }
  };

  const getShipment = async (index) => {
    console.log("getShipment called with index:", index);
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1);
      console.log("Shipment Details:", shipment);
      return {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };
    } catch (error) {
      console.error("Error in getShipment", error);
    }
  };

  const startShipment = async (product) => {
    console.log("startShipment called with:", product);
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
        product.receiver,
        product.index
      );
      await shipment.wait();
      console.log("Shipment Started", shipment);
      window.location.reload();
    } catch (error) {
      console.error("Error in startShipment", error);
    }
  };

  const checkIfWalletConnected = async () => {
    console.log("checkIfWalletConnected called");
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setCurrentUser(accounts.length ? accounts[0] : "No account");
    } catch (error) {
      console.error("Error in checkIfWalletConnected", error);
    }
  };

  const connectWallet = async () => {
    console.log("connectWallet called");
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
      console.error("Error in connectWallet", error);
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
