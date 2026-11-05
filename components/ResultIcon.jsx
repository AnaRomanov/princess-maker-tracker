"use client";

// Green check and lilac magical spiral are inline vector artwork for crisp scaling.
export default function ResultIcon({ value }) {
  if (value === 2) {
    return (
      <span className="result-icon success" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="19.5" fill="#E7F5DF" stroke="#5A9B66" strokeWidth="2.5" />
          <path d="M12.6 24.7 20.3 32.2 35.6 16.6" stroke="#25844B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.6 24.7 20.3 32.2 35.6 16.6" stroke="#83CC8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (value === 3) {
    return (
      <span className="result-icon great" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M37.5 23.2c2.1-11.2-10.1-18.4-20.2-12-11.9 7.6-9.9 23.7 1.6 28.4 10.1 4.1 21-3.6 20.8-13.2-.1-7.7-9.9-12.8-16.7-8.7-6.2 3.8-5.4 12.2.2 14.8 5.5 2.6 11-1.7 9.6-6.9-1-4-6.8-5.4-8.8-2.5-1.6 2.3.7 4.6 2.5 4.1"
            stroke="#7F4EB5"
            strokeWidth="4.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 6.2v6.4M6.8 9.4h6.4M39.5 34.3v6.4M36.3 37.5h6.4" stroke="#BD92E9" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="31.5" cy="8.7" r="1.7" fill="#D6B5FA" />
          <circle cx="12.1" cy="39.7" r="1.4" fill="#D6B5FA" />
        </svg>
      </span>
    );
  }
  if (value === 1) {
    return (
      <span className="result-icon missed" aria-hidden="true">
        ✕
      </span>
    );
  }
  return <>·</>;
}

export function blockResultIcon(res) {
  if (res?.label === "Great success") return <ResultIcon value={3} />;
  if (res?.label === "Success") return <ResultIcon value={2} />;
  return <ResultIcon value={1} />;
}
