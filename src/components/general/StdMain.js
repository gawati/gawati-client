import React from 'react';

class StdMain extends React.Component {
    render() {
        const {children} = this.props; 
        return (
            <main className={`main alpha`}>
                {children}
            </main>
        );
    }
};

export default StdMain ;