import CompleteShipment from "@/components/CompleteShipment";
import Form from "@/components/Form";
import GetShipment from "@/components/GetShipment";
import Profile from "@/components/Profile";
import Services from "@/components/Services";
import StartShipment from "@/components/StartShipment";
import Table from "@/components/Table";
import { TrackingContext } from "@/contexts/Tracking";
import React, { useContext, useEffect, useState } from "react";

const Index = () => {
  const {
    currentUser,
    balance,
    createShipment,
    getAllShipments,
    completeShipment,
    getShipment,
    startShipment,
    getShipmentCount,
  } = useContext(TrackingContext);

  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModel, setGetModel] = useState(false);
  const [allShipmentData, setAllShipmentData] = useState([]);

  // ✅ Updated useEffect to correctly fetch shipment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching all shipments...");
        const allData = await getAllShipments();
        if (allData && Array.isArray(allData)) {
          setAllShipmentData(allData);
        } else {
          console.warn("No shipment data received.");
        }
      } catch (error) {
        console.error("Error fetching shipment data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModel={setGetModel}
        setstartModal={setStartModal}
      />

      <Table
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentData={allShipmentData}
      />

      <Form
        createShipmentModel={createShipmentModel}
        createShipment={createShipment}
        setCreateShipmentModel={setCreateShipmentModel}
      />

      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentCount={getShipmentCount}
        balance={balance}
      />

      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
      />

      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
        getShipment={getShipment}
      />

      <StartShipment
        startModal={startModal}
        setstartModal={setStartModal}
        startShipment={startShipment}
      />
    </>
  );
};

export default Index;
