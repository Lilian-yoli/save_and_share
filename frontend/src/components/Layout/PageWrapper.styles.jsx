import styled from "styled-components"

export const PageWrapper = styled.div`
  width: 600px;
  margin: 0 auto;
  

  h2 {
    position: sticky;
    top: 81px;
    z-index:3;
    font-size: 2rem;
    padding: 30px 0;
    background-color: #fff;
    color: ${props => props.theme.system}
  }
`