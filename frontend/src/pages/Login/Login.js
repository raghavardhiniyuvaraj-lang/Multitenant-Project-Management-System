import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
             
            const company = await api.get("/tenant");

document.documentElement.style.setProperty(
    "--primary-color",
    company.data.tenant.theme_color
);
            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.message || "Login Failed"
            );

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>Multi Tenant Project Management</h2>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">

                        Login

                    </button>

                </form>
                <p className="register-link">
    Don't have an account?{" "}
    <Link to="/register">
        Create Company Account
    </Link>
</p>

            </div>

        </div>

    );

}

export default Login;