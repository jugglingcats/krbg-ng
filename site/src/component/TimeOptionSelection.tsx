import * as React from "react";
import {ControllerProps} from "../AppController";
import {TimeOption} from "../common/UserProfile";
import {ScaleLoader} from "react-spinners";

import "../assets/RadioButtons.css"
import OptionTick from "./OptionTick";

type TimeOptionState = {
    saved?: boolean,
    time?: TimeOption
}

export class TimeOptionSelection extends React.Component<ControllerProps, TimeOptionState> {
    state: TimeOptionState = {};

    componentDidMount() {
        this.setState({
            time: this.props.controller.verified.profile!.time
        });
    }

    selectTime(e: TimeOption) {
        this.setState({
            time: e,
            saved: false
        });
    }

    storeTimeOption(clear?: boolean) {
        this.setState({
            saved: false
        });
        this.props.controller.storeTimeOption(clear ? undefined : this.state.time)
            .then(() => {
                this.setState({saved: true});
            }).catch(() => {
                // we're going to error page!
            }
        );
    }

    resetTimeOption() {
        this.setState({
            time: this.props.controller.verified.profile!.time
        });
    }

    clearTimeOption() {
        this.setState({
            time: undefined
        });
        this.storeTimeOption(true);
    }

    render() {
        const busy = this.props.controller.busy;
        const userProfile = this.props.controller.verified.profile!;

        return (
            <form className="pure-form">
                <fieldset>
                    <legend>Planned arrival time (optional)</legend>
                    <div className="custom-radios  control-group-inline">
                        {
                            Object.keys(TimeOption).map(option => (
                                <div key={option}>
                                    <input type="radio" id={option} name="time" value={option}
                                           checked={this.state.time === TimeOption[option]}

                                    />
                                    <label onClick={() => this.selectTime(TimeOption[option])} htmlFor="{option}">
                                        <span><OptionTick/></span>
                                    </label>
                                    <span className="App-time">{TimeOption[option]}</span>
                                </div>
                            ))
                        }
                    </div>
                    {
                        busy ? <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                        :
                        <div className="pure-control-group control-group-inline">
                            <button type="button" onClick={e => this.storeTimeOption()}
                                    hidden={this.state.time === userProfile.time}
                                    className="pure-button pure-button-primary">
                                Save
                            </button>
                            <button type="button" onClick={e => this.clearTimeOption()}
                                    hidden={userProfile.time == undefined || (this.state.time !== userProfile.time)} className="pure-button">
                                Remove Time
                            </button>
                            <button type="button" onClick={e => this.resetTimeOption()}
                                    hidden={this.state.time === userProfile.time} className="pure-button">
                                Cancel
                            </button>
                        </div>
                    }
                    {
                        this.state.saved && <div className="App-confirmsave"><span>Your selected time was {this.state.time ? "saved" : "removed"}</span></div>
                    }
                </fieldset>
            </form>
        )

    }
}