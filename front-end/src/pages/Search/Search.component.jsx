import ShareCard from "../../components/ShareCard/ShareCard.component"
import { PageWrapper } from "../../components/Layout/PageWrapper.styles";
import { Link } from "react-router-dom";
import SearchForm from "../../components/SearchForm/SearchForm.component";
import { useSearchStore } from "../../stores/searchStore";


const SearchPage = () => {
  const resultList = useSearchStore((state) => state.searchResultList);

  return (
    <>
      <PageWrapper>
        <h2>想要加入分購嗎？</h2>
        <div style={{ width: '800px', position: 'sticky', top: '180px', zIndex: '3', background: '#fff', transform: 'translateX(-120px)' }}>
          <SearchForm />
        </div>
        {resultList.map((data, index) => <Link to={`/search/details-${data.id}`} key={index}><ShareCard key={index} info={data} /></Link>)}
      </PageWrapper>
    </>
  );
};

export default SearchPage;
