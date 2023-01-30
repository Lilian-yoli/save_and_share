
import Button from "../Button/Button.component";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { object, number } from "yup";
import { POST } from "../../utils/API";
import dayjs from "dayjs";
import { JoinFormWrapper, FormContentWrapper } from "./JoinForm.styles";
import Dialog from "../../components/Dialog/Dialog.component";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../stores/chatStore";

const JoinForm = ({ share_id, shareDetail }) => {
  const { name, description, price, expiry_date, meet_up_datetime, county, district, address, total_portions, unit_description } = shareDetail ?? {};
  const pricePerPortion = Math.round(price / total_portions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setShareLauncher = useChatStore((state) => state.setShareLauncher);

  const navigate = useNavigate();
  const goToMyJoinedShare = () => {
    setIsDialogOpen(false);
    navigate('/my-purchase');
  }

  const goToChatRoom = () => {
    setIsDialogOpen(false);
    navigate('/my-inbox');
  }

  const validationSchema = object({
    taken_portions: number().required('必填').min(1, '至少須為1')
  })

  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      taken_portions: 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const form = { ...values, share_id: Number(share_id) };
      const { data: { data } } = await POST('share/share-join', form);
      const { share_launcher } = data;
      setShareLauncher({ shareLauncher: share_launcher });
      setIsDialogOpen(true);
    }
  });


  return (
    <>
      <JoinFormWrapper onSubmit={handleSubmit}>
        <FormContentWrapper>
          <p>名稱:  <span>{name}</span></p>
          <p>食物描述:  <span>{description}</span></p>
          <p>價格: <span>{pricePerPortion} 元 / {unit_description}</span></p>
          <p>有效期限: <span>{dayjs(expiry_date).format('YYYY年M月D日')}</span></p>
          <p>面交日期 & 時間: <span>{dayjs.utc(meet_up_datetime).format('YYYY年M月D日 h:mm A')}</span></p>
          <p>面交地點: <span>{county}{district}{address}</span></p>
          <TextField
            id="taken_portions"
            name="taken_portions"
            label="取用份數"
            type="number"
            value={values.taken_portions}
            onChange={handleChange}
            error={touched.taken_portions && Boolean(errors.taken_portions)}
            helperText={touched.taken_portions && errors.taken_portions}
            color="secondary"
          />
        </FormContentWrapper>
        <div className="button">
          <Button type="submit" variant="contained" text="送出" size="large" />
        </div>

        <Dialog
          content="需要聯絡分購發起人嗎？"
          open={isDialogOpen}
          buttonText={{ positive: "OK", negative: '不需要' }}
          action={goToChatRoom}
          cancel={goToMyJoinedShare}
        />
      </JoinFormWrapper>
    </>
  )
}


export default JoinForm;