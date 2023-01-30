import { useState } from "react";
import Dialog from "../../components/Dialog/Dialog.component";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../../components/TransactionForm/TransactionForm.component";
import PaymentReview from "../../components/PaymentReview/PaymentReview.component";
import { TransactionWrapper } from "./Transaction.styles";
import { useQuery } from "../../utils/useQuery";
import { POST } from "../../utils/API";

const TransactionPage = () => {
  const [dialogType, setDialogType] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const query = useQuery();
  const planType = query.get("plan");

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = (cb) => {
    setIsDialogOpen(false);
    if (typeof cb !== "function") return;
    cb();
  };

  const navigate = useNavigate();
  const getToHomePage = () => navigate("/");

  const DIALOG_TYPES = {
    error: {
      content: "付款細節有誤，請確認無誤後重新提交～",
      buttonText: { positive: "知道了" },
      action: closeDialog,
    },
    success: {
      content: "感謝訂閱，已成功註冊～",
      buttonText: { positive: "OK" },
      action: () => closeDialog(getToHomePage),
    },
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // 取得 TapPay Fields 的 status
    /* global TPDirect */
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      setDialogType("error");
      openDialog();
      return;
    }

    // Get prime & send prime with amount to backend
    TPDirect.card.getPrime(async (result) => {
      if (result.status !== 0) {
        alert("get prime error " + result.msg);
        return;
      }
      try {
        const amount = planType === 'monthly_plan' ? 20 : 100;
        const form = { amount, prime: result.card.prime };
        await POST('/tools/tappay-direct-pay', form);
        setDialogType("success");
        openDialog();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <TransactionWrapper>
      <TransactionForm onSubmitHandler={onSubmitHandler} />
      <PaymentReview type={planType} />
      <Dialog
        content={DIALOG_TYPES[dialogType]?.content}
        buttonText={DIALOG_TYPES[dialogType]?.buttonText}
        open={isDialogOpen}
        action={DIALOG_TYPES[dialogType]?.action}
      />
    </TransactionWrapper>
  );
};

export default TransactionPage;
