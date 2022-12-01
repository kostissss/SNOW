import {
  Dropdown,
  Input,
  Slider,
  useNotification,
  SendTransaction,
} from "web3uikit";
import { Update, Usdc } from "@web3uikit/icons";
import { useEffect, useState, React, Fragment } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  DAIabi,
  //BNBabi,
  USDCabi,
  USDTabi,
  contractAddresses,
  BUSDabi,
  abi,
} from "../constants/index.js";
import { ethers } from "ethers";

import { Listbox, Transition, ChevronUpDownIcon } from "@headlessui/react";

const WorkingModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const dispatch = useNotification();

  const presaleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const BUSDaddress =
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;

  const USDCaddress =
    chainId in contractAddresses ? contractAddresses[chainId][2] : null;
  const USDTaddress =
    chainId in contractAddresses ? contractAddresses[chainId][3] : null;

  const DAIaddress =
    chainId in contractAddresses ? contractAddresses[chainId][4] : null;

  const people = [
    { id: 1, name: "BUSD", ABI: BUSDabi, address: BUSDaddress },
    { id: 2, name: "USDC", ABI: USDCabi, address: USDCaddress },
    { id: 3, name: "USDT", ABI: USDTabi, address: USDTaddress },
    { id: 4, name: "DAI", ABI: DAIabi, address: DAIaddress },
  ];

  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  let [balanceBUSD, setBalanceBUSD] = useState(0);
  let [ValueOrder, setValueOrder] = useState(0);
  let [approved, setApproved] = useState(0);

  const timerId = setInterval(() => {
    updateUI;
  }, 5000);

  const { runContractFunction: balanceOfBUSD } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: selectedPerson.address,
    functionName: "balanceOf",
    params: { _addr: account },
  });

  const { runContractFunction: depositBUSD } = useWeb3Contract({
    abi: abi,
    contractAddress: presaleAddress,
    functionName: "depositBUSD",
    params: {
      _amount: ethers.utils.parseEther(ValueOrder || "1"),
      token: selectedPerson.address,
    },
  });

  const { runContractFunction: approve } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: selectedPerson.address,
    functionName: "approve",
    params: {
      _spender: presaleAddress,
      _value: ethers.utils.parseEther("1000000000000000000000"),
    },
  });
  const { runContractFunction: allowance } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "allowance",
    params: {
      _ownder: account,
      _spender: presaleAddress,
    },
  });
  async function checkAllowance() {
    const allowance1 = await allowance().toString();

    setApproved(allowance1);
    return approve();
  }

  const { runContractFunction: checkApprovedFetch } = useWeb3Contract({
    abi: BUSDabi, //imported from spotTraitsAbiFuji.json
    contractAddress: BUSDaddress,
    functionName: "approve",
    params: {
      _spender: presaleAddress,
      _value: "10000000000000000000000000000000000",
    },
  });

  const { runContractFunction: allowance1 } = useWeb3Contract({
    abi: BUSDabi,
    contractAddress: BUSDaddress,
    functionName: "allowance",
    params: {
      _owner: account,
      _spender: presaleAddress,
    },
  });

  const handleSuccessfulApproval = async (tx) => {
    await tx.wait(1);
    changeUITrue();
  };

  async function updateUI() {
    const balanceCallBUSD = (await balanceOfBUSD()).toString();
    setBalanceBUSD(balanceCallBUSD);
    console.log(selectedPerson.address);
  }
  async function approveOrBuy() {
    if (allowance() != 0) {
      await depositBUSD();
    } else {
      await approve();
      await depositBUSD();
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
    // console.log(`${address}`);
  }, [isWeb3Enabled, selectedPerson]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
      <div className="w-[500px] flex flex-col">
        <button
          className="text-blue-800 text-xl place-self-end"
          onClick={() => onClose()}
        >
          {" "}
          X
        </button>{" "}
        <div className="bg-white p-2 rounded">
          <div>
            Available{" "}
            <Listbox value={selectedPerson} onChange={setSelectedPerson}>
              {" "}
              <Listbox.Button className="    relative w-50  rounded-lg bg-white  py-2 pl-3 pr-1 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer border-solid border-2 border-blue-800  ">
                {" "}
                {selectedPerson.name}:
                <span className=" pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="cursor-pointer absolute mt-1 max-h-60 w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {people.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      value={person}
                      className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                    >
                      {person.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>{" "}
            {ethers.utils.formatUnits(balanceBUSD, "ether")} $
            {selectedPerson.name}
          </div>{" "}
          <p class="text-lg leading-loose md:text-xl">
            <div></div>
          </p>
          <button
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5"
            onClick={() => depositBUSD() && onClose()}
            notificationConfig={{ dispatch }}
          >
            {"               "}
            buy {ValueOrder}
          </button>{" "}
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5"
            onClick={() => approve() && updateUI()}
          >
            {"    "}
            approve
          </button>{" "}
          <input
            class="cursor-pointer"
            type="range"
            min="0"
            max={ethers.utils.formatUnits(balanceBUSD, "ether")}
            step="0.1"
            onChange={(event) => {
              setValueOrder(event.target.value);
            }}
          />
          {"            "}{" "}
          <div className="text-black-800 text-xl place-self-end"> </div>
          <div className="text-black-800 text-xl place-self-end"> </div>
          <div className="text-black-800 text-xl place-self-end"> </div>
          <div className="text-black-800 text-xl place-self-end"> </div>
          You'll get ≈ {Math.round(ValueOrder / 0.03)} $SNOW
        </div>
      </div>
    </div>
  );
};
export default WorkingModal;
