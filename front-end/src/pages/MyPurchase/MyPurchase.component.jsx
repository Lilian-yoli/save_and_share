import ShareCard from "../../components/ShareCard/ShareCard.component"
import { PageWrapper } from "../../components/Layout/PageWrapper.styles";
import { useEffect, useState } from "react";
import { GET, PUT } from "../../utils/API";

const MyPurchasePage = () => {
  const [purchaseList, setPurchaseList] = useState();

  useEffect(() => {
    const fetchMyPurchaseList = async () => {
      const { data: { data } } = await GET('/share/personal-join');
      setPurchaseList(data);
    }
    fetchMyPurchaseList();
  }, []);

  const deletePurchase = async (id) => {
    const { data: { data } } = await PUT('/share/delete-joined-share', undefined, { params: { matchId: id } })
    setPurchaseList(data);
  }

  return (
    <PageWrapper>
      <h2>已加入的分購</h2>
      {purchaseList?.length > 0 && purchaseList.map((data, index) => <ShareCard key={index} info={data} shadow="none" cancelable={true} action={() => deletePurchase(data.share_id)} />)}
      {purchaseList?.length === 0 && (<p>...尚未加入任何分購</p>)}
    </PageWrapper>
  )
}

export default MyPurchasePage