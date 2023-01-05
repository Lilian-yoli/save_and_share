import ShareCard from "../../components/ShareCard/ShareCard.component"
import { PageWrapper } from "../../components/Layout/PageWrapper.styles";
import { useState, useEffect } from 'react';
import { GET, PUT } from "../../utils/API";


const MySharePage = () => {
  const [shareList, setShareList] = useState();

  useEffect(() => {
    const fetchMyShareList = async () => {
      const { data: { data } } = await GET('/share/personal-launch');
      setShareList(data);
    }
    fetchMyShareList();
  }, [])

  const deleteShare = async (id) => {
    await PUT('/share/delete-launched-share', null, { params: { shareId: id } })
  }

  return (
    <PageWrapper>
      <h2>發起的分購</h2>
      {shareList?.length > 0 && shareList.map((data, index) => <ShareCard key={index} info={data} shadow="none" cancelable={true} action={() => deleteShare(data.id)} />)}
      {shareList?.length === 0 && (<p>...尚未發起任何分購</p>)}
    </PageWrapper>
  )
}

export default MySharePage