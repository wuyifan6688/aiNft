"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import style from "@/styles/modal.module.css";
import { WriteContractErrorType } from "viem/actions/wallet/writeContract";
import Fireworks from "@/components/firework";

interface ModalProps {
  message: string;
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  error: any;
  onClose: () => void;
  url: string;
}
const Modal: React.FC<ModalProps> = (props) => {
  const {
    message = "等待处理",
    isSuccess,
    isPending,
    isError,
    error,
    onClose,
    url,
  } = props;
  const [isFlipped, setIsFlipped] = useState(false);
  const transitionConfig = {
    duration: 1,
  };

  useEffect(() => {
    if (isSuccess) {
      setIsFlipped(true);
      setTimeout(() => onClose(), 5000);
    }
  }, [isSuccess]);
  return (
    <div className={style.modal__wrapper}>
      {isSuccess && <Fireworks></Fireworks>}
      <motion.div
        className={style.card__wrapper}
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
      >
        <motion.div
          transition={transitionConfig}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          className={style.card}
        >
          {url && (
            <img
              src={url}
              alt="waiting"
              style={{ width: "200px", height: "auto" }}
            />
          )}
        </motion.div>
        <motion.div
          transition={transitionConfig}
          initial={false}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          className={style.card}
        >
          恭喜,铸造成功,将在5s后关闭
        </motion.div>
      </motion.div>{" "}
      <div className={style.text}>
        {" "}
        {isSuccess ? isSuccess : message}
      </div>
    </div>
  );
};
export default Modal;
