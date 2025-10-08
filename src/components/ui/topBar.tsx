import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
}

export default function TopBar({ title, showLogo = false }: TopBarProps) {
  const navigate = useNavigate();

  const routeMain = () => {
    navigate('/');
  };
  return (
    <>
      {showLogo && (
        <img
          onClick={routeMain}
          src="/2theCore.png"
          alt="2theCore Logo"
          style={{
            height: '40px',
            marginBottom: '5px',
            width: 'auto',
            cursor: 'pointer',
            marginRight: title ? '20px' : '0px'
          }}
        />
      )}
      {title && (
        <h2
          style={{
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '20px',
            flex: 1
          }}
        >
          {title}
        </h2>
      )}
    </>
  );
}
