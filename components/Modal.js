import { Input, useNotification } from "web3uikit";
import { useEffect, useState, React } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  //DAIabi,
  //BNBabi,
  //USDCabi,
  //USDTabi,
  contractAddresses,
  BUSDabi,
} from "../constants/index.js";
import { ethers } from "ethers";

const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const BUSDaddress =
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;
  /* const USDCaddress =
    chainId in contractAddresses ? contractAddresses[chainId][2] : null;
  const BNBaddress =
    chainId in contractAddresses ? contractAddresses[chainId][3] : null;
  const DAIaddress =
    chainId in contractAddresses ? contractAddresses[chainId][4] : null;
  const USDTaddress =
    chainId in contractAddresses ? contractAddresses[chainId][5] : null;
    */
  let [balanceBUSD, setBalanceBUSD] = useState(0);
  // let [balanceUSDC, setBalanceUSDC] = useState(0);
  //let [balanceBNB, setBalanceBNB] = useState(0);
  //let [balanceDAI, setBalanceDAI] = useState(0);

  const { runContractFunction: balanceOfBUSD } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });
  /*const { runContractFunction: balanceOfUSDC } = useWeb3Contract({
    abi: USDCabi,
    contractAddress: USDCaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });
  const { runContractFunction: balanceOfBNB } = useWeb3Contract({
    abi: BNBabi,
    contractAddress: BNBaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });
  const { runContractFunction: balanceOfDAI } = useWeb3Contract({
    abi: DAIabi,
    contractAddress: DAIaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });
  const { runContractFunction: balanceOfUSDT } = useWeb3Contract({
    abi: USDTabi,
    contractAddress: USDTaddress,
    functionName: "balanceOf",
    params: { _addr: account },
  });
  */
  async function updateUI() {
    const balanceCallBUSD = (await balanceOfBUSD()).toString();
    setBalanceBUSD(balanceCallBUSD);
    /*const balanceCallUSDC = (await balanceOfUSDC()).toString();
    setBalanceUSDC(balanceCallUSDC);
    const balanceCallDAI = (await balanceOfDAI()).toString();
    setBalanceDAI(balanceCallDAI);
    const balanceCallBNB = (await balanceOfBNB()).toString();
    setBalanceBNB(balanceCallBNB);

    const balanceCallUSDT = (await balanceOfUSDT()).toString();
    setBalanceUSDT(balanceCallUSDT); */
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
      <div className="w-[600px] flex flex-col">
        <button
          className="text-white text-xl place-self-end"
          onClick={() => onClose}
        >
          {" "}
          X
        </button>{" "}
        <div>Available BUSD</div>
        {ethers.utils.formatUnits(balanceBUSD, "ether")} BUSD
        <div className="bg-white p-2 rounded">Modal</div>
      </div>
    </div>
  );
};
export default Modal;
