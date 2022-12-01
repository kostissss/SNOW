import { Input, Slider, useNotification } from "web3uikit";
import { useEffect, useState, React } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  //DAIabi,
  //BNBabi,
  //USDCabi,
  //USDTabi,
  contractAddresses,
  BUSDabi,
  abi,
} from "../constants/index.js";
import { ethers } from "ethers";

function SetApproval() {
  //isApprovedForAll(account, operator) - function imported in our contract from OpenZeppelin IERC1155
  //setApprovalForAll(operator, approved) - function imported in our contract from OpenZeppelin IERC1155

  const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const presaleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const BUSDaddress =
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;

  const {
    data: approvalData,
    error: approvalError,
    fetch: approvalFetch,
    isFetching: approvalFetching,
    isLoading: approvalLoading,
  } = useWeb3ExecuteFunction({
    abi: BUSDabi, //imported from spotTraitsAbiFuji.json
    contractAddress: BUSDaddress,
    functionName: "approve",
    params: {
      _spender: presaleAddress,
      _value: new BigNumber(2).pow(256).minus(1),
    },
  });

  const {
    data: checkApprovedData,
    error: checkApprovedError,
    fetch: checkApprovedFetch,
    isFetching: checkApprovedFetching,
    isLoading: checkApprovedLoading,
  } = useWeb3ExecuteFunction({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "allowance",
    params: {
      _owner: account,
      _spender: presaleAddress,
    },
  });
  const [traitsApproved, setTraitsApproved] = useState(false);

  function changeUITrue() {
    setTraitsApproved(true);
  }
  function changeUIFalse() {
    setTraitsApproved(false);
  }

  const handleSuccessfulApproval = async (tx) => {
    await tx.wait(1);
    changeUITrue();
  };

  useEffect(() => {
    const checkApproval = async () => {
      const result = await checkApprovedFetch();
      if (result) {
        changeUITrue();
      } else changeUIFalse();
    };
    checkApproval();
  }, [account]);

  return (
    <div>
      <button
        className={
          !traitsApproved
            ? "m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base"
            : "m-2 rounded-lg px-4 py-2 border-2 border-gray-200 bg-gray-500 text-gray-900 font-mono font-bold text-base"
        }
        onClick={async () => {
          if (traitsApproved) {
            return;
          }
          await approvalFetch({
            onSuccess: handleSuccessfulApproval,
          });
        }}
      >
        {traitsApproved ? "Traits Approved" : "Approve My Traits"}
      </button>
    </div>
  );
}
export default SetApproval;
