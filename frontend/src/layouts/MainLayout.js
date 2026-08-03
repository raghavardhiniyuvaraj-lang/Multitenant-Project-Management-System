import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

    return (
        <>
            <Sidebar />

            <Navbar />

            <div
                style={{
                    marginLeft: "250px",
                    marginTop: "70px",
                    padding: "30px"
                }}
            >
                {children}
            </div>
        </>
    );
}

export default MainLayout;