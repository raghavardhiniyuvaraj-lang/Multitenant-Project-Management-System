import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import "./Login.css";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
        );

        const company = await api.get("/tenant");

        if (company.data.tenant?.theme_color) {
            document.documentElement.style.setProperty(
                "--primary-color",
                company.data.tenant.theme_color
            );
        }

        toast.success("Login Successful");

        navigate("/dashboard");

    } catch (err) {
        toast.error(
            err.response?.data?.message ||
            "Login Failed"
        );
    }
};

return (
    <div className="login-container">

        <div className="login-card">

            <h2>
                Multi Tenant Project Management
            </h2>

            <p className="login-subtitle">
                Sign in to continue
            </p>

            <form onSubmit={handleLogin}>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                {/* Password */}
                <div className="password-wrapper">

<input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
/>

<button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
>
    {showPassword ? "🙈" : "👁️"}
</button>


</div>


                <button type="submit">
                    Sign In
                </button>

            </form>

            <p className="register-link">
                Don't have an account?{" "}
                <Link to="/register">
                    Sign Up
                </Link>
            </p>

        </div>

    </div>
);


}

export default Login;
