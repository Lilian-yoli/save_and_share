import { useParams } from "react-router-dom"
import { GET } from "../../utils/API";
import JoinForm from "../../components/JoinForm/JoinForm-component";
import { SearchDetailWrapper } from "./SearchDetail.style";
import { useEffect, useState } from "react";
import Map from "../../components/Map/Map.component";

const SearchDetail = () => {
  const [data, setData] = useState();

  const { id } = useParams()

  useEffect(() => {
    const fetchDetialById = async (id) => {
      const { data: { data } } = await GET('/share/share-detail', { params: { shareId: id } });
      setData(data)
    }
    fetchDetialById(id);
  }, [id])


  return (
    <SearchDetailWrapper>
      <JoinForm shareDetail={data} share_id={id} />
      <div>
        <Map location={data?.location} />
      </div>
    </SearchDetailWrapper>
  )
}


export default SearchDetail;