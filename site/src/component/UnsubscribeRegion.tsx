import * as React from "react";
import {ControllerProps} from "../AppController";
import {History} from "history"
import {ScaleLoader} from "react-spinners";

type UnsubscribeRegionState = { unsubscribeConfirmation: boolean, busy: boolean };

export class UnsubscribeRegion extends React.Component<ControllerProps & { history: History }, UnsubscribeRegionState> {
    state: UnsubscribeRegionState = {unsubscribeConfirmation: false, busy: false};

    unsubscribePrelim() {
        this.setState({
            unsubscribeConfirmation: true
        })
    }

    unsubscribeCancel() {
        this.setState({
            unsubscribeConfirmation: false
        })
    }

    unsubscribeProper() {
        this.props.controller.unsubscribe().then(() => {
            this.setState({
                busy: false,
                unsubscribeConfirmation: false
            });
            return this.props.history.push("/unsubscribed");
        })
    }

    render() {
        const unsubscribePrelim = this.unsubscribePrelim.bind(this);
        const unsubscribeProper = this.unsubscribeProper.bind(this);
        const unsubscribeCancel = this.unsubscribeCancel.bind(this);

        return (<form className="pure-form App-standoff-large">
            <fieldset>
                <legend>... this is getting a bit much</legend>
                {
                    this.state.busy ? <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                    : <div>
                        <div>If you no longer want to receive club emails, click the button below.
                        You won't receive the weekly emails but you can still play if you want, and you can subscribe
                        again at any time!</div>
                        {
                            this.state.unsubscribeConfirmation && <div className="App-standoff">
                                Are you sure you want to unsubscribe?
                                <div className="pure-control-group">
                                    <button type="button" className="pure-button pure-button-primary" onClick={unsubscribeProper}>
                                        <span>Confirm</span>
                                    </button>
                                    <button type="button" className="pure-button" onClick={unsubscribeCancel}>Cancel</button>
                                </div>
                            </div>
                        }
                        {
                            this.state.unsubscribeConfirmation || <div className="pure-control-group">
                                <button type="button" className="pure-button pure-button-primary" onClick={unsubscribePrelim}>
                                    <span>Unsubscribe</span>
                                </button>
                            </div>
                        }
                    </div>
                }
            </fieldset>
        </form>)
    }
}