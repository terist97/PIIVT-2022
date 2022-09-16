import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import AuthStore from "../../../stores/AuthStore";
import { motion } from "framer-motion";

export default function AdministratorLoginPage() {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");

    const navigate = useNavigate();

    const doLogin = () => {
        api("post", "/api/auth/administrator/login", "administrator", { username, password })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not log in. Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
        .then(data => {
            AuthStore.dispatch( { type: "update", key: "authToken", value: data?.authToken } );
            AuthStore.dispatch( { type: "update", key: "refreshToken", value: data?.refreshToken } );
            AuthStore.dispatch( { type: "update", key: "identity", value: username } );
            AuthStore.dispatch( { type: "update", key: "id", value: +(data?.id) } );
            AuthStore.dispatch( { type: "update", key: "role", value: "administrator" } );

            navigate("/auth/admin/dashboard", {
                replace: true,
            });
        })
        .catch(error => {
            setError(error?.message ?? "Could not log in!");

            setTimeout(() => {
                setError("");
            }, 3500);
        });
    };

    return (
        <motion.div className="row"
            initial={{
                position: "relative",
                top: 20,
                scale: 0.95,
                opacity: 0,
            }}
            animate={{
                top: 0,
                scale: 1,
                opacity: 1,
            }}
            transition={{
                delay: 0.125,
                duration: 0.75,
            }}>
            <div className="col col-xs-12 col-md-6 offset-md-3">
                <h1 className="h5 mb-3">Administrator login</h1>

                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Enter your username" value={ username }
                               onChange={ e => setUsername(e.target.value) } />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="password" placeholder="Enter your password" value={ password }
                               onChange={ e => setPassword(e.target.value) }/>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <button className="btn btn-primary px-5" onClick={ () => doLogin() }>
                        Log in
                    </button>
                </div>

                { error && <p className="alert alert-danger">{ error }</p> }
            </div>
        </motion.div>
    );
}