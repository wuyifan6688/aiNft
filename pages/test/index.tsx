import { NFTStorage, File } from "nft.storage";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { nftAbi } from "@/abis/AiNft";
import { useWriteContract } from "wagmi";
import { type UseWriteContractReturnType } from "wagmi";
import { parseEther } from "viem";
import Modal from "@/components/modal";
import Fireworks from "@/components/firework";
interface TestProps {}
interface DataProps {
  inputs: string;
}

const Test: React.FC<TestProps> = (props) => {
  const {} = props;
  const [url, setUrl] = useState("");
  const { address, chain } = useAccount();
  const [message, setMessage] = useState("未铸造");
  const [show, setShow] = useState(false);

  const onClose = () => setShow(false);
  useEffect(() => {
    console.log(address, 1);
  }, [address]);

  const {
    data: hash,
    writeContract: writeContractMint,
    isSuccess: isMintSuccess,
    isPending: isPendingMint,
    isError: isMintError,
    error: mintError,
  } = useWriteContract();

  console.log(hash, "hash");

  //点击
  const handleClick = async () => {
    setShow(true);
    async function query(data: DataProps) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_KEY}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      const result = await response.blob();
      setMessage("照片生成成功");
      return result;
    }

    //调接口生成图片
    await query({
      inputs: "Astronaut riding a horse",
    }).then((response) => {
      console.log(response);
      const newUrl = URL.createObjectURL(response);
      console.log(newUrl, "图片地址");
      setUrl(newUrl);
    });
    setMessage("照片成为nft成功，等待铸造");
    uploadImage();
  };

  //生成nft
  const uploadImage = async () => {
    const nftstorage = new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_TOKEN as string,
    });
    const metadata = await nftstorage.store({
      image: new File([url], "image.jpeg", {
        type: "image/jpeg",
      }),
      name: "a221",
      description: "a222",
    });
    console.log(metadata.url, 2);
    const final = await mintImage(metadata.url);
    console.log(final, 3);
  };

  //核心
  //上传区块链合约
  const mintImage = async (url: string) => {
    try {
      writeContractMint({
        address:
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: nftAbi,
        functionName: "mintNft",
        args: [url],
        value: parseEther("1"),
      });
    } catch (e) {}
  };

  //追踪交易
  const {
    data: waitData,
    isLoading: waitIsLoading,
    status: waitStatus,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  //监听事件
  useWatchContractEvent({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: nftAbi,
    eventName: "Minted",
    chainId: 31337,
    onLogs(logs) {
      console.log("New Event Minted logs!", logs);
      console.log("hhh");
    },
  });
  return (
    <div>
      {show && (
        <Modal
          message={message}
          isPending={isPendingMint}
          isError={isMintError}
          isSuccess={isMintSuccess}
          error={mintError}
          onClose={onClose}
          url={url}
        ></Modal>
      )}

      <button className="w-2 aa" onClick={handleClick}>
        生成图像
      </button>
      <button onClick={() => setShow(true)}>
        test modal
      </button>
      {url && (
        <Image
          src={url}
          alt="description"
          width={500}
          height={300}
        />
      )}
      <ConnectButton></ConnectButton>
      <div>{message}</div>
      <div>hash{hash}</div>
      <div>铸造状态如下：</div>
      <div>{isMintError && mintError.message}</div>
      <div>{isMintSuccess && "成功"}</div>
      <div>{isPendingMint && "等待"}</div>
      <div>交易状态追踪</div>
      <div>{waitData && waitData.contractAddress}</div>
      <div>{waitStatus}</div>
      <div>{waitIsLoading}</div>
    </div>
  );
};
export default Test;
