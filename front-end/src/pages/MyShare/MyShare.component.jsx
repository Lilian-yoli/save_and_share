import ShareCard from "../../components/ShareCard/ShareCard.component"
import { PageWrapper } from "../../components/Layout/PageWrapper.styles";
import { useState, useEffect } from 'react';
import { GET } from "../../utils/API";


const MySharePage = () => {
  const [shareList, setShareList] = useState();

  useEffect(() => {
    const fetchMyShareList = async () => {
      const { data: { data } } = await GET('/share/personal-launch');
      setShareList(data);
    }
    fetchMyShareList();
  }, [])

  return (
    <PageWrapper>
      <h2>發起的分購</h2>
      {shareList?.length > 0 && shareList.map((data, index) => <ShareCard key={index} info={data} shadow="none" cancelable={true} />)}
    </PageWrapper>
  )
}

export default MySharePage