import * as React from "react";
import {VerifiedComponentProps} from "../component/KeyVerification";
import {ScaleLoader} from "react-spinners";
import {peopleCount} from "../common/utils";
import {ProfileLink} from "../App";
import {userFriendlyName, UserProfile} from "../common/UserProfile";

class Count extends React.Component<{ items: Array<any>, option: string }, any> {
    render() {
        const count = this.props.items
            .filter(p => p.option === this.props.option)
            .reduce((total: number, current) => {
                const friends: number = current.option === "yes" ? current.friends : 0;
                return Number(total + 1) + Number(friends);
            }, 0);

        return <span>{peopleCount(count)}</span>
    }
}

export class Turnout extends React.Component<VerifiedComponentProps, any> {
    state: any = {};

    componentDidMount() {
        this.props.controller.turnout().then(t => this.setState({
            turnout: t,
            ready: true
        }))
    }

    renderGroup(filter: string | undefined) {
        return this.state.turnout.filter((t: UserProfile) => t.option === filter).map((t: UserProfile, index: number) => (
            <div className="App-userbadge" key={filter + '-' + index}>
                {userFriendlyName(t)}
                {t.friends && t.option === "yes" && <span> + {t.friends}</span>}
            </div>
        ))
    }

    // not used
    // renderComingGroup() {
    //     type GroupedProfiles = {
    //         [index: string]: UserProfile[]
    //     };
    //
    //     const groupedProfiles = this.state.turnout
    //         .filter((t: any) => t.option === "yes")
    //         .reduce((grouped: GroupedProfiles, profile: UserProfile) => {
    //             const key = profile.time || "default";
    //             if (!grouped[key]) {
    //                 grouped[key] = [];
    //             }
    //             grouped[key].push(profile);
    //             return grouped;
    //         }, {});
    //
    //     return Object.keys(groupedProfiles)
    //         .sort()
    //         .map((group, groupIndex) => (
    //             <div className="pure-g" key={"group" + groupIndex}>
    //                 <div className="pure-u-2-5 pure-u-sm-1-5">
    //                     <span className="App-timegroup">{group}</span>
    //                 </div>
    //                 <div className="pure-u-3-5 pure-u-sm-4-5">
    //                     {
    //                         groupedProfiles[group].map((profile: UserProfile, index: number) => (
    //                             <div className="App-userbadge" key={"profile" + index}>{userFriendlyName(profile)}</div>
    //                         ))
    //                     }
    //                 </div>
    //             </div>
    //         ))
    // }

    render() {
        return this.state.ready ? (
            <div>
                <p className="App-intro">Current responses for this week</p>
                <p>Regular start time is 8.30pm</p>

                <form className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>There <Count items={this.state.turnout} option="yes"/> confirmed</legend>
                        {this.renderGroup("yes")}
                    </fieldset>

                    <fieldset>
                        <legend>There <Count items={this.state.turnout} option="no"/> who cannot make it</legend>
                        {this.renderGroup("no")}
                    </fieldset>
                </form>

                <p>There are currently {this.state.turnout.length} people on the email list.</p>

                <p>If you need to update your status for this week, view your <ProfileLink verificationKey={this.props.match.params.key}>
                    Profile</ProfileLink>.</p>
            </div>
        ) : <div>
            <p className="App-intro">Fetching information for this week</p>
            <ScaleLoader color={'blue'} height={12} loading={true}/>
        </div>;
    }
}