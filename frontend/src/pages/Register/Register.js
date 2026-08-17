import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import "./Register.css";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
    tenant_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

const handleRegister = async (e) => {
    e.preventDefault();

    if (
        formData.password !==
        formData.confirmPassword
    ) {
        toast.error("Passwords do not match");
        return;
    }

    try {
        const res = await api.post(
            "/auth/register",
            {
                tenant_name:
                    formData.tenant_name,
                username:
                    formData.username,
                email:
                    formData.email,
                password:
                    formData.password
            }
        );

        toast.success(
            res.data.message ||
            "Registration Successful"
        );

        navigate("/");

    } catch (err) {
        toast.error(
            err.response?.data?.message ||
            "Registration Failed"
        );
    }
};

return (
    <div className="register-container">

        <div className="register-card">

            <h2>
                Multi Tenant Project Management
            </h2>

            <p className="register-subtitle">
                Create your company account
            </p>

            <form onSubmit={handleRegister}>

                {/* Company Name */}
                <input
                    type="text"
                    name="tenant_name"
                    placeholder="Company Name"
                    value={formData.tenant_name}
                    onChange={handleChange}
                    required
                />

                {/* Username */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Password */}
                <div className="password-wrapper">

<input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
/>

<button
    type="button"
    className="password-toggle"
    onClick={() =>
        setShowPassword(!showPassword)
    }
>
    {showPassword ? "🙈" : "👁️"}
</button>

</div>

                {/* Confirm Password */}
                <div className="password-wrapper">

<input
    type={
        showConfirmPassword
            ? "text"
            : "password"
    }
    name="confirmPassword"
    placeholder="Confirm Password"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
/>

<button
    type="button"
    className="password-toggle"
    onClick={() =>
        setShowConfirmPassword(
            !showConfirmPassword
        )
    }
>
    {showConfirmPassword ? "🙈" : "👁️"}
</button>

</div>

                <button type="submit">
                    Create Account
                </button>

            </form>

            <p className="login-link">
                Already have an account?{" "}
                <Link to="/">
                    Sign In
                </Link>
            </p>

        </div>

    </div>
);

}

export default Register;
