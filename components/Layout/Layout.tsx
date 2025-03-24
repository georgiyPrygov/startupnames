import Head from "next/head";
import Header from "@/components/Header/Header";

export const Layout = props => (
    <div>
        <Head>
            <title>{props.title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Header/>
        <div className="component-content">
            {props.children}
        </div>
    </div>
);

export default Layout;
