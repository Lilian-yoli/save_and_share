import landingPageImg from "../../assets/images/food.png";
import picnicImg from "../../assets/images/picnic.png";
import {
  HeroContainer,
  ImgContainer,
  CardsContainer,
  Footer,
  InitiateSection,
} from "./Home.styles";
import Card from "../../components/Card/Card.component";
import Button from "../../components/Button/Button.component";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate("/share");
  };

  return (
    <>
      <HeroContainer>
        <h2>
          Share & Save 讓你從採買階段就只購入
          <br />
          自身所需且適量的食材/食品
        </h2>
        <ImgContainer>
          <img src={landingPageImg} alt="a variety of foods" />
        </ImgContainer>
      </HeroContainer>
      <section>
        <CardsContainer>
          <Card text="你有過食材用不完，而必須丟棄的困擾嗎？" />
          <Card text="買幾送幾的行銷方案總是變相讓你買入過多的食物嗎？" />
          <Card text="每次購買好Ｘ多的食品後，數量總是多到讓你此生不想再買第二次嗎？" />
        </CardsContainer>
      </section>
      <InitiateSection>
        <ImgContainer>
          <img src={picnicImg} alt="illustraion with people on a picnic" />
        </ImgContainer>
        <div>
          <p>想要發起分購嗎？</p>
          <p>The more you share, the more you save.</p>
          <Button
            onClickHandler={onClickHandler}
            variant="contained"
            size="medium"
            text="GO"
          />
        </div>
      </InitiateSection>
      <Footer>
        <div>
          <p>
            <b>Attribution:</b>
          </p>
          <p>
            Pizza Logo Vectors by
            <a href="https://www.vecteezy.com/free-vector/pizza-logo">
              {" "}
              <strong>Vecteezy</strong>{" "}
            </a>
          </p>
          <p>
            All the other illustrations used in the website are by{" "}
            <a href="https://www.drawkit.com/product/restaurants-dining-illustrations">
              {" "}
              <strong>DrawKit</strong>{" "}
            </a>
          </p>
        </div>
        <div>
          <p>
            <strong>Share & Save</strong> is a collaborative project
            <br />
            by
            <a href="https://github.com/Lilian-yoli">
              {" "}
              <strong>Lilian</strong>{" "}
            </a>
            and
            <a href="https://github.com/Chiahsuan-TW">
              {" "}
              <strong>Chiahsuan</strong>
            </a>
          </p>
        </div>
      </Footer>
    </>
  );
};

export default Home;
