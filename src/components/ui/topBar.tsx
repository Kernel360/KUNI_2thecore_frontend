interface TopBarProps {
  title?: string;
  showLogo?: boolean;
}

export default function TopBar({ title, showLogo = false }: TopBarProps) {
  return (
    <header
      style={{
        width: '100%',
        padding: '1rem 0 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {showLogo ? (
          <img
            src="/2theCore.png"
            alt="2theCore Logo"
            style={{
              height: '80px',
              width: 'auto',
              paddingBottom: '8px',
              objectFit: 'contain',
            }}
          />
        ) : (
          <h2
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '20px',
              width: '100%',
              paddingBottom: '8px',
            }}
          >
            {title}
          </h2>
        )}
      </div>
    </header>
  );
}
