import * as React from "react";
import {ControllerProps} from "../AppController";
import {ScaleLoader} from "react-spinners";

type BringFriendRegionState = {
    busy: boolean,
    friends?: number
    saved?: boolean
}

export class BringFriendRegion extends React.Component<ControllerProps, BringFriendRegionState> {
    state: BringFriendRegionState = {
        busy: false
    };

    componentDidMount() {
        this.setState({
            friends: this.props.controller.verified.profile!.friends
        });
    }

    changeOption(e: any) {
        this.setState({
            saved: false,
            friends: e.target.value
        })
    }

    storeFriends(clear?: boolean) {
        this.setState({
            saved: false,
            busy: true
        });
        this.props.controller.storeFriends(clear ? undefined : this.state.friends)
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

    clearFriends() {
        this.setState({
            friends: undefined
        });
        this.storeFriends(true);
    }


    resetFriends() {
        this.setState({
            friends: this.props.controller.verified.profile!.friends
        });
    }

    render() {
        const userProfile = this.props.controller.verified.profile!;

        return (<form className="pure-form App-standoff">
            <fieldset>
                <legend>Bringing a friend?</legend>
                <div>If you're planning to bring a friend or two along this week, tell us how many.</div>
                {
                    this.state.saved && <div className="App-confirmsave"><span>Your friend count was {this.state.friends ? "saved" : "removed"}</span></div>
                }
                {
                    this.state.busy ? <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                    :
                    <div className="pure-control-group control-group-inline App-standoff">
                        I'm planning to bring along &nbsp;
                        <select value={this.state.friends} onChange={(e) => this.changeOption(e)}>
                            <option hidden={userProfile.friends !== undefined} selected={this.state.friends === undefined} value={undefined}>
                                -
                            </option>
                            {
                                [1, 2, 3, 4, 5].map(n => (
                                    <option key={"option-" + n} value={n}>{n}</option>
                                ))
                            }
                        </select>
                        <span className="App-selectlabel">friend(s)</span>
                        <button type="button" onClick={e => this.storeFriends()}
                                hidden={this.state.friends === userProfile.friends}
                                className="pure-button pure-button-primary">
                            Save
                        </button>
                        <button type="button" onClick={e => this.clearFriends()}
                                hidden={userProfile.friends === undefined || (this.state.friends !== userProfile.friends)}
                                className="pure-button">
                            Remove Friends
                        </button>
                        <button type="button" onClick={e => this.resetFriends()}
                                hidden={this.state.friends === userProfile.friends} className="pure-button">
                            Cancel
                        </button>
                    </div>
                }

            </fieldset>
        </form>);
    }
}