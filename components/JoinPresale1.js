import { Input, useNotification } from "web3uikit";
import { useEffect, useState, Fragment } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, BUSDabi } from "../constants/index.js";
import { ethers } from "ethers";
import { WorkingModal } from "./WorkingModal.js";

export default function JoinPresale1({}) {
  const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const presaleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const BUSDaddress =
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;
  const dispatch = useNotification();
  const hideModal = () => setShowModal(false);

  let [showModal, setShowModal] = useState(false);

  const [TotalRaised, setTotalRaised] = useState("0");

  async function updateUI() {
    const totalRaisedCall = (await getTotalRaised()).toString();
    setTotalRaised(totalRaisedCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const { runContractFunction: getTotalRaised } = useWeb3Contract({
    abi: abi,
    contractAddress: presaleAddress,
    functionName: "getTotalRaised",
    params: {},
  });

  const { runContractFunction: balanceOf } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "balanceOf",
    params: { _addr: account },
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

  return (
    <Fragment>
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
        <Modal isVisible={showModal} onClose={hideModal}>
          daaaamn
        </Modal>
      </div>
    </Fragment>
  );
}
