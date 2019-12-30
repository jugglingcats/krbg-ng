import * as React from "react";

export class Layout extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="pure-g">
                    <div className="pure-u-1 pure-u-md-1-5"/>
                    <div className="pure-u-1 pure-u-md-3-5">
                        <div className="BodyContent">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="pure-u-1 pure-u-md-1-5"/>
                </div>
            </div>
        );
    }
}