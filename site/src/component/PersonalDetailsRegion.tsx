import * as React from "react";
import {ControllerProps} from "../AppController";
import {ScaleLoader} from "react-spinners";

type PersonalDetailsRegionState = {
    busy?: boolean,
    username?: string,
    surname?: string,
    saved?: boolean
}

export class PersonalDetailsRegion extends React.Component<ControllerProps, PersonalDetailsRegionState> {
    state: PersonalDetailsRegionState = {
        busy: false,
        username: "",
        surname: "",
        saved: false
    };

    constructor(props: ControllerProps) {
        super(props);
        this.updateInput = this.updateInput.bind(this);
    }

    componentDidMount() {
        this.updateStateFromController();
    }

    updateStateFromController() {
        this.setState({
            busy: false,
            username: this.profile.username,
            surname: this.profile.surname
        })
    }

    updateInput(e: any) {
        this.setState({
            saved: false,
            [e.target.name]: e.target.value as string
        });
    }

    storeDetails() {
        this.setState({
            saved: false,
            busy: true
        });
        this.props.controller.storeUserDetails(this.state.username!, this.state.surname)
            .then(() => {
                this.setState({
                    saved: true,
                    busy: false
                });
                this.updateStateFromController();
            }).catch(() => {
                // we're going to error page!
            }
        );
    }


    get profile() {
        return this.props.controller.verified.profile!;
    }

    get pristine(): boolean {
        return this.state.username === this.profile.username
            && this.state.surname === this.profile.surname;
    }

    private resetDetails() {
        this.setState({
            username: this.profile.username,
            surname: this.profile.surname
        })
    }

    render() {
        return (<form className="pure-form pure-form-stacked">
            <fieldset>
                <legend>Change your details</legend>
                {
                    this.state.saved && <div className="App-confirmsave"><span>Your details were saved</span></div>
                }
                {
                    this.state.busy ?
                    <div className="App-standoff"><ScaleLoader color={"blue"} height={12} loading={true}/></div>
                    :
                    <div>
                        <div className="pure-g">
                            <div className="pure-u-1 pure-u-sm-1-2">
                                <label htmlFor="username">First Name</label>
                                <input name="username" id="username" type="text" placeholder="Enter your name" required
                                       onChange={this.updateInput} value={this.state.username}/>
                            </div>
                            <div className="pure-u-1 pure-u-sm-1-2">
                                <label htmlFor="surname">Surname (optional)</label>
                                <input name="surname" id="surname" type="text" placeholder="Surname or initial"
                                       onChange={this.updateInput} value={this.state.surname || ""}/>
                            </div>
                        </div>

                        <button type="button" onClick={e => this.storeDetails()}
                                hidden={this.pristine}
                                className="pure-button pure-button-primary">
                            Save
                        </button>
                        <button type="button" onClick={e => this.resetDetails()}
                                hidden={this.pristine} className="pure-button">
                            Cancel
                        </button>
                    </div>
                }
            </fieldset>
        </form>)
    }
}