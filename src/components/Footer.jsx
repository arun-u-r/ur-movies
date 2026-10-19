import { useState } from "react";
import "../assets/Footer.css";

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <footer className="site-footer">
      <div className="footer-actions" aria-label="Developer links">
        
        <button
          className="footer-icon-link"
          type="button"
          aria-label="About the developer"
          aria-expanded={showAbout}
          aria-controls="footer-about"
          title="About the developer"
          onClick={() => setShowAbout((shown) => !shown)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="8"
              r="3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4.5 20a7.5 7.5 0 0 1 15 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {showAbout && (
        <section className="footer-about" id="footer-about">
          <h2>About the developer {`</>`} </h2>
          <p className="mt-3">Created by Arun.U.R</p>
          <a
            className="footer-icon-link footer-about-github"
            href="https://github.com/arun-u-r"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Arun on GitHub (opens in a new tab)"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.53.23 2.67.12 2.95.71.78 1.14 1.77 1.14 2.99 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z"
              />
            </svg>
          </a>
        </section>
      )}
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Arun.U.R. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
