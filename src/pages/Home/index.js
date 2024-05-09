import './index.css';
import { useAuth } from "../../hooks/useAuth";

function Home() {
    const { loginUser } = useAuth();

    const login = async () => {
        await loginUser({user: 'test_user', password: 'Password123!'});
    }

    login();

    return (
        <>
            <div className="bg-white flex relative z-20 items-center overflow-hidden p-5">
                Desde el inicio
            </div>
        </>
    );
}

export default Home;
