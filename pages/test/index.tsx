import { NFTStorage,File } from "nft.storage";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { nftAbi } from '@/abis/AiNft'
import { useWriteContract } from "wagmi";
interface TestProps {

}
interface DataProps{
  inputs:string
}

const Test:React.FC<TestProps>=props => {
  const {}=props
  const [url, setUrl] = useState("");
 const {address,chain}=useAccount()

  useEffect(() => {
    console.log(address,1)
  }, [address]);

  const { data: hash, writeContract } = useWriteContract()

  const handleClick=async ()=>{
    async function query(data:DataProps) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return result;
    }
   await query({"inputs": "Astronaut riding a horse"}).then((response) => {
     console.log(response)
     const newUrl = URL.createObjectURL(response);
     console.log(newUrl)
    setUrl(newUrl)
    });
    uploadImage()
  }

  const uploadImage=async ()=>{
    const nftstorage= new NFTStorage({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZGNzAzNDcxMTU4MUE3QTg2ODZCYzdlMjUzMmY2OTExZDIwODdlQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMDg0MzAwMDUxMiwibmFtZSI6InRlc3QifQ.jcS5MnXmk7vF3ggARkNFPC55T1YhcQTyHzgG9WE9vKQ"})
    const metadata =await nftstorage.store({
      image: new File([url], "image.jpeg", { type: "image/jpeg" }),
      name: "a1",
      description: "a2",
    })
   console.log(metadata.url,2)
   const final= await mintImage(metadata.url)
    console.log(final,3)
  }

  const mintImage=async (url:string)=>{
    writeContract({
      address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi:nftAbi,
      functionName:"mintNft",
      args:[url]
    })
  }

  return <div>
    <button className="w-2" onClick={handleClick}>生成图像</button>
    <Image src={url} alt="description" width={500} height={300} />
    <ConnectButton></ConnectButton>
  </div>
}
export default Test;