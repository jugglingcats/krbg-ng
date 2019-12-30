import * as React from "react";
import {ControllerProps} from "../AppController";
import {AttendanceOption} from "../common/AttendanceOption";
import {ScaleLoader} from "react-spinners";

type StatusSelectionRegionState = { unsubscribeConfirmation: boolean, optionChanged: boolean, busy: boolean }

export class StatusSelectionRegion extends React.Component<ControllerProps, StatusSelectionRegionState> {
    state: StatusSelectionRegionState = {
        unsubscribeConfirmation: false,
        optionChanged: false,
        busy: false
    };

    setOption(option: AttendanceOption) {
        this.setState({optionChanged: false, busy: true});
        this.props.controller.storeOption(option).then(() => {
            this.setState({
                optionChanged: true,
                busy: false
            });
        });
    }

    setOptionYes() {
        this.setOption("yes");
    }

    setOptionNo() {
        this.setOption("no");
    }

    render() {
        const setOptionYes = this.setOptionYes.bind(this);
        const setOptionNo = this.setOptionNo.bind(this);

        const {option} = this.props.controller.verified.profile!;

        return (<div>
            <form className="pure-form">
                <fieldset>
                    {
                        option === "yes" &&
                        <legend>
                            You've said you're coming this week!
                        </legend>
                    }
                    {
                        option === "no" &&
                        <legend>
                            You've said you're not coming this week.
                        </legend>
                    }
                    {
                        option === undefined &&
                        <legend>
                            You haven't let us know this week...
                        </legend>
                    }
{/*
                    {
                        this.state.optionChanged && <div className="App-confirmsave">
                            <span>Your selection was saved</span>
                        </div>
                    }
*/}
                    {
                        this.state.busy ? <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                        :
                        <div className="pure-control-group">
                            <button type="button" hidden={option === "yes"} onClick={setOptionYes}
                                    className="pure-button pure-button-primary">
                                I'll be there
                            </button>
                            <button type="button" hidden={option === "no"} onClick={setOptionNo}
                                    className="pure-button pure-button-primary">
                                I can't come
                            </button>
                            &nbsp;
                        </div>
                    }
                </fieldset>
            </form>

        </div>)
    }
}