import styles from "./FormFlat.module.css";

export function FormFlat({ children, onSubmit }) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
        </form>
    );
}
