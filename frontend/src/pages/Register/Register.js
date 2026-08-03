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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const res = await api.post("/auth/register", {
                tenant_name: formData.tenant_name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            alert(res.data.message);

            navigate("/");

        } catch (err) {

            toast.error(
    err.response?.data?.message || "Something went wrong"
);
        }

    };

    return (

        <div className="register-container">

            <div className="register-card">

                <h2>Multi Tenant Project Management</h2>

                <h4>Create Company Account</h4>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        name="tenant_name"
                        placeholder="Company Name"
                        value={formData.tenant_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p className="login-link">
                    Already have an account?{" "}
                    <Link to="/">Login</Link>
                </p>

            </div>

        </div>

    );

}

export default Register;