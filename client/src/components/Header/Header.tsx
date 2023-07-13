import * as styles from "./Header.module.scss";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.header__logo}>STARTUP | <span>NAMES</span></div>
        </header>
    );
};

export default Header;
