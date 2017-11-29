import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App as AppApollo } from "./apollo/AppApollo";
// import { App as AppRelay } from "./relay/AppRelay";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<AppApollo />, document.getElementById("root"));

registerServiceWorker();
