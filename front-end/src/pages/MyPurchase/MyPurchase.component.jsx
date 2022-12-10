import ShareCard from "../../components/ShareCard/ShareCard.component"
import { mockData } from '../../const/mockData';
import { PageWrapper } from "../../components/Layout/PageWrapper.styles";


const MyPurchasePage = () => {

  return (
    <PageWrapper>
      <h2>已加入的分購</h2>
      {mockData.map((data, index) => <ShareCard key={index} info={data} shadow="none" cancelable={true} />)}
    </PageWrapper>
  )
}

export default MyPurchasePage