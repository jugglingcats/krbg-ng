import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {inject} from "mobx-react";
import {ControllerProps, VerifiedPageState} from "../AppController";
import {ScaleLoader} from "react-spinners";

type WrappedHigherOrderComponent<P, PHoc> = React.ComponentClass<P & PHoc> | React.FunctionComponent<P & PHoc>;

export type ValidatorProps = {
    key: string
}

export type VerifiedComponentProps = ControllerProps & RouteComponentProps<ValidatorProps>;

type VerifiedComponentState = { verified: boolean }

export function validatedComponent<P>(Component: WrappedHigherOrderComponent<P, VerifiedComponentProps>, requiredRole?: string): React.ComponentClass<P> {
    return inject("controller")(withRouter(class C extends React.Component<P & VerifiedComponentProps, VerifiedComponentState> {
        state: VerifiedComponentState = {
            verified: false
        };

        componentDidMount() {
            this.props.controller.verify(this.props.match.params.key, requiredRole).then((v: VerifiedPageState) => {
                this.setState(v);
            });
        }

        public render() {
            // noinspection JSUnusedLocalSymbols
            const {name, ...rest} = this.props as any;
            const displayName = `withHoc(${Component.displayName || Component.name})`;

            if (!this.state.verified) {
                return <div>
                    <p className="App-intro">
                        Fetching your details
                    </p>
                    <ScaleLoader color={'blue'} height={12} loading={true}/>
                </div>
            }


            return (
                <Component name={displayName} {...rest}/>
            );
        }
    }) as any);
}
