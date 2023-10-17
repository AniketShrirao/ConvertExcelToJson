import styled from 'styled-components';

const StyledWrapper = styled.div`
  max-width: 1440px;
  width: ${(props) => props.wrapperWidth};
  margin: 0 auto;
`;

export default StyledWrapper;
