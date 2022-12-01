import { Modal, Input, useNotification } from "web3uikit";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, BUSDabi } from "../constants/index.js";
import { ethers } from "ethers";

export default function JoinPresale({}) {
  const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const presaleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const BUSDaddress =
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;
  const dispatch = useNotification();
  const hideModal = () => setShowModal(false);

  let [showModal, setShowModal] = useState(false);

  let [ValueOrder, setValueOrder] = useState(0);
  let [balance, setBalance] = useState(0);

  const [TotalRaised, setTotalRaised] = useState("0");
  const handleJoinedPresaleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Bought into the presale",
      title: "JOINED!! - please refresh )",
      position: "topR",
    });

    setValueOrder("0");
  };

  async function updateUI() {
    const totalRaisedCall = (await getTotalRaised()).toString();
    setTotalRaised(totalRaisedCall);
    const balanceCall = (await balanceOf()).toString();
    setBalance(balanceCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const { runContractFunction: depositBUSD } = useWeb3Contract({
    abi: abi,
    contractAddress: presaleAddress,
    functionName: "depositBUSD",
    params: {
      _amount: ethers.utils.parseEther(ValueOrder || "0"),
    },
  });

  const { runContractFunction: getTotalRaised } = useWeb3Contract({
    abi: abi,
    contractAddress: presaleAddress,
    functionName: "getTotalRaised",
    params: {},
  });

  const { runContractFunction: approve } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "approve",
    params: {
      _spender: presaleAddress,
      _value: ethers.utils.parseEther("1000000000000000000000"),
    },
  });
  const { runContractFunction: balanceOf } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white fond-bold py-2 px-4
        rounded ml-auto"
        onClick={setShowModal}
      >
        Join the Presale
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white fond-bold py-6 px-9
        rounded ml-auto"
        onClick={() => {
          approve({
            onError: (error) => {
              console.log(error);
            },
            onSuccess: handleJoinedPresaleSuccess,
          });
        }}
      >
        Approve BUSD
      </button>
      <div>Total Raised </div>
      {ethers.utils.formatUnits(TotalRaised, "ether")} BUSD
      <Modal
        isVisible={showModal}
        onCancel={hideModal}
        onCloseButtonPressed={hideModal}
        onOk={() => {
          depositBUSD({
            onError: (error) => {
              console.log(error);
            },
            onSuccess: handleJoinedPresaleSuccess,
          });
        }}
      >
        <Input
          label="Join the DUES Presale"
          name="Ammount:"
          type="number"
          onChange={(event) => {
            setValueOrder(event.target.value);
          }}
        />
      </Modal>
      <div>balanceee</div>
      {ethers.utils.formatUnits(balance, "ether")} BUSD
    </div>
  );
}
