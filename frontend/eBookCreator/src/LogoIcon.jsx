
const LogoIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    {...props}
  >
    {/* Open book base */}
    <path
      d="M5.05 7.05C4.15 6.75 3.65 7.35 3.65 8.25V16.25C3.65 18.55 5.15 20.05 7.15 20.05H12.45L14.25 21.45V17.15H8.15C7.35 17.15 6.95 16.75 6.95 16.05V14.55H12.9C13.65 14.55 14.05 14.1 14.05 13.4V11.55C14.05 10.85 13.65 10.45 12.9 10.45H6.95V8.9C6.95 8.2 7.35 7.85 8.15 7.85H15.45C16.3 7.85 16.7 7.35 16.7 6.65V5.15C16.7 4.45 16.3 4.05 15.55 4.05H7.35C6.25 4.05 5.4 4.55 5.05 5.35C4.8 5.9 4.8 6.5 5.05 7.05Z"
      fill="currentColor"
    />

    {/* AI spark — single clean accent instead of 7 scattered particles */}
    <path
      d="M18.4 8.6L19 10.1L20.5 10.7L19 11.3L18.4 12.8L17.8 11.3L16.3 10.7L17.8 10.1L18.4 8.6Z"
      fill="currentColor"
      fillOpacity="0.55"
    />
  </svg>
);

export default LogoIcon;