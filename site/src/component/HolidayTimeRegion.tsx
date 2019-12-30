import * as React from "react";
import {ControllerProps} from "../AppController";
import {ScaleLoader} from "react-spinners";

type HolidayTimeRegionState = {
    busy: boolean,
    holiday?: number
    saved?: boolean
}

export class HolidayTimeRegion extends React.Component<ControllerProps, HolidayTimeRegionState> {
    state: HolidayTimeRegionState = {
        busy: false
    };

    componentDidMount() {
        this.setState({
            holiday: this.props.controller.verified.profile!.holiday
        });
    }

    changeOption(e: any) {
        this.setState({
            saved: false,
            holiday: e.target.value
        })
    }

    storeHoliday(clear?: boolean) {
        this.setState({
            saved: false,
            busy: true
        });
        this.props.controller.storeHoliday(clear ? undefined : this.state.holiday)
            .then(() => {
                this.setState({
                    saved: true,
                    busy: false
                });
            }).catch(() => {
                // we're going to error page!
            }
        );
    }

    clearHoliday() {
        this.setState({
            holiday: undefined
        });
        this.storeHoliday(true);
    }


    resetHoliday() {
        this.setState({
            holiday: this.props.controller.verified.profile!.holiday
        });
    }

    render() {
        const userProfile = this.props.controller.verified.profile!;

        return (<form className="pure-form App-standoff">
            <fieldset>
                <legend>Take a break from emails</legend>
                <div>If you're going on holiday or know you can't come for a while, opt out of the weekly emails.</div>
                {
                    this.state.saved && <div className="App-confirmsave"><span>Your email opt out was {this.state.holiday ? "saved" : "removed"}</span></div>
                }
                {
                    this.state.busy ? <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                    :
                    <div className="pure-control-group control-group-inline">
                        <select value={this.state.holiday} onChange={(e) => this.changeOption(e)}>
                            <option hidden={userProfile.holiday !== undefined} selected={this.state.holiday === undefined} value={undefined}>
                                -
                            </option>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={"option-" + n} value={n}>{n}</option>
                                ))
                            }
                        </select>
                        <span className="App-selectlabel">Weeks</span>
                        <button type="button" onClick={e => this.storeHoliday()}
                                hidden={this.state.holiday === userProfile.holiday}
                                className="pure-button pure-button-primary">
                            Save
                        </button>
                        <button type="button" onClick={e => this.clearHoliday()}
                                hidden={userProfile.holiday === undefined || (this.state.holiday !== userProfile.holiday)}
                                className="pure-button">
                            Remove Opt Out
                        </button>
                        <button type="button" onClick={e => this.resetHoliday()}
                                hidden={this.state.holiday === userProfile.holiday} className="pure-button">
                            Cancel
                        </button>
                    </div>
                }

            </fieldset>
        </form>);
    }
}