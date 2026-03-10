import React, { useContext, createContext, useState, useEffect } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useDisconnect,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { contractABI } from "../constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x5CaD357cBb507f27121ba1B414d198b6C04b69fD",
    contractABI
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const address = useAddress();
  const connectMetamask = useMetamask();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "System"
  );
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("themeMode");
    if (stored === "Dark") return true;
    if (stored === "Light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [campaigns, setCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCampaigns();
  }, [contract, address]);

  const toggleTheme = (mode) => {
    setThemeMode(mode);
  };

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    switch (themeMode) {
      case "Dark":
        document.documentElement.classList.add("dark");
        localStorage.setItem("themeMode", "Dark");
        setIsDark(true);
        break;
      case "Light":
        document.documentElement.classList.remove("dark");
        localStorage.setItem("themeMode", "Light");
        setIsDark(false);
        break;
      case "System":
      default:
        localStorage.setItem("themeMode", "System");
        if (systemTheme.matches) {
          document.documentElement.classList.add("dark");
          setIsDark(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDark(false);
        }
        break;
    }
  }, [themeMode]);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if (localStorage.getItem("themeMode") === "System") {
        if (systemTheme.matches) {
          document.documentElement.classList.add("dark");
          setIsDark(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDark(false);
        }
      }
    };
    systemTheme.addEventListener("change", onSystemThemeChange);
    return () => systemTheme.removeEventListener("change", onSystemThemeChange);
  }, []);

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          form.name,
          form.title,
          form.category,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      toast.success(" Campaign created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(
        "contract call success",
        data,
        "form from createCampaign",
        form
      );
      await getCampaigns();
    } catch (error) {
      toast.error(" Error while creating Campaign, please 🙏🏻 try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("contract call failure", error);
    }
  };
  const updateCampaign = async (form) => {
    if (isLoading) {
      console.log("Campaign update is already in progress. Skipping.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await contract.call("updateCampaign", [
        form.id,
        form.name,
        form.title,
        form.category,
        form.description,
        ethers.utils.parseUnits(form.target, 18),
        new Date(form.deadline).getTime(),
        form.image,
      ]);

      toast.success("Campaign updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      console.log("Contract update success", data);
      await getCampaigns();
    } catch (error) {
      toast.error("Error while updating Campaign, please 🙏🏻 try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      console.log("Contract update failure", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (id) => {
    try {
      const data = await contract.call("deleteCampaign", [id]);

      toast.success("Campaign deleted 🚮 successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("Campaign delete success", data);
      await getCampaigns();
      return data;
    } catch (error) {
      toast.error("Error while deleting Campaign, please 🙏🏻 try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("Campaign delete failure", error);
    }
  };

  const donate = async (id, amount) => {
    try {
      const data = await contract.call("donateToCampaign", [id], {
        value: ethers.utils.parseEther(amount),
      });

      toast.success(
        "Campaign funded successfully. Thanks for collaboration😊",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      await getCampaigns();
      return data;
    } catch (err) {
      toast.error("Error while Donating Campaign, please 🙏🏻 try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("Error occurred while making donation", err);
    }
  };

  const withdraw = async (id) => {
    try {
      const data = await contract.call("withdrawDonations", [id]);

      toast.success("🤑 Campaign funds successfully withdrawn", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      await getCampaigns();
      return data;
    } catch (err) {
      toast.error("Error occurred while withdrawing funds.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("Error occurred while withdrawing funds", err);
    }
  };

  const getCampaigns = async () => {
    setIsLoading(true);
    const campaigns = await contract?.call("getCampaigns");

    const parsedCampaigns = campaigns?.map((campaign, i) => {
      const formattedTarget = ethers.utils.formatEther(
        campaign.target.toString()
      );
      const formattedAmountCollected = ethers.utils.formatEther(
        campaign.amountCollected.toString()
      );

      // Format individual donation amounts from on-chain data if present
      const formattedDonations = Array.isArray(campaign.donations)
        ? campaign.donations.map((donation) =>
            ethers.utils.formatEther(donation.toString())
          )
        : [];

      return {
        owner: campaign.owner,
        name: campaign.name,
        title: campaign.title,
        category: campaign.category,
        description: campaign.description,
        target: formattedTarget,
        deadline: campaign.deadline.toNumber(),
        amountCollected: formattedAmountCollected,
        image: campaign.image,
        // Rich donor analytics, used by Insights/Profile dashboards
        donators: Array.isArray(campaign.donators) ? campaign.donators : [],
        donations: formattedDonations,
        id: i,
      };
    });

    setCampaigns(parsedCampaigns ?? []);
    setIsLoading(false);
    console.log("Campaigns from index.jsx", campaigns);
    return parsedCampaigns;
  };

  const getDonations = async (id) => {
    const donations = await contract.call("getDonators", [id]);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  const getUserCampaigns = async () => {
    setIsLoading(true);
    const filteredCampaigns = campaigns?.filter(
      (campaign) => campaign.owner === address
    );
    setUserCampaigns(filteredCampaigns);
    setIsLoading(false);
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connectMetamask,
        disconnect,
        connectionStatus,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        withdraw,
        getDonations,
        deleteCampaign,
        updateCampaign,
        toggleTheme,
        themeMode,
        isDark,
        campaigns,
        isLoading,
        setIsLoading,
        userCampaigns,
      }}
    >
      <ToastContainer />
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
