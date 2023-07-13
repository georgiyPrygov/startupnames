import "../styles/global.css";
import Layout from "@/components/Layout/Layout";

const MyApp = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
};
export default MyApp;
