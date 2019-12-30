import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {VerifiedComponentProps} from "../component/KeyVerification";
import {ScaleLoader} from "react-spinners";
import {AttendanceOption} from "../common/AttendanceOption";
import {BringFriendRegion} from "../component/BringFriendRegion";

type StatusUpdateProps = {
    option: AttendanceOption
}

type StatusUpdateState = {
    confirmed: boolean,
}

@observer
export class StatusUpdate extends React.Component<VerifiedComponentProps & RouteComponentProps<StatusUpdateProps>, StatusUpdateState> {
    state: StatusUpdateState = {
        confirmed: false
    };

    componentDidMount() {
        const option = this.props.match.params.option;

        this.props.controller.storeOption(option).then(() => {
            this.setState({
                confirmed: true
            })
        }).catch(); // framework takes care of error
    }

    render() {
        const option = this.props.match.params.option;
        const userProfile = this.props.controller.verified.profile!;

        if (option && !this.state.confirmed) {
            return (
                <div>
                    <p className="App-intro">
                        Hold tight {userProfile.username}, storing your selection!
                    </p>
                    <ScaleLoader color={"blue"} height={12} loading={true}/>
                </div>
            );
        }

        return (
            <section>
                <p className="App-intro">
                    {option === "yes" && <span>You've confirmed you will come this week!</span>}
                    {option === "no" && <span>Sorry you can't make it this week!</span>}
                </p>

{/*
                {
                    option === "yes" && <TimeOptionSelection controller={this.props.controller}/>
                }
*/}
                {
                    option === "yes" && <BringFriendRegion controller={this.props.controller}/>
                }
                <p>
                    <Link className="pure-button pure-button-primary" to={"/confirmed/" + this.props.match.params.key}>
                        See who else is coming
                    </Link>
                </p>
            </section>
        );
    }
}