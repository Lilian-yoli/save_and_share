import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import { ShareCardWrapper, ContentWrapper } from './ShareCard.styles';
import Button from "../../components/Button/Button.component";


const ShareCard = ({ info, shadow, cancelable }) => {

  let { foodName, expiryDate, description, pricePerPortion, unit, totalPortions, takenPortions } = info

  function makeArray(length) {
    return Array.from({ length: length }, (_, i) => i);
  }

  const remainingPortions = makeArray(totalPortions - takenPortions);
  takenPortions = makeArray(takenPortions);

  return (
    <>
      <ShareCardWrapper shadow={shadow}>
        <ContentWrapper>
          <strong>食物名稱:<span>{foodName}</span></strong>
          <strong>價格:<span>NTD {pricePerPortion} / {unit}</span></strong>
        </ContentWrapper>
        <ContentWrapper direction="column">
          <strong>食物描述: </strong>
          <p>{description}</p>
        </ContentWrapper>
        <ContentWrapper>
          <strong>食物到期日:<span>{expiryDate}</span></strong>
          <div>
            {takenPortions.map((_, index) => < LocalPizzaIcon key={index} />)}
            {remainingPortions.map((_, index) => (<LocalPizzaOutlinedIcon key={index} />))}
          </div>
        </ContentWrapper>
        {cancelable && <Button text="刪除分購" variant="outlined" color="danger" />}
      </ShareCardWrapper>

    </>
  )
}

export default ShareCard;