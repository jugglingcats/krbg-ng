import * as React from "react";
import {VerifiedComponentProps} from "../component/KeyVerification";
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import {UnsubscribeRegion} from "../component/UnsubscribeRegion";
import {StatusSelectionRegion} from "../component/StatusSelectionRegion";
import {HolidayTimeRegion} from "../component/HolidayTimeRegion";
import {PersonalDetailsRegion} from "../component/PersonalDetailsRegion";
import {BringFriendRegion} from "../component/BringFriendRegion";

@observer
export class ProfilePage extends React.Component<VerifiedComponentProps> {
    render() {
        let controller = this.props.controller;
        const {username, option} = controller.verified.profile!;

        return (
            <div>
                <p className="App-intro">
                    Hello {username}, this is your Kensal Rise Backgammon profile
                </p>

{/*
                <p>
                    The club meets Thursdays at The Island pub in Kensal Rise. Regular start time is 8.30pm.
                </p>

*/}
                <div>
                    <StatusSelectionRegion controller={controller}/>

{/*
                    {
                        option === "yes" && <TimeOptionSelection controller={controller}/>
                    }
*/}
                    {
                        option === "yes" && <BringFriendRegion controller={controller}/>
                    }

                    <form className="pure-form App-standoff">
                        <fieldset>
                            <legend>Want to know who's coming?</legend>
                            <Link className="pure-button pure-button-primary" to={'/confirmed/' + this.props.match.params.key}>
                                Show me
                            </Link>
                        </fieldset>
                    </form>

                    <HolidayTimeRegion controller={controller}/>

                    <PersonalDetailsRegion controller={controller}/>

                    {
                        controller.verified.profile!.roles.some((r:any) => r === "admin") && <div>
                            <form className="pure-form App-standoff">
                                <p/>
                                <fieldset>
                                    <legend>Looks like you're an admin</legend>

                                    <Link className="pure-button pure-button-primary"
                                          to={"/admin/" + controller.verified.profile!.verificationKey}>
                                        Go to Admin
                                    </Link>
                                </fieldset>

                            </form>
                        </div>
                    }

                    <UnsubscribeRegion controller={controller} history={this.props.history}/>

                </div>

            </div>
        )
    }
}