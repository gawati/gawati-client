import React from 'react';
import StdMain from './StdMain';
import StdContainer from './StdContainer';
import StdDiv from './StdDiv';

/**
 * 
 * 
 * @class StdCompContainer
 * @extends {React.Component}
 */
class StdCompContainer extends React.Component {

    render() {
        const {children} = this.props; 
        const {breadcrumb} = this.props;
        return  (
        <StdMain>
            {breadcrumb ? breadcrumb: null}
            <StdContainer> 
              <StdDiv>
                {children}
              </StdDiv>
            </StdContainer>
        </StdMain>
        );
    }
};

export default StdCompContainer ;