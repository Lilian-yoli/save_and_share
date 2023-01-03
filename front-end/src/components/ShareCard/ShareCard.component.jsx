import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import { ShareCardWrapper, ContentWrapper } from './ShareCard.styles';
import Button from "../../components/Button/Button.component";
import dayjs from "dayjs";


const ShareCard = ({ info, shadow, cancelable }) => {

  let { name, expiry_date, description, price, unit_description, total_portions, total_taken_portions } = info;
  const pricePerPortion = Math.round(price / total_portions);

  function makeArray(length) {
    return Array.from({ length: length }, (_, i) => i);
  }

  const remainingPortions = makeArray(total_portions - total_taken_portions);
  total_taken_portions = makeArray(total_taken_portions);

  return (
    <>
      <ShareCardWrapper shadow={shadow}>
        <ContentWrapper>
          <strong>食物名稱: <span>{name}</span></strong>
          <strong>價格: <span>NTD {pricePerPortion} / {unit_description}</span></strong>
        </ContentWrapper>
        <ContentWrapper direction="column">
          <strong>食物描述: </strong>
          <p>{description}</p>
        </ContentWrapper>
        <ContentWrapper>
          <strong>食物到期日: <span>{dayjs(expiry_date).format('YYYY年M月D日')}</span></strong>
          <div>
            {total_taken_portions.map((_, index) => < LocalPizzaIcon key={index} />)}
            {remainingPortions.map((_, index) => (<LocalPizzaOutlinedIcon key={index} />))}
          </div>
        </ContentWrapper>
        {cancelable && <Button text="刪除分購" variant="outlined" color="danger" />}
      </ShareCardWrapper>

    </>
  )
}

export default ShareCard;