import styles from './Footer.module.css';
import { GITHUB_REPO_URL } from '../../constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {year} English From Zero. Học tiếng Anh giao tiếp từ con số 0.
        </p>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Author: Nguyễn Hoàng Đức
        </a>
      </div>
    </footer>
  );
}
